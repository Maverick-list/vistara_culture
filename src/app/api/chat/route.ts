import { type NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const BASE_SYSTEM_PROMPT = `Kamu adalah NusantaraGuide, pemandu wisata budaya Indonesia yang berpengetahuan sangat dalam. Keahlianmu bukan sekadar info lokasi, tapi memahami JIWA di balik setiap tempat — filosofi, ritual, makna simbolis, hubungan dengan kosmologi lokal, dan bagaimana budaya ini tetap hidup hari ini. Gaya bicara: hangat seperti sahabat yang juga sarjana budaya. Selalu akhiri dengan 1 pertanyaan yang membuka perspektif baru.`;

export async function POST(req: NextRequest) {
  console.log("=== API /api/chat DIPANGGIL (GEMINI) ===");
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[ERROR] GEMINI_API_KEY tidak ditemukan di .env.local");
      return Response.json(
        { error: "Konfigurasi server bermasalah (API Key missing)." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages, destinationContext } = body;

    if (!messages || !Array.isArray(messages)) {
      console.error("[ERROR] Format pesan tidak valid:", body);
      return Response.json(
        { error: "Format pesan tidak valid." },
        { status: 400 }
      );
    }

    let systemPrompt = BASE_SYSTEM_PROMPT;
    if (destinationContext && destinationContext.nama) {
      systemPrompt += `\n\nDestinasi aktif: ${destinationContext.nama}. ${destinationContext.konteks_budaya || ""} ${destinationContext.filosofi || ""}`;
    }

    console.log("[INFO] Menginisialisasi Gemini SDK...");
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Gunakan gemini-1.5-flash untuk kecepatan dan akurasi tinggi (murah/gratis & cepat)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt 
    });

    // Format pesan untuk Gemini. Role dalam Gemini adalah 'user' atau 'model'.
    const geminiMessages = messages
      .filter((msg: { role: string }) => msg.role !== "system")
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // Untuk Chat history, kita pisahkan pesan historis dan pesan terakhir dari user
    // Pastikan setidaknya ada satu pesan user di keranjang terakhir
    if (geminiMessages.length === 0) {
      throw new Error("Tidak ada pesan untuk dikirim.");
    }

    const history = geminiMessages.slice(0, -1);
    const lastMessage = geminiMessages[geminiMessages.length - 1].parts[0].text;

    console.log("[INFO] Meminta response streaming dari model gemini-1.5-flash...");
    
    // Inisialisasi percakapan berlanjut
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log("[INFO] Mulai mengirim streaming chunk ke klien...");
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
          console.log("[INFO] Stream selesai.");
        } catch (error) {
          console.error("[ERROR] Gagal membaca stream:", error);
          controller.error(error);
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
  } catch (err: unknown) {
    console.error("[Azure API Crash]", err);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan pada server." }), {
      status: 500,
    });
  }
}
