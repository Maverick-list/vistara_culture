import { type NextRequest } from "next/server";

// ── Rate Limiting (In-Memory) ────────────────────────────────────────────
// In a serverless environment like Vercel, this map resets occasionally,
// but it suffices for basic abuse prevention.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const MAX_REQUESTS_PER_MINUTE = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return true; // Allowed
  }

  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return false; // Rate limited
  }

  record.count += 1;
  return true; // Allowed
}

// ── System Prompt Template ───────────────────────────────────────────────

const BASE_SYSTEM_PROMPT = `Kamu adalah NusantaraGuide, pemandu wisata budaya Indonesia yang berpengetahuan sangat dalam. Keahlianmu bukan sekadar info lokasi, tapi memahami JIWA di balik setiap tempat — filosofi, ritual, makna simbolis, hubungan dengan kosmologi lokal, dan bagaimana budaya ini tetap hidup hari ini. Gaya bicara: hangat seperti sahabat yang juga sarjana budaya. Selalu akhiri dengan 1 pertanyaan yang membuka perspektif baru.`;

export async function POST(req: NextRequest) {
  try {
    // 1. Check Rate Limit
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Terlalu banyak permintaan. Silakan tunggu beberapa saat lagi." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Parse Request
    const body = await req.json();
    const { messages, destinationContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Format pesan tidak valid." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Construct Context-Aware System Prompt
    let systemPrompt = BASE_SYSTEM_PROMPT;
    if (destinationContext && destinationContext.nama) {
      systemPrompt += `\n\nDestinasi aktif: ${destinationContext.nama}. ${destinationContext.konteks_budaya || ""} ${destinationContext.filosofi || ""}`;
    }

    // 4. API Key Verification
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is not defined in environment variables.");
      return new Response(
        JSON.stringify({ error: "Konfigurasi server bermasalah (API Key missing)." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Anthropic API requires roles to be strictly 'user' or 'assistant'.
    // Remove 'id' and 'timestamp', map 'system' to 'assistant' if it exists.
    const anthropicMessages = messages.map((msg: any) => ({
      role: msg.role === "system" ? "assistant" : msg.role,
      content: msg.content,
    }));

    // 5. Call Anthropic Message API with streaming via fetch
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307", // Fast, highly capable model
        max_tokens: 1024,
        system: systemPrompt,
        messages: anthropicMessages,
        stream: true,
      }),
    });

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.text();
      console.error("Anthropic API Error:", errorData);
      return new Response(
        JSON.stringify({ error: "Gagal menyambung ke AI provider." }),
        { status: anthropicResponse.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // 6. Transform Anthropic SSE stream to a continuous text stream for the client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder("utf-8");

    const stream = new ReadableStream({
      async start(controller) {
        if (!anthropicResponse.body) return controller.close();

        const reader = anthropicResponse.body.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunkStr = decoder.decode(value, { stream: true });
            
            // SSE chunks are often broken up. Extract 'data: {...}'
            const lines = chunkStr.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const dataString = line.substring(6);
                if (dataString === "[DONE]") {
                  continue;
                }
                try {
                  const data = JSON.parse(dataString);
                  // We only care about content blocks representing text delta
                  if (data.type === "content_block_delta" && data.delta?.type === "text_delta") {
                    controller.enqueue(encoder.encode(data.delta.text));
                  }
                } catch (e) {
                  // Incomplete JSON or other issue, ignore safely
                }
              }
            }
          }
        } catch (err) {
          console.error("Stream reading error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan pada server." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
