"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// Mem-cache hasil analisis Azure agar tidak spam API untuk query yang sama persis (Map sederhana)
const analysisCache = new Map<string, { keyPhrases: string[]; detectedLanguage: string | null; isoCode: string | null }>();

export function useAzureLanguage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keyPhrases, setKeyPhrases] = useState<string[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isoCode, setIsoCode] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestCounter = useRef(0);

  const clearAnalysis = useCallback(() => {
    setKeyPhrases([]);
    setDetectedLanguage(null);
    setIsoCode(null);
    setIsAnalyzing(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    requestCounter.current += 1;
  }, []);

  const analyzeQuery = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 3) {
      clearAnalysis();
      return;
    }

    // Jika sudah ada di cache, gunakan data tersimpan
    if (analysisCache.has(trimmed)) {
      const cached = analysisCache.get(trimmed)!;
      setKeyPhrases(cached.keyPhrases);
      setDetectedLanguage(cached.detectedLanguage);
      setIsoCode(cached.isoCode);
      return;
    }

    // Debounce tepat 600ms
    debounceRef.current = setTimeout(async () => {
      const currentReqId = ++requestCounter.current;
      setIsAnalyzing(true);

      try {
        const [phrasesRes, langRes] = await Promise.all([
          fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: trimmed, type: "keyphrases" }),
          }),
          fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: trimmed, type: "language" }),
          }),
        ]);

        if (currentReqId !== requestCounter.current) return;

        const phrasesData = await phrasesRes.json();
        const langData = await langRes.json();

        const fetchedPhrases = phrasesData.keyPhrases || [];
        const fetchedLang = langData.language || "id";
        const fetchedIso = langData.isoCode || "id";

        // Simpan ke Cache
        analysisCache.set(trimmed, { 
          keyPhrases: fetchedPhrases, 
          detectedLanguage: fetchedLang,
          isoCode: fetchedIso 
        });

        setKeyPhrases(fetchedPhrases);
        setDetectedLanguage(fetchedLang);
        setIsoCode(fetchedIso);
      } catch (error) {
        console.error("Azure Hook Error:", error);
      } finally {
        if (currentReqId === requestCounter.current) {
          setIsAnalyzing(false);
        }
      }
    }, 600); // 600ms debounce as requested
  }, [clearAnalysis]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    isAnalyzing,
    keyPhrases,
    detectedLanguage,
    isoCode,
    analyzeQuery, // diganti dari analyzeSearchQuery sesuai prompt user
    clearAnalysis,
  };
}
