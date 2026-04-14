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
   * simulating an LLM streaming response with natural sentence pacing.
   */
  async function* simulateSimulatedStream(userMessage: string) {
    const fullText = getDemoResponseText(userMessage);
    
    // 1. Initial artificial thinking delay (800ms)
    // The UI should show the typing indicator during this time
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 2. Split text into "chunks" or sentences for more natural flow
    // We split by punctuation followed by a space
    const chunks = fullText.split(/(?<=[.!?])\s+/);

    for (const chunk of chunks) {
      const sentence = chunk + " ";
      
      // Yield characters within each sentence with variable speed
      for (let i = 0; i < sentence.length; i++) {
        yield sentence[i];
        
        // Randomize typing speed: 25-40ms (non-robotic)
        const delay = Math.floor(Math.random() * 15) + 25;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      
      // Small breath after each sentence (100-200ms)
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100 + 100));
    }
  }

  return { isDemoMode, simulateSimulatedStream };
}
