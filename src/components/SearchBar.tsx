"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAzureLanguage } from "@/hooks/useAzureLanguage";

// ── Props ────────────────────────────────────────────────────────────────

interface SearchBarProps {
  /** Called with the debounced search value (300ms) */
  onSearch: (query: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Initial value */
  initialValue?: string;
  /** Visual variant */
  variant?: "default" | "hero";
}

// ── Component ────────────────────────────────────────────────────────────

export default function SearchBar({
  onSearch,
  placeholder = "Cari destinasi, pulau, atau kategori...",
  initialValue = "",
  variant = "default",
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isAnalyzing,
    keyPhrases,
    detectedLanguage,
    isoCode,
    analyzeSearchQuery,
    clearAnalysis,
  } = useAzureLanguage();

  // ── Debounced search callback ────────────────────────────────────────
  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onSearch(query);
      }, 300);
    },
    [onSearch]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
    analyzeSearchQuery(newValue);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
    clearAnalysis();
    inputRef.current?.focus();
  };

  const appendPhrase = (phrase: string) => {
    const newVal = value ? `${value} ${phrase}` : phrase;
    setValue(newVal);
    debouncedSearch(newVal);
    analyzeSearchQuery(newVal);
  };

  // ── Variant styles ───────────────────────────────────────────────────
  const isHero = variant === "hero";

  const containerBase = isHero
    ? "bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl shadow-black/10"
    : "bg-white border-amber-300/70 shadow-sm";

  const inputBase = isHero
    ? "text-white placeholder:text-amber-200/50"
    : "text-amber-950 placeholder:text-amber-400";

  const iconColor = isHero ? "text-amber-300" : "text-amber-500";

  return (
    <motion.div
      id="search-bar"
      animate={{
        scale: isFocused ? 1.015 : 1,
        boxShadow: isFocused
          ? isHero
            ? "0 0 0 3px rgba(251,191,36,0.25), 0 20px 60px -12px rgba(0,0,0,0.3)"
            : "0 0 0 3px rgba(217,119,6,0.15), 0 4px 16px -4px rgba(0,0,0,0.08)"
          : "none",
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`relative flex items-center rounded-2xl border transition-colors duration-200 ${containerBase} ${
        isFocused
          ? isHero
            ? "border-amber-400/50"
            : "border-amber-500"
          : ""
      }`}
    >
      {/* Search icon */}
      <Search
        className={`absolute left-4 h-5 w-5 transition-colors duration-200 ${iconColor} ${
          isFocused ? (isHero ? "text-amber-200" : "text-amber-600") : ""
        }`}
      />

      {/* Input */}
      <input
        ref={inputRef}
        id="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`w-full rounded-2xl bg-transparent py-4 pl-12 pr-12 text-base outline-none transition-all ${inputBase}`}
      />

      {/* Clear button — appears when text exists */}
      <AnimatePresence>
        {value.length > 0 && (
          <motion.button
            id="search-clear"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            onClick={handleClear}
            className={`absolute right-4 flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              isHero
                ? "bg-white/15 text-white/70 hover:bg-white/25 hover:text-white"
                : "bg-amber-100 text-amber-600 hover:bg-amber-200 hover:text-amber-800"
            }`}
            aria-label="Hapus pencarian"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Azure AI Badges & Chips (absolute positioned underneath) */}
      <div className="absolute top-full left-0 mt-3 w-full">
        {/* Helper text row */}
        <div className="flex px-2 justify-between items-start mb-2">
          {/* Azure Analyzing indicator */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 text-[10px] uppercase font-bold text-blue-600 shadow-sm"
              >
                <Sparkles className="h-3 w-3" />
                <span className="hidden sm:inline">Azure AI Menganalisa</span>
                <span className="sm:hidden">Azure AI</span>
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-1 h-1 rounded-full bg-blue-500 ml-0.5"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Language indicator */}
          <AnimatePresence>
            {!isAnalyzing && detectedLanguage && isoCode && isoCode !== "id" && value.length > 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-1.5 ml-auto text-xs font-medium text-amber-700/80 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-md border border-amber-200/40"
              >
                <AlertCircle className="h-3 w-3" />
                Mencari dalam bahasa <span className="font-bold underline decoration-amber-300 underline-offset-2">{detectedLanguage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Extracted Key Phrases list */}
        <AnimatePresence>
          {keyPhrases.length > 0 && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-wrap gap-2 px-2"
            >
              {keyPhrases.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => appendPhrase(phrase)}
                  className="flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200/60 rounded-full px-3 py-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 mr-1 opacity-60" />
                  + {phrase}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
