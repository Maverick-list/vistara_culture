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

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const aiMsgId = generateId();
      
      // Inject an empty AI bubble that we will populate via stream
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        },
      ]);

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

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg],
            destinationContext: activeDestination,
            sessionId,
          }),
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil respon dari server.");
        }

        if (!res.body) throw new Error("Tidak ada stream response");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let chunks = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const textChunk = decoder.decode(value, { stream: true });
          chunks += textChunk;
          
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId ? { ...m, content: m.content + textChunk } : m
            )
          );
        }
      } catch (error) {
        console.error("Chat Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: "Maaf, terjadi kesalahan atau koneksi terputus. Silakan coba lagi.",
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
