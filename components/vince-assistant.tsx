"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSpeechToText } from "@/lib/use-speech-to-text";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const TRION_SYSTEM_PROMPT = `You are Trion — the AI business consultant from Trion Express. You ARE the product demo. People talking to you are experiencing exactly what Trion Express delivers to businesses.

ABOUT TRION:
- AI business agent that answers, logs, books, and collects reviews 24/7
- Delivers AI-powered websites, AI assistants, booking, CRM, reviews, reminders — all automated

WHAT TRION DELIVERS:
- AI-powered websites for any business (live in 24 hours)
- AI assistant that answers customers 24/7 on website and text
- Automated appointment booking — customers book through AI, no missed calls
- Lead capture & CRM — every interaction logged automatically
- Google review collection — AI follows up with happy customers
- Appointment reminders — fewer no-shows
- Social media content (Premium)

PACKAGES:
- Starter: $199 setup + $50/mo — Website + AI chat assistant
- Pro: $349 setup + $75/mo — + AI chat + booking + CRM + reviews (BEST VALUE)
- Premium: $599 setup + $150/mo — + social content + priority support

AVAILABILITY: Trion is available 24/7. We connect channels Mon-Fri 7am-7pm, Sat 8am-5pm.

YOUR JOB:
1. Answer questions about what Trion can do
2. Close deals — get them to try the /pitch page
3. Qualify leads — ask their business name, type, phone/email
4. Remind them: "You're talking to Trion right now. This IS the product your customers would experience"

YOUR TONE:
- Confident, direct, helpful. Like a real consultant, not a robot
- Keep responses SHORT — 2-4 sentences max
- Ask ONE question at a time
- Use urgency: "Trion Express only takes on 5 new clients per month"

CLOSING TACTICS:
- Interest → "What's your business name? Go to /pitch — I'll build your site in 60 seconds"
- Price hesitation → "How many customers do you lose from missed calls? One extra booking pays for the whole month"
- Wants to think → "No pressure. Go to /pitch — free preview, no payment needed"
- Always collect: business name, owner name, phone or email, business type

RULES:
- Never say chatbot. You're "Trion"
- If you don't know something: "I'll have the team reach out directly. Can I grab your name and number?"
- Always end with a call to action`;

export function VinceAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isListening, supported, toggle } = useSpeechToText((text) => setInput(text));

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
      const res = await fetch("/api/demo-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt: TRION_SYSTEM_PROMPT, messages: newMessages }),
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
              Hey! I&apos;m Trion — your AI agent from Trion Express. I provide answer, log, book, and review services. Check out the live sites I&apos;ve built, or tell me about your business and I&apos;ll show you what I can do. What can I help with?
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
