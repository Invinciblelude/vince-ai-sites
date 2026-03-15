"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSpeechToText } from "@/lib/use-speech-to-text";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const TRION_FALLBACK_PROMPT = `You are Trion — the AI business consultant from Trion Express. You ARE the product demo.

ABOUT TRION: AI business agent that answers, logs, books, and collects reviews 24/7. Delivers AI-powered websites, AI assistants, booking, CRM, reviews, reminders — all automated.

PACKAGES: Launch $500–$1,500 setup | Trion Ultra $750–$2,000 + $49–$199/mo (BEST). Recurring revenue model. Live in 24hrs.

UNIVERSAL PRO MODEL — When they paste a job posting, role description, or business info:
Switch to STRATEGIST mode. Extract core needs (5–10 bullets by theme), hidden goals/pain points, design TRION as a service (strategy, systems, coordination, reporting), define 2–3 packages (Fractional retainer, Done-with-you, One-time setup), write outreach script, note industry adaptations. Output structured, copy-paste ready. Speak as TRION EXPRESS (we/us).

For normal chat: Answer questions, close deals, get them to /pitch. Qualify: business name, type, phone/email. Keep responses SHORT. Never say chatbot. You're "Trion". Always end with a call to action.`;

export function VinceAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isListening, supported, toggle } = useSpeechToText((text) => setInput(text));

  useEffect(() => {
    fetch("/api/trion-prompt")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data?.prompt && setSystemPrompt(data.prompt))
      .catch(() => {});
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/trion-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, systemPrompt: systemPrompt ?? TRION_FALLBACK_PROMPT }),
      });

      if (!res.ok) throw new Error("Failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let content = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split("\n")) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const delta = JSON.parse(data).choices?.[0]?.delta?.content;
              if (delta) {
                content += delta;
                setMessages((prev) => {
                  const u = [...prev];
                  u[u.length - 1] = { role: "assistant", content };
                  return u;
                });
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Try refreshing or go to /pitch to get started." }]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-accent px-5 py-3.5 font-medium text-white shadow-lg shadow-accent/25 transition-transform hover:scale-105 ring-4 ring-accent/20"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">T</span>
        <span className="text-sm">Talk to Trion</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[400px] flex-col rounded-2xl border border-border bg-card shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-accent px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">T</div>
          <div>
            <div className="text-sm font-semibold text-white">Trion</div>
            <div className="text-xs text-white/70">Your AI Business Team</div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white text-lg">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="mb-3">
            <div className="max-w-[85%] rounded-lg bg-background px-3.5 py-2.5 text-sm">
              Hey! I&apos;m Trion — your AI business strategist from Trion Express. I analyze job postings, role descriptions, or business info and design TRION as a service (not a hire). I also build sites with answer, book, log, and review. What can I help with?
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm ${
              msg.role === "user" ? "bg-accent text-white" : "bg-background"
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="mb-3"><div className="max-w-[85%] rounded-lg bg-background px-3.5 py-2.5 text-sm text-muted animate-pulse">Typing...</div></div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      {messages.length === 0 && (
        <div className="flex gap-1.5 overflow-x-auto px-4 pb-2">
          {[
            "What does Trion do?",
            "I need an AI for my business",
            "Build my site",
            "Pricing?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted hover:bg-background transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Trion about your business..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
            disabled={isLoading}
          />
          {supported && (
            <button
              type="button"
              onClick={toggle}
              title={isListening ? "Stop listening" : "Speak"}
              className={`shrink-0 rounded-lg px-3 py-2.5 transition-colors ${
                isListening ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" />
                <path d="M5 11a1 1 0 0 1 1 1 6 6 0 0 0 12 0 1 1 0 1 1 2 0 8 8 0 0 1-16 0 1 1 0 0 1 1-1Z" />
              </svg>
            </button>
          )}
          <button type="submit" disabled={!input.trim() || isLoading} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white disabled:opacity-30">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
