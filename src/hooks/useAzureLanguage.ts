"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface UseAzureLanguageReturn {
  isAnalyzing: boolean;
  keyPhrases: string[];
  detectedLanguage: string | null;
  isoCode: string | null;
  analyzeSearchQuery: (query: string) => void;
  clearAnalysis: () => void;
}

export function useAzureLanguage(): UseAzureLanguageReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keyPhrases, setKeyPhrases] = useState<string[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isoCode, setIsoCode] = useState<string | null>(null);
  
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Keep track of the active request to ignore stale responses
  const requestCounter = useRef(0);

  const clearAnalysis = useCallback(() => {
    setKeyPhrases([]);
    setDetectedLanguage(null);
    setIsoCode(null);
    setIsAnalyzing(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    requestCounter.current += 1;
  }, []);

  const analyzeSearchQuery = useCallback((query: string) => {
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (!trimmed) {
      clearAnalysis();
      return;
    }

    // Debounce for 500ms
    debounceRef.current = setTimeout(async () => {
      const currentReqId = ++requestCounter.current;
      setIsAnalyzing(true);
      
      try {
        // Run both analyze endpoints concurrently
        const [searchRes, langRes] = await Promise.all([
          fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: trimmed, type: "search" }),
          }),
          fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: trimmed, type: "language" }),
          }),
        ]);

        // If a new request was fired while we were fetching, discard this one
        if (currentReqId !== requestCounter.current) return;

        let newPhrases: string[] = [];
        let newLang: string | null = null;
        let newIso: string | null = null;

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.keyPhrases) {
            newPhrases = searchData.keyPhrases;
          }
        }

        if (langRes.ok) {
          const langData = await langRes.json();
          if (langData.language) {
            newLang = langData.language;
            newIso = langData.isoCode;
          }
        }

        setKeyPhrases(newPhrases);
        setDetectedLanguage(newLang);
        setIsoCode(newIso);

      } catch (error) {
        console.error("Azure Analysis Hook Error:", error);
      } finally {
        if (currentReqId === requestCounter.current) {
          setIsAnalyzing(false);
        }
      }
    }, 500);
  }, [clearAnalysis]);

  // Cleanup on unmount
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
    analyzeSearchQuery,
    clearAnalysis,
  };
}
