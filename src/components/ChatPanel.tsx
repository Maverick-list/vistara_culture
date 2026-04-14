"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, User, Bot, Trash2 } from "lucide-react";
import type { Destination } from "@/data/destinations";
import { useChat, type ChatMessage } from "@/hooks/useChat";
import AzureBadge from "@/components/AzureBadge";

// ── Props ────────────────────────────────────────────────────────────────

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination | null;
}

// ── Component ────────────────────────────────────────────────────────────

export default function ChatPanel({
  isOpen,
  onClose,
  destination,
}: ChatPanelProps) {
  const {
    messages,
    isLoading,
    sendMessage,
    setActiveDestination,
    clearChat,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync active destination context
  useEffect(() => {
    if (isOpen) {
      setActiveDestination(destination);
    }
  }, [isOpen, destination, setActiveDestination]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = useCallback(() => {
    const text = inputRef.current?.value.trim();
    if (!text || isLoading) return;
    
    sendMessage(text);
    if (inputRef.current) inputRef.current.value = "";
  }, [isLoading, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (qs: string) => {
    sendMessage(qs);
  };

  const getSuggestedQs = (category?: string) => {
    switch (category) {
      case "Candi & Pura":
      case "Situs Sejarah":
        return [
          "Apa filosofi arsitektur ini?", 
          "Ritual apa yang masih aktif?", 
          "Kapan waktu terbaik kunjungi?", 
          "Apa hubungannya dengan kerajaan lokal?"
        ];
      case "Upacara & Tradisi":
        return [
          "Apa makna simbolis upacara ini?", 
          "Siapa yang boleh hadir?", 
          "Berapa lama ritual berlangsung?", 
          "Bagaimana cara menghormati prosesi?"
        ];
      case "Desa Budaya":
      case "Kuliner Heritage": // Disesuaikan ke Seni/Pertunjukan/Budaya
        return [
          "Apa pesan moral di balik pertunjukan ini?", 
          "Berapa lama berlatih untuk jadi penari?", 
          "Di mana bisa belajar kesenian ini?", 
          "Apa bedanya versi sakral dan profan?"
        ];
      case "Alam & Lanskap":
        return [
          "Apa kearifan lokal menjaga ekosistem ini?", 
          "Suku apa yang mendiami kawasan ini?", 
          "Apa pantangan yang harus dipatuhi wisatawan?", 
          "Bagaimana perubahan iklim mempengaruhi tempat ini?"
        ];
      default:
        return [
          "Apa destinasi budaya tersembunyi di Indonesia?",
          "Jelajahi filosofi batik Jawa",
          "Ritual adat apa yang hampir punah?",
          "Bedanya budaya Jawa dan Sunda?",
          "Tempat budaya terbaik untuk keluarga?",
          "Bagaimana cara menghormati adat lokal?",
        ];
    }
  };

  const suggestedQs = getSuggestedQs(destination?.kategori);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay specifically for the chat panel ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
            // Wait, inside DestinationModal we already have an overlay.
            // But this will overlay the modal content so the drawer stands out.
          />

          {/* ── Chat Drawer Panel ── */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 z-50 flex w-full flex-col bg-white shadow-2xl shadow-black/30 sm:w-[400px] md:h-full md:rounded-r-2xl border-l border-amber-200/50 overflow-hidden h-[100dvh]"
          >
            {/* ── Header ── */}
            <header className="flex items-center justify-between border-b border-amber-100 bg-gradient-to-r from-emerald-700 to-emerald-900 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                  <Sparkles className="h-5 w-5 text-emerald-100" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold tracking-wide">
                    Nusantara AI
                  </h3>
                  <p className="text-xs text-emerald-200 line-clamp-1">
                    Tanya tentang {destination?.nama || "Destinasi"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm("Mulai percakapan baru?")) {
                        clearChat();
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-200 transition-colors hover:bg-white/10 hover:text-white"
                    title="Hapus percakapan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            {/* ── Messages List ── */}
            <div className="flex-1 overflow-y-auto bg-amber-50/50 p-5 no-scrollbar">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <p className="font-display text-lg font-bold text-amber-900">
                    Tanyakan Sesuatu
                  </p>
                  <p className="mt-1 max-w-[250px] text-sm text-amber-700">
                    Saya ahli dalam memandu Anda mengenali sejarah, filosofi,
                    serta tips mengunjungi {destination?.nama}.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-5 pb-4">
                  {messages.map((msg, idx) => (
                    <MessageBubble 
                      key={msg.id} 
                      message={msg} 
                      isLast={idx === messages.length - 1}
                      isTyping={isLoading && idx === messages.length - 1}
                    />
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex items-end gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-2xl rounded-bl-sm bg-white border border-amber-200/50 px-4 py-3 shadow-sm flex items-center gap-1">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* ── Suggested Questions ── */}
            {suggestedQs.length > 0 && messages.length === 0 && !isLoading && (
              <div className="bg-amber-50 px-4 pb-2 pt-0 w-full overflow-x-auto no-scrollbar border-t border-amber-200/30">
                <div className="flex gap-2 w-max">
                  {suggestedQs.map((qs, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(qs)}
                      className="whitespace-nowrap cursor-pointer rounded-full bg-white border border-amber-200/60 px-3 py-1.5 text-[11px] font-medium text-amber-900 transition hover:bg-amber-100 hover:border-amber-300 shadow-sm"
                    >
                      {qs}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Input Area ── */}
            <div className="border-t border-amber-200/50 bg-white p-4">
              <div className="flex justify-center mb-3">
                <AzureBadge isActive={isLoading} />
              </div>
              <div className="relative flex items-end bg-amber-50 rounded-2xl border border-amber-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all p-2">
                <textarea
                  ref={inputRef as any}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanya tentang tempat ini (Shift+Enter untuk baris baru)..."
                  className="w-full max-h-32 min-h-[44px] resize-none bg-transparent py-2.5 px-3 text-sm text-amber-950 placeholder-amber-400 outline-none no-scrollbar"
                  disabled={isLoading}
                  rows={1}
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="mb-1 mr-1 flex shrink-0 h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600"
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Subcomponent: Message Bubble ─────────────────────────────────────────

function MessageBubble({ 
  message, 
  isLast, 
  isTyping 
}: { 
  message: ChatMessage; 
  isLast?: boolean; 
  isTyping?: boolean; 
}) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="rounded-full bg-amber-200/50 px-3 py-1 text-[11px] font-medium tracking-wide text-amber-700 uppercase">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-amber-500 text-white"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "rounded-br-sm bg-amber-600 text-white"
            : "rounded-bl-sm border border-amber-200/50 bg-white text-amber-950"
        }`}
      >
        <p className={`text-sm whitespace-pre-wrap leading-relaxed ${isUser ? "text-amber-50" : "text-amber-900/90"}`}>
          {message.content}
          {!isUser && isTyping && isLast && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-1.5 h-3.5 ml-1 align-middle bg-emerald-600"
            />
          )}
        </p>
      </div>
    </motion.div>
  );
}
