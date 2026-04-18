import { type NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback UI data if no API key is provided
    const fallbackData = {
      judul: "Itinerary Budaya Nusantara (Demo Mode)",
      narasi: "Perjalanan ini dirancang untuk memperkenalkan Anda pada harmoni antara alam dan tradisi di Indonesia. Karena kunci API belum disetel, ini adalah contoh struktur rencana perjalanan.",
      estimasi_biaya: "Rp 3.500.000 - Rp 7.000.000",
      hari: [
        {
          hari: 1,
          tema: "Pencerahan Pagi & Filosofi Struktur",
          transisi: "Transportasi darat antar candi disarankan menggunakan jasa sewa mobil lokal.",
          aktivitas: [
            {
              waktu: "Pagi",
              tempat: "Candi Borobudur",
              deskripsi: "Menyaksikan matahari terbit dari stupa tertinggi untuk merasakan ketenangan spiritual.",
              makna_budaya: "Simbol perjalanan dari alam nafsu menuju pencerahan (Nirvana)."
            },
            {
              waktu: "Siang",
              tempat: "Panti Asuhan Budaya Sekitar",
              deskripsi: "Makan siang dengan hidangan organik khas Magelang sambil berinteraksi dengan warga desa.",
              makna_budaya: "Prinsip gotong-royong dan kebersamaan masyarakat pedesaan."
            }
          ]
        }
      ]
    };

    if (!apiKey) {
      return Response.json(fallbackData, { status: 200 });
    }

    const body = await req.json();
    const destinations = body.destinations || [];
    const preferences = body.preferences || "";

    if (destinations.length === 0) {
      return Response.json({ error: "No destinations selected" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `Kamu adalah NusantaraGuide AI, ahli perencana perjalanan budaya Indonesia.
Buat itinerary wisata budaya yang sangat mendalam berdasarkan pilihan destinasi pengguna.
Fokus pada: EFISIENSI GEOGRAFIS, NARASI FILOSOFIS, dan TIPS LOKAL.

FORMAT OUTPUT WAJIB: JSON MURNI (tanpa markdown, tanpa teks tambahan).
Struktur JSON:
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
        { "waktu": "Pagi/Siang/Sore/Malam", "tempat": "...", "deskripsi": "...", "makna_budaya": "..." }
      ]
    }
  ]
}`;

    const prompt = `Buat itinerary untuk destinasi berikut:
${destinations.map((d: any) => `- ${d.destination.nama} (Kategori: ${d.destination.kategori}, Lokasi: ${d.destination.provinsi})`).join("\n")}

Preferensi: ${preferences}`;

    console.log("[INFO] Meminta Itinerary dari Gemini...");
    const result = await model.generateContent([systemPrompt, prompt]);
    const responseText = result.response.text().trim();

    // Clean response if AI adds markdown blocks
    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
    
    try {
      const parsed = JSON.parse(cleanedJson);
      return Response.json(parsed, { status: 200 });
    } catch (e) {
      console.error("[ERROR] Gagal parse JSON dari Gemini:", cleanedJson);
      // If parsing fails, return fallback with a warning or retry logic (for now fallback)
      return Response.json({ ...fallbackData, judul: "Gagal memproses AI (JSON Error)" }, { status: 200 });
    }

  } catch (error: any) {
    console.error("Itinerary API Error:", error);
    return Response.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
