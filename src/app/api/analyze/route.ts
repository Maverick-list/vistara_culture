import { type NextRequest } from "next/server";

const AZURE_ENDPOINT = process.env.AZURE_LANGUAGE_ENDPOINT?.replace(/\/$/, "");
const AZURE_KEY = process.env.AZURE_LANGUAGE_KEY;

export async function POST(req: NextRequest) {
  try {
    const { text, type } = await req.json();

    if (!text || !type || !["search", "language", "sentiment"].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!AZURE_ENDPOINT || !AZURE_KEY) {
      console.warn("Azure AI Language credentials missing. Returning graceful null.");
      return new Response(JSON.stringify({ result: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiUrl = `${AZURE_ENDPOINT}/language/:analyze-text?api-version=2023-04-01`;
    let kind = "";
    
    if (type === "search") {
      kind = "KeyPhraseExtraction";
    } else if (type === "language") {
      kind = "LanguageDetection";
    } else if (type === "sentiment") {
      kind = "SentimentAnalysis";
    }

    const payload = {
      kind,
      parameters: { modelVersion: "latest" },
      analysisInput: {
        documents: [
          {
            id: "1",
            text,
            ...(type === "search" ? { language: "id" } : {}),
          },
        ],
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Azure API Error: ${response.status} ${response.statusText}`);
      // Graceful fallback
      return new Response(JSON.stringify({ result: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    
    // Parse response
    const docResult = data?.results?.documents?.[0];
    if (!docResult) {
      return new Response(JSON.stringify({ result: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (type === "search") {
      return new Response(
        JSON.stringify({
          result: null, // ensure backwards compat struct if needed
          keyPhrases: docResult.keyPhrases || [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } 
    
    if (type === "language") {
      const languageObj = docResult.detectedLanguage;
      return new Response(
        JSON.stringify({
          result: null,
          language: languageObj?.name || null,
          isoCode: languageObj?.iso6391Name || null,
          confidence: languageObj?.confidenceScore || 0,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ result: docResult }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("API Analyze Error:", error);
    // Graceful fallback
    return new Response(JSON.stringify({ result: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
