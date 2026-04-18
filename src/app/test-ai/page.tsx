"use client";

import { useState } from "react";

export default function TestAIPage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setResponse("");
    setError("");

    try {
      console.log("Mengirim request ke /api/chat...");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error ${res.status}`);
      }

      if (!res.body) throw new Error("Tidak ada stream response");

      console.log("Membaca stream response...");
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream selesai.");
          break;
        }

        const textChunk = decoder.decode(value, { stream: true });
        setResponse((prev) => prev + textChunk);
      }
    } catch (err: any) {
      console.error("Fetch API Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-emerald-900 border-b pb-2">
          Test AI Chat API Lgsg (Tanpa UI ChatPanel)
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-amber-200 rounded-lg p-3 mb-3 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            rows={4}
            placeholder="Ketik pesan testing (contoh: 'Ceritakan tentang Candi Borobudur')..."
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Mengirim..." : "Kirim"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 border border-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="bg-amber-50/50 border border-amber-200 p-5 rounded-lg min-h-[150px] whitespace-pre-wrap text-amber-950">
          <strong className="block mb-3 text-emerald-800 border-b pb-2 border-amber-200/50">
            Raw Output:
          </strong>
          {response || <span className="text-amber-500/50 italic">Hasil streaming akan muncul di sini...</span>}
        </div>
      </div>
    </div>
  );
}
