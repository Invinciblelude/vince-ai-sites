"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSpeechToText } from "@/lib/use-speech-to-text";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are the AI sales assistant for Trion's "AI Sites" business. You help small business owners understand what we offer and guide them toward getting started.

ABOUT OUR SERVICE:
We build AI-powered websites and assistants for small businesses -- especially barber shops, nail technicians, hair salons, lash techs, spas, trainers, restaurants, and contractors.

PACKAGES:
1. Starter ($199 one-time + $50/mo maintenance):
   - Clean, mobile-friendly one-page website
   - AI assistant trained on their business (answers questions 24/7)
   - Contact form that sends leads to their phone/email
   - Live in 24-72 hours

2. Pro ($349 one-time + $75/mo maintenance) -- MOST POPULAR:
   - Everything in Starter
   - Online booking / calendar integration
   - Connects to Instagram, Facebook, TikTok
   - AI voice assistant included
   - AI visual character host on homepage
   - Google Business profile optimization

3. Premium ($599 one-time + $150/mo maintenance):
   - Everything in Pro
   - AI-generated Reels & social content (4 posts/reels per month)
   - Automated booking confirmations & reminders
   - Review collection (asks happy clients for Google reviews)
   - Monthly analytics report
   - Priority support

HOW IT WORKS:
1. They tell us about their business (services, prices, hours, photos, style)
2. We build everything in 24-72 hours
3. They review and request changes
4. Site goes live, AI starts answering customers

HOURLY SUPPORT: Available for bigger custom changes or add-ons beyond the package.

YOUR BEHAVIOR:
- Be friendly, professional, and keep answers SHORT (1-3 sentences usually).
- Answer questions about the service clearly.
- If they seem interested, ask qualifying questions: What kind of business? Do they have a website? What's their biggest pain point?
- Guide them toward filling out the contact form on the page or leaving their name and phone/email in the chat.
- If they ask something you don't know, say "Great question -- the team can answer that directly. Want to leave your name and number so we can reach out?"
- Never make up pricing or features that aren't listed above.
- Be conversational, not salesy. Like talking to a friend who happens to build websites.`;

export function SalesChat() {
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
        body: JSON.stringify({ systemPrompt: SYSTEM_PROMPT, messages: newMessages }),
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
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Try scrolling down to the contact form instead!" }]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105"
      >
        <span className="text-lg">💬</span>
        <span className="hidden sm:inline text-sm">Ask about our service</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] flex-col rounded-2xl border border-border bg-card shadow-2xl">
      <div className="flex items-center justify-between rounded-t-2xl bg-accent px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-white">AI Sites Assistant</div>
          <div className="text-xs text-white/70">Ask me anything about our service</div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white text-lg">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="mb-3">
            <div className="max-w-[85%] rounded-lg bg-background px-3 py-2 text-sm">
              Hey! 👋 I&apos;m Trion&apos;s AI assistant. Want to know how we build AI-powered websites for businesses like yours? Ask me anything -- pricing, packages, how it works, timeline.
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
              msg.role === "user" ? "bg-accent text-white" : "bg-background"
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="mb-3"><div className="max-w-[85%] rounded-lg bg-background px-3 py-2 text-sm text-muted animate-pulse">Typing...</div></div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <div className="flex gap-1.5 overflow-x-auto px-4 pb-2">
          {["What do you offer?", "How much does it cost?", "How fast can you build it?"].map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted hover:bg-background"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSend} className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about pricing, packages, timeline..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            disabled={isLoading}
          />
          {supported && (
            <button
              type="button"
              onClick={toggle}
              title={isListening ? "Stop listening" : "Speak"}
              className={`shrink-0 rounded-lg px-3 py-2 transition-colors ${
                isListening ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" />
                <path d="M5 11a1 1 0 0 1 1 1 6 6 0 0 0 12 0 1 1 0 1 1 2 0 8 8 0 0 1-16 0 1 1 0 0 1 1-1Z" />
              </svg>
            </button>
          )}
          <button type="submit" disabled={!input.trim() || isLoading} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-30">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
