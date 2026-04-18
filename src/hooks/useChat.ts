"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Destination } from "@/data/destinations";
import { useDemoMode } from "@/hooks/useDemoMode";

// ── Types ────────────────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface UseChatReturn {
  /** All messages in the current session */
  messages: ChatMessage[];
  /** Whether the AI is generating a response */
  isLoading: boolean;
  /** The destination the chat is currently about */
  activeDestination: Destination | null;
  /** Unique session identifier */
  sessionId: string;

  // ── Actions ──────────────────────────────────────────────────────────
  /** Send a user message (triggers AI response placeholder) */
  sendMessage: (text: string) => void;
  /** Set the destination context for the chat */
  setActiveDestination: (destination: Destination | null) => void;
  /** Clear all messages in the current session */
  clearChat: () => void;
  /** Reset to a fresh session with a new ID */
  resetSession: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateSessionId(): string {
  return `nusantara-chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function storageKey(sessionId: string): string {
  return `nusantara-chat-${sessionId}`;
}

function loadMessages(sessionId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(storageKey(sessionId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(sessionId: string, messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(storageKey(sessionId), JSON.stringify(messages));
  } catch {
    // sessionStorage full — silently fail
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────

export function useChat(): UseChatReturn {
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window === "undefined") return generateSessionId();
    const existing = sessionStorage.getItem("nusantara-active-session");
    return existing ?? generateSessionId();
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadMessages(sessionId)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeDestination, setActiveDestinationState] =
    useState<Destination | null>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isDemoMode, simulateSimulatedStream } = useDemoMode();

  // ── Persist session ID ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("nusantara-active-session", sessionId);
    }
  }, [sessionId]);

  // ── Persist messages whenever they change ─────────────────────────────
  useEffect(() => {
    saveMessages(sessionId, messages);
  }, [sessionId, messages]);

  // ── Cleanup on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      // Pastikan max 10 pesan terakhir di state
      const updatedMessages = [...messages, userMsg].slice(-10);
      setMessages(updatedMessages);
      setIsLoading(true);

      const aiMsgId = generateId();
      
      // Inject an empty AI bubble that we will populate via stream (pastikan limit 10 juga)
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        },
      ].slice(-10));

      try {
        if (isDemoMode) {
          try {
            for await (const chunk of simulateSimulatedStream(text.trim())) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId ? { ...m, content: m.content + chunk } : m
                )
              );
            }
          } finally {
            setIsLoading(false);
          }
          return;
        }

        // Mulai perbaikan fetch / streaming di `useChat.ts` (Sesuai tugas)
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages, // Mengirim 10 terakhir
            destinationContext: activeDestination,
            sessionId,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Gagal fetch data: HTTP ${res.status}`);
        }

        if (!res.body) throw new Error("Tidak ada stream response dari server");

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const textChunk = decoder.decode(value, { stream: true });
          
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId ? { ...m, content: m.content + textChunk } : m
            )
          );
        }
      } catch (error: unknown) {
        console.error("Chat Error:", error);
        
        // Tampilkan error toast sbg ganti alert atau notifikasi sesuai requirement `Tampilkan error toast jika fetch gagal`
        if (typeof window !== "undefined") {
          const errMsg = error instanceof Error ? error.message : String(error);
          alert(`Error Chat: ${errMsg}`);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: "Maaf, terjadi kesalahan atau koneksi terputus. Pastikan API key sudah benar dan coba lagi.",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, activeDestination, sessionId, isDemoMode, simulateSimulatedStream]
  );

  const setActiveDestination = useCallback(
    (destination: Destination | null) => {
      setActiveDestinationState(destination);

      // Add a system message when destination context changes
      if (destination) {
        const systemMsg: ChatMessage = {
          id: generateId(),
          role: "system",
          content: `Konteks dialihkan ke: ${destination.nama} (${destination.kategori} — ${destination.pulau})`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, systemMsg]);
      }
    },
    []
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    saveMessages(sessionId, []);
  }, [sessionId]);

  const resetSession = useCallback(() => {
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);

    const newId = generateSessionId();
    setSessionId(newId);
    setMessages([]);
    setIsLoading(false);
    setActiveDestinationState(null);
    saveMessages(newId, []);
  }, []);

  return {
    messages,
    isLoading,
    activeDestination,
    sessionId,
    sendMessage,
    setActiveDestination,
    clearChat,
    resetSession,
  };
}
