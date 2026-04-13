import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return a graceful fallback payload for demonstration without keys
      return new Response(
        JSON.stringify({
          judul: "Itinerary Budaya (Demo Mode - No API Key)",
          narasi: "Ini adalah demonstrasi tata letak itinerary. Silakan tambahkan ANTHROPIC_API_KEY di .env.local untuk fungsi AI sesungguhnya.",
          estimasi_biaya: "Rp 5.000.000 - Rp 10.000.000",
          hari: [
            {
              hari: 1,
              tema: "Mengenal Sejarah Lokal",
              transisi: "Gunakan kendaraan sewaan untuk efisiensi",
              aktivitas: [
                {
                  waktu: "Pagi",
                  tempat: "Destinasi Pertama Anda",
                  deskripsi: "Jelajahi keindahan pagi dengan sinar matahari terbit.",
                  makna_budaya: "Simbol awal kehidupan dan semangat baru."
                }
              ]
            }
          ]
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    const body = await req.json();
    const destinations = body.destinations || [];
    const preferences = body.preferences || "";

    const userMessage = `
Tolong buatkan itinerary berdasarkan destinasi dan preferensi berikut.
Destinasi:
${JSON.stringify(destinations, null, 2)}

Preferensi: ${preferences}
`;

    const systemPrompt = `Kamu adalah perancang perjalanan budaya Nusantara (NusantaraGuide AI).
Buat itinerary perjalanan wisata budaya yang immersive berdasarkan destinasi yang diberikan.
PERATURAN MUTLAK:
1. Urutan geografis harus se-efisien mungkin berdasarkan wawasanmu.
2. Harus ada koneksi naratif antar destinasi (ceritakan benang merah budayanya).
3. Jadwal dibagi Pagi/Siang/Sore/Malam per hari.
4. Jangan halusinasi tempat di luar yang dipilih kecuali sekadar tips tempat makan lokal di sekitarnya.
5. Anda WAJIB MENGEMBALIKAN HANYA VALID JSON. TIDAK BOLEH ADA TEKS LAIN SEBELUM/SESUDAH JSON.
Gunakan bentuk JSON ini:
{
  "judul": "...",
  "narasi": "...",
  "estimasi_biaya": "...",
  "hari": [
    {
      "hari": 1,
      "tema": "...",
      "transisi": "...",
      "aktivitas": [
        {
          "waktu": "Pagi",
          "tempat": "...",
          "deskripsi": "...",
          "makna_budaya": "..."
        }
      ]
    }
  ]
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 2000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API Error: ${response.status} ${response.statusText}`);
    }

    // Set up a ReadableStream to parse the Anthropic SSE format and stream only the raw text deltas
    const encoder = new TextEncoder();
    const decoder = new TextDecoder("utf-8");

    const stream = new ReadableStream({
      async start(controller) {
        if (!response.body) {
          controller.close();
          return;
        }

        const reader = response.body.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const dataStr = line.slice(6);
                if (dataStr === "[DONE]") {
                  break;
                }
                
                try {
                  const data = JSON.parse(dataStr);
                  if (data.type === "content_block_delta" && data.delta?.text) {
                    controller.enqueue(encoder.encode(data.delta.text));
                  }
                } catch (e) {
                  // ignore malformed JSON chunk
                }
              }
            }
          }
        } finally {
          controller.close();
          reader.releaseLock();
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
    console.error("Itinerary API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate itinerary" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
