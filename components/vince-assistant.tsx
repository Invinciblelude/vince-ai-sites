"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const VINCE_SYSTEM_PROMPT = `You are the AI assistant for Vince Dang -- entrepreneur, licensed general contractor, real estate investor, and AI developer based in Sacramento, CA.

You handle Vince's CRM, scheduling, and customer inquiries. You ARE the product demo -- people interacting with you are seeing exactly what Vince builds for other businesses.

ABOUT VINCE:
- Licensed General Contractor in California
- Real estate investor (flips, rentals, acquisitions)
- AI developer who builds AI-powered websites and automation for small businesses
- Based in Sacramento, CA
- Website: vincedangcapital.com

VINCE'S SERVICES:
1. AI-Powered Websites ($199-$599 setup + monthly maintenance):
   - Starter ($199 + $50/mo): One-page website + AI assistant + contact form
   - Pro ($349 + $75/mo): + Online booking, calendar, social media, voice AI
   - Premium ($599 + $150/mo): + AI-generated content/reels, review collection, analytics
   - Timeline: 24-72 hours after receiving business info
   - Who it's for: Barber shops, nail techs, salons, restaurants, spas, trainers, contractors, any small business

2. General Contracting:
   - Residential and commercial builds
   - Renovations and remodels
   - Project management
   - Sacramento area
   - Get a quote by scheduling a consultation

3. Real Estate:
   - Investment acquisitions
   - Fix and flip projects
   - Rental portfolio
   - JV partnership opportunities
   - Always looking at deals

4. AI Consulting:
   - Custom AI chatbot development
   - CRM automation
   - Content generation systems
   - Business process automation

VINCE'S AVAILABILITY:
- Monday-Friday: 9 AM - 6 PM (Meetings & calls)
- Saturday: 10 AM - 2 PM (Site visits & consultations)
- Sunday: Closed
- Response time: You answer instantly. Vince personally follows up within 24 hours.

YOUR ROLE:
1. ANSWER QUESTIONS: About any of Vince's services. Be knowledgeable and specific.
2. QUALIFY LEADS: Ask what they need, what kind of business they have, their timeline.
3. BOOK MEETINGS: Collect their name, email/phone, what they need, and preferred time. Tell them Vince will confirm within 24 hours.
4. CRM: When someone shares their info, acknowledge it and tell them it's been logged.
5. SELL THE EXPERIENCE: Remind people that what they're experiencing right now (talking to you) is exactly what their customers would experience on THEIR site.

YOUR TONE:
- Professional but approachable. Like Vince's right-hand person.
- Keep responses to 1-3 short paragraphs.
- Be direct and helpful, not salesy.
- If someone asks about the AI website service, casually point out: "Actually, you're using it right now -- this conversation is exactly what your customers would get on your site."

WHAT YOU CAN'T DO:
- Don't make up pricing or details not listed above.
- Don't commit Vince to specific times -- say "I'll get that to Vince and he'll confirm a time with you."
- If you don't know something, say "Let me get Vince on that -- can I grab your name and best contact?"`;

export function VinceAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify({ systemPrompt: VINCE_SYSTEM_PROMPT, messages: newMessages }),
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
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Try refreshing or reach out to Vince directly." }]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-accent px-5 py-3.5 font-medium text-white shadow-lg shadow-accent/25 transition-transform hover:scale-105"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">VD</span>
        <span className="text-sm">Talk to Vince&apos;s Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[400px] flex-col rounded-2xl border border-border bg-card shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-accent px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">VD</div>
          <div>
            <div className="text-sm font-semibold text-white">Vince&apos;s AI Assistant</div>
            <div className="text-xs text-white/70">Scheduling, services, questions</div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white text-lg">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="mb-3">
            <div className="max-w-[85%] rounded-lg bg-background px-3.5 py-2.5 text-sm">
              Hey! I&apos;m Vince&apos;s AI assistant. I handle his schedule, answer questions about his services, and can book you a meeting. What can I help you with?
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
            "What does Vince do?",
            "I need an AI website",
            "Book a meeting",
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
            placeholder="Ask about services, book a meeting..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
            disabled={isLoading}
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white disabled:opacity-30">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
