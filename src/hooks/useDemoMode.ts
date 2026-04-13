"use client";

import { useState, useEffect } from "react";
import { DEMO_CONVERSATIONS, FALLBACK_DEMO_RESPONSE } from "@/lib/demo-data";

export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check URL
    const params = new URLSearchParams(window.location.search);
    const hasDemoParam = params.get("demo") === "true";
    
    // Check Local Storage
    const hasLocalStore = localStorage.getItem("demoMode") === "true";

    if (hasDemoParam) {
      localStorage.setItem("demoMode", "true");
      setIsDemoMode(true);
      // Clean up URL visually
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (hasLocalStore) {
      setIsDemoMode(true);
    }
  }, []);

  /**
   * Evaluates the user query to find the best demo response.
   */
  const getDemoResponseText = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    // Find first conversation where ALL keywords in the conversation's required keywords match something in the message
    // Actually, simple OR fuzzy matching is better:
    let bestMatch = null;
    let maxMatchedKeywords = 0;

    for (const conv of DEMO_CONVERSATIONS) {
      const matchedKeywords = conv.keywords.filter((kw) => lowerMsg.includes(kw)).length;
      if (matchedKeywords > maxMatchedKeywords) {
        maxMatchedKeywords = matchedKeywords;
        bestMatch = conv.response;
      }
    }

    // Minimum match is 1 keyword. If none match, use fallback
    return maxMatchedKeywords >= 1 && bestMatch ? bestMatch : FALLBACK_DEMO_RESPONSE;
  };

  /**
   * Creates an artificial Async Generator that yields text chunks
   * simulating an LLM streaming response with 20ms delays.
   */
  async function* simulateSimulatedStream(userMessage: string) {
    const fullText = getDemoResponseText(userMessage);
    const chunkSize = 4; // characters per tick
    
    // Initial artificial thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    for (let i = 0; i < fullText.length; i += chunkSize) {
      const chunk = fullText.slice(i, i + chunkSize);
      yield chunk;
      // Randomize delay slightly to look organic
      const delay = Math.floor(Math.random() * 20) + 10;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return { isDemoMode, simulateSimulatedStream };
}
