"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface BusinessInfo {
  businessName: string;
  ownerName: string;
  type: string;
  services: string;
  hours: string;
  location: string;
  phone: string;
  vibe: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const EMPTY_BIZ: BusinessInfo = {
  businessName: "",
  ownerName: "",
  type: "",
  services: "",
  hours: "",
  location: "",
  phone: "",
  vibe: "professional",
};

function buildSystemPrompt(biz: BusinessInfo): string {
  return `You are the AI assistant for "${biz.businessName}" owned by ${biz.ownerName}.
Business type: ${biz.type}
Location: ${biz.location}
Phone: ${biz.phone}
Hours: ${biz.hours}

SERVICES:
${biz.services}

YOUR BEHAVIOR:
- You are ${biz.vibe}, friendly, and helpful.
- Answer questions about services, prices, hours, and location.
- Help customers book appointments -- collect their name and preferred time, and tell them the business will confirm.
- Keep responses short (1-3 sentences).
- If you don't know something, say "I'd recommend calling us at ${biz.phone} for that."
- Never make up information not listed above.`;
}

export default function TryPage() {
  const [step, setStep] = useState<"form" | "preview">("form");
  const [biz, setBiz] = useState<BusinessInfo>(EMPTY_BIZ);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!biz.businessName.trim() || !biz.type.trim()) return;
    setStep("preview");
    setMessages([]);
  }

  async function handleChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: chatInput.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/demo-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt: buildSystemPrompt(biz), messages: newMessages }),
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
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Try again!" }]);
    } finally {
      setIsLoading(false);
    }
  }

  const serviceLines = biz.services.split("\n").filter((l) => l.trim());

  if (step === "form") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 animate-fade-in">
        <Link href="/" className="mb-8 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors">
          &larr; Back to Vince&apos;s site
        </Link>
        <h1 className="mb-2 text-3xl font-bold">Build Your AI Site</h1>
        <p className="mb-8 text-muted">
          Fill in your business details below. You&apos;ll get an instant preview
          of your AI-powered website -- with a working AI assistant trained on
          your info. Takes 2 minutes.
        </p>

        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Business Name *</label>
              <input
                required
                value={biz.businessName}
                onChange={(e) => setBiz({ ...biz, businessName: e.target.value })}
                placeholder="Fresh Cuts Barbershop"
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Your Name *</label>
              <input
                required
                value={biz.ownerName}
                onChange={(e) => setBiz({ ...biz, ownerName: e.target.value })}
                placeholder="Marcus Johnson"
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Business Type *</label>
              <select
                required
                value={biz.type}
                onChange={(e) => setBiz({ ...biz, type: e.target.value })}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
              >
                <option value="">Select...</option>
                <option>Barber Shop</option>
                <option>Nail Salon / Tech</option>
                <option>Hair Salon</option>
                <option>Lash & Brow Tech</option>
                <option>Massage / Spa</option>
                <option>Personal Trainer / Gym</option>
                <option>Restaurant / Food</option>
                <option>Contractor</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Vibe / Style</label>
              <select
                value={biz.vibe}
                onChange={(e) => setBiz({ ...biz, vibe: e.target.value })}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
              >
                <option value="professional">Professional</option>
                <option value="casual and friendly">Casual & Friendly</option>
                <option value="luxury and upscale">Luxury & Upscale</option>
                <option value="fun and energetic">Fun & Energetic</option>
                <option value="warm and welcoming">Warm & Welcoming</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Services & Prices</label>
            <textarea
              value={biz.services}
              onChange={(e) => setBiz({ ...biz, services: e.target.value })}
              placeholder={"Haircut - $30\nSkin Fade - $35\nBeard Trim - $15\nKids Cut - $20"}
              rows={5}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent resize-none font-mono"
            />
            <p className="mt-1 text-xs text-muted">One per line. Include prices if you have them.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Location</label>
              <input
                value={biz.location}
                onChange={(e) => setBiz({ ...biz, location: e.target.value })}
                placeholder="123 Main St, Sacramento, CA"
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input
                value={biz.phone}
                onChange={(e) => setBiz({ ...biz, phone: e.target.value })}
                placeholder="(916) 555-0199"
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Hours</label>
            <input
              value={biz.hours}
              onChange={(e) => setBiz({ ...biz, hours: e.target.value })}
              placeholder="Mon-Fri 9am-7pm, Sat 8am-5pm, Sun Closed"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-3.5 text-base font-semibold text-white transition-colors hover:bg-accent-dim"
          >
            Generate My AI Site Preview
          </button>
          <p className="text-center text-xs text-muted">Free preview. No payment required.</p>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Top bar */}
      <div className="border-b border-accent/20 bg-accent/5 px-4 py-2 text-center text-sm">
        <span className="text-accent font-medium">LIVE PREVIEW</span>
        <span className="text-muted"> -- This is what your customers will see. </span>
        <button onClick={() => setStep("form")} className="text-accent hover:underline font-medium">Edit Info</button>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Generated site header */}
        <header className="mb-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-green text-3xl font-bold text-white">
            {biz.businessName.charAt(0).toUpperCase()}
          </div>
          <h1 className="mb-2 text-4xl font-bold">{biz.businessName}</h1>
          <p className="text-muted">{biz.type} {biz.location ? `in ${biz.location}` : ""}</p>
          {biz.phone && <p className="mt-1 text-sm text-muted">{biz.phone}</p>}
          {biz.hours && (
            <div className="mt-3 inline-block rounded-full bg-green/10 px-3 py-1 text-sm text-green">
              {biz.hours}
            </div>
          )}
        </header>

        {/* Services */}
        {serviceLines.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-center text-2xl font-bold">Services</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {serviceLines.map((line, i) => {
                const dashIdx = line.lastIndexOf("-");
                const dollarIdx = line.lastIndexOf("$");
                let name = line;
                let price = "";
                if (dollarIdx > 0) {
                  name = line.slice(0, dollarIdx).replace(/-\s*$/, "").trim();
                  price = line.slice(dollarIdx).trim();
                } else if (dashIdx > 0) {
                  name = line.slice(0, dashIdx).trim();
                  price = line.slice(dashIdx + 1).trim();
                }
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-3">
                    <span>{name}</span>
                    {price && <span className="font-bold text-green">{price}</span>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Booking */}
        <section className="mb-16">
          <h2 className="mb-6 text-center text-2xl font-bold">Book an Appointment</h2>
          <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6">
            <div className="space-y-3">
              <input placeholder="Your name" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" />
              <input placeholder="Phone or email" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" />
              {serviceLines.length > 0 && (
                <select className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent">
                  <option value="">Select a service...</option>
                  {serviceLines.map((line, i) => {
                    const name = line.split(/[-$]/)[0].trim();
                    return <option key={i}>{name}</option>;
                  })}
                </select>
              )}
              <input placeholder="Preferred date & time" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" />
              <button className="w-full rounded-lg bg-accent py-3 font-semibold text-white transition-colors hover:bg-accent-dim">
                Request Appointment
              </button>
            </div>
          </div>
        </section>

        {/* Contact info */}
        <section className="mb-16 grid gap-4 sm:grid-cols-2">
          {biz.hours && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-3 text-lg font-bold">Hours</h3>
              <p className="text-sm text-muted">{biz.hours}</p>
            </div>
          )}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-bold">Contact</h3>
            <div className="space-y-1 text-sm text-muted">
              {biz.location && <p>{biz.location}</p>}
              {biz.phone && <p>{biz.phone}</p>}
            </div>
          </div>
        </section>

        {/* CTA to go live */}
        <section className="mb-16 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-green/5 p-8 text-center">
          <h3 className="mb-2 text-2xl font-bold">Like What You See?</h3>
          <p className="mx-auto mb-6 max-w-lg text-sm text-muted">
            This preview was generated from your info in seconds. To go live with your
            own domain, full AI assistant, booking system, and social media integration,
            pick a package and Vince will have you up within 24 hours.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href="/#schedule" className="rounded-xl bg-accent px-8 py-3.5 font-semibold text-white transition-colors hover:bg-accent-dim">
              Talk to Vince
            </a>
            <button onClick={() => setStep("form")} className="rounded-xl border border-border px-8 py-3.5 font-semibold transition-colors hover:bg-card">
              Edit My Info
            </button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="font-bold">Starter</div>
              <div className="text-accent">$199 + $50/mo</div>
            </div>
            <div className="rounded-lg border border-accent bg-accent/5 p-3">
              <div className="font-bold">Pro</div>
              <div className="text-accent">$349 + $75/mo</div>
              <div className="text-[10px] text-green font-medium">MOST POPULAR</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="font-bold">Premium</div>
              <div className="text-accent">$599 + $150/mo</div>
            </div>
          </div>
        </section>
      </div>

      {/* Live AI chat for their business -- the real magic */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex h-[480px] w-[380px] flex-col rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-accent px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-white">{biz.businessName} Assistant</div>
              <div className="text-xs text-white/70">Try asking it anything</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="mb-3">
                <div className="max-w-[85%] rounded-lg bg-background px-3 py-2 text-sm">
                  Hi! I&apos;m the AI assistant for {biz.businessName}. Ask me about our services, hours, or book an appointment!
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

          <form onSubmit={handleChat} className="border-t border-border p-3">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about services, book a time..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                disabled={isLoading}
              />
              <button type="submit" disabled={!chatInput.trim() || isLoading} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-30">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
