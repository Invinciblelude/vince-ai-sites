"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BARBER_SYSTEM_PROMPT = `You are the AI assistant for "Fresh Cuts Barbershop" in Sacramento, CA.

BUSINESS INFO:
- Name: Fresh Cuts Barbershop
- Address: 1234 J Street, Sacramento, CA 95814
- Hours: Mon-Fri 9am-7pm, Sat 8am-5pm, Sun Closed
- Phone: (916) 555-0199
- Walk-ins welcome, appointments preferred
- Instagram: @freshcutssac
- Booking: customers can book online through the website's booking section

SERVICES & PRICING:
- Regular Haircut: $30
- Skin Fade: $35
- Beard Trim: $15
- Haircut + Beard: $40
- Kids Cut (12 & under): $20
- Hot Towel Shave: $25
- Line Up / Edge Up: $15
- Hair Design / Part: $10 extra

BARBERS:
- Marcus (owner) - 15 years experience, specializes in fades and designs
- D (DJ) - 8 years, great with all textures
- Kev - 5 years, specializes in kids cuts

ABOUT:
Fresh Cuts has been serving Sacramento since 2018. Clean shop, good music, always running on time. First-time customers get $5 off.

POLICIES:
- Cash and card accepted
- No-show fee: $15 for missed appointments
- Rescheduling: at least 2 hours notice
- Online booking available through the website

YOUR BEHAVIOR:
- You are friendly, professional, and keep answers short.
- When someone asks about booking, tell them they can book right on the website's Book section, or call (916) 555-0199.
- If they ask something you don't know, say "I'd recommend calling the shop at (916) 555-0199 for that."
- Never make up information. Only answer with what you know.
- Keep responses to 1-3 short paragraphs max.`;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SLOTS = [
  { time: "9:00 AM", available: true },
  { time: "9:30 AM", available: false },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "11:30 AM", available: true },
  { time: "12:00 PM", available: true },
  { time: "1:00 PM", available: false },
  { time: "1:30 PM", available: true },
  { time: "2:00 PM", available: true },
  { time: "2:30 PM", available: true },
  { time: "3:00 PM", available: false },
  { time: "3:30 PM", available: true },
  { time: "4:00 PM", available: true },
];

function getNextWeekDates(): { day: string; date: string; full: string }[] {
  const today = new Date();
  const result = [];
  let d = new Date(today);
  while (result.length < 6) {
    const dow = d.getDay();
    if (dow >= 1 && dow <= 6) {
      result.push({
        day: DAYS[dow - 1],
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        full: d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
      });
    }
    d = new Date(d.getTime() + 86400000);
  }
  return result;
}

const SOCIAL_POSTS = [
  { type: "img", caption: "Clean fade for the weekend 🔥 Book your spot before Saturday fills up", likes: 47, time: "2h" },
  { type: "img", caption: "Marcus with the design work 🎨 If you can dream it, we can cut it", likes: 123, time: "1d" },
  { type: "reel", caption: "POV: You finally found the right barber 💈 #freshcuts #sacramento", likes: 892, time: "3d" },
  { type: "img", caption: "DJ keeping it crispy ✂️ Walk-ins welcome all week", likes: 64, time: "5d" },
];

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState("Marcus");
  const [selectedService, setSelectedService] = useState("Regular Haircut");
  const [bookingStep, setBookingStep] = useState<"select" | "confirm" | "done">("select");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dates = getNextWeekDates();

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
        body: JSON.stringify({ systemPrompt: BARBER_SYSTEM_PROMPT, messages: newMessages }),
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
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleBookConfirm() {
    setBookingStep("done");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Demo banner */}
      <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 text-center text-sm">
        <span className="text-accent font-medium">LIVE DEMO</span>
        <span className="text-muted"> -- This is what your customers see. </span>
        <Link href="/" className="text-accent hover:underline font-medium">Get one for your business →</Link>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <header className="mb-16 text-center">
          <div className="mb-4 text-5xl">💈</div>
          <h1 className="mb-2 text-4xl font-bold">Fresh Cuts Barbershop</h1>
          <p className="text-lg text-muted">Sacramento&apos;s finest cuts since 2018</p>
          <p className="mt-2 text-sm text-muted">1234 J Street, Sacramento, CA 95814</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-green/10 px-3 py-1 text-sm text-green">Walk-ins Welcome</span>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">Mon-Sat Open</span>
          </div>
          {/* Social links */}
          <div className="mt-5 flex justify-center gap-4">
            <a href="#" className="flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm text-muted hover:text-foreground hover:border-accent/40 transition-colors">
              <span>📸</span> Instagram
            </a>
            <a href="#" className="flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm text-muted hover:text-foreground hover:border-accent/40 transition-colors">
              <span>📘</span> Facebook
            </a>
            <a href="#" className="flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm text-muted hover:text-foreground hover:border-accent/40 transition-colors">
              <span>🎵</span> TikTok
            </a>
          </div>
        </header>

        {/* Services */}
        <section className="mb-16">
          <h2 className="mb-6 text-center text-2xl font-bold">Services</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { service: "Regular Haircut", price: "$30" },
              { service: "Skin Fade", price: "$35" },
              { service: "Beard Trim", price: "$15" },
              { service: "Haircut + Beard", price: "$40" },
              { service: "Kids Cut (12 & under)", price: "$20" },
              { service: "Hot Towel Shave", price: "$25" },
              { service: "Line Up / Edge Up", price: "$15" },
              { service: "Hair Design / Part", price: "+$10" },
            ].map((s) => (
              <div key={s.service} className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-3">
                <span>{s.service}</span>
                <span className="font-bold text-green">{s.price}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-accent">First-time customers get $5 off!</p>
        </section>

        {/* BOOKING SECTION */}
        <section id="book" className="mb-16">
          <h2 className="mb-2 text-center text-2xl font-bold">Book Your Appointment</h2>
          <p className="mb-6 text-center text-sm text-muted">Pick your barber, service, day, and time</p>

          {bookingStep === "done" ? (
            <div className="rounded-2xl border border-green/30 bg-green/5 p-8 text-center">
              <div className="mb-3 text-4xl">✅</div>
              <h3 className="mb-2 text-xl font-bold">You&apos;re Booked!</h3>
              <p className="mb-1 text-sm text-muted">
                {selectedService} with {selectedBarber}
              </p>
              <p className="mb-1 text-sm text-muted">
                {dates[selectedDay]?.full} at {selectedSlot}
              </p>
              <p className="mt-4 text-xs text-muted">
                Confirmation sent to your phone. See you there!
              </p>
              <button
                onClick={() => { setBookingStep("select"); setSelectedSlot(null); }}
                className="mt-4 rounded-lg border border-border px-4 py-2 text-sm hover:bg-card"
              >
                Book Another
              </button>
            </div>
          ) : bookingStep === "confirm" ? (
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-center">Confirm Your Booking</h3>
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">Service:</span><span className="font-medium">{selectedService}</span></div>
                <div className="flex justify-between"><span className="text-muted">Barber:</span><span className="font-medium">{selectedBarber}</span></div>
                <div className="flex justify-between"><span className="text-muted">Date:</span><span className="font-medium">{dates[selectedDay]?.full}</span></div>
                <div className="flex justify-between"><span className="text-muted">Time:</span><span className="font-medium">{selectedSlot}</span></div>
              </div>
              <div className="mb-4 space-y-3">
                <input placeholder="Your name" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" />
                <input placeholder="Phone number" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setBookingStep("select")}
                  className="flex-1 rounded-lg border border-border py-2.5 text-sm hover:bg-card-hover"
                >
                  Back
                </button>
                <button
                  onClick={handleBookConfirm}
                  className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-dim"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6">
              {/* Barber + Service selection */}
              <div className="mb-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Barber</label>
                  <div className="flex gap-2">
                    {["Marcus", "DJ", "Kev"].map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBarber(b)}
                        className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                          selectedBarber === b
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border hover:border-accent/30"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option>Regular Haircut</option>
                    <option>Skin Fade</option>
                    <option>Beard Trim</option>
                    <option>Haircut + Beard</option>
                    <option>Kids Cut</option>
                    <option>Hot Towel Shave</option>
                    <option>Line Up / Edge Up</option>
                  </select>
                </div>
              </div>

              {/* Day picker */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium">Day</label>
                <div className="flex gap-2 overflow-x-auto">
                  {dates.map((d, i) => (
                    <button
                      key={d.date}
                      onClick={() => { setSelectedDay(i); setSelectedSlot(null); }}
                      className={`flex flex-col items-center rounded-lg border px-3 py-2 text-sm transition-colors ${
                        selectedDay === i
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border hover:border-accent/30"
                      }`}
                    >
                      <span className="text-xs text-muted">{d.day}</span>
                      <span className="font-medium">{d.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium">
                  Time — {dates[selectedDay]?.full}
                </label>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {SLOTS.map((s) => (
                    <button
                      key={s.time}
                      onClick={() => s.available && setSelectedSlot(s.time)}
                      disabled={!s.available}
                      className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                        !s.available
                          ? "border-border text-muted/30 cursor-not-allowed line-through"
                          : selectedSlot === s.time
                          ? "border-accent bg-accent text-white"
                          : "border-border hover:border-accent/30"
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => selectedSlot && setBookingStep("confirm")}
                disabled={!selectedSlot}
                className="w-full rounded-lg bg-accent py-3 font-semibold text-white transition-colors hover:bg-accent-dim disabled:opacity-30"
              >
                {selectedSlot
                  ? `Book ${selectedService} with ${selectedBarber} at ${selectedSlot}`
                  : "Select a time slot"}
              </button>
            </div>
          )}
        </section>

        {/* Barbers */}
        <section className="mb-16">
          <h2 className="mb-6 text-center text-2xl font-bold">Our Barbers</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: "Marcus", title: "Owner / Lead Barber", exp: "15 years", specialty: "Fades & designs" },
              { name: "DJ", title: "Senior Barber", exp: "8 years", specialty: "All textures" },
              { name: "Kev", title: "Barber", exp: "5 years", specialty: "Kids cuts" },
            ].map((b) => (
              <div key={b.name} className="rounded-xl border border-border bg-card p-5 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-xl font-bold text-accent">
                  {b.name[0]}
                </div>
                <h3 className="font-semibold">{b.name}</h3>
                <p className="text-sm text-muted">{b.title}</p>
                <p className="mt-1 text-xs text-muted">{b.exp} -- {b.specialty}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social Feed */}
        <section className="mb-16">
          <h2 className="mb-2 text-center text-2xl font-bold">From Our Feed</h2>
          <p className="mb-6 text-center text-sm text-muted">@freshcutssac on Instagram</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {SOCIAL_POSTS.map((post, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className={`flex h-40 items-center justify-center text-4xl ${
                  i % 2 === 0 ? "bg-accent/5" : "bg-green/5"
                }`}>
                  {post.type === "reel" ? "🎬" : "📸"}
                </div>
                <div className="p-4">
                  <p className="mb-2 text-sm">{post.caption}</p>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>❤️ {post.likes} likes</span>
                    <span>{post.time} ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hours & Location */}
        <section className="mb-16 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-bold">Hours</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Monday - Friday</span><span className="text-muted">9am - 7pm</span></div>
              <div className="flex justify-between"><span>Saturday</span><span className="text-muted">8am - 5pm</span></div>
              <div className="flex justify-between"><span>Sunday</span><span className="text-muted">Closed</span></div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-bold">Contact</h3>
            <div className="space-y-2 text-sm">
              <p>📍 1234 J Street, Sacramento, CA 95814</p>
              <p>📞 (916) 555-0199</p>
              <p>📸 @freshcutssac</p>
            </div>
            <div className="mt-4">
              <a href="#book" className="inline-block rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-dim">
                Book Now
              </a>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mb-16 rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center">
          <h3 className="mb-2 text-xl font-bold">Want This for Your Business?</h3>
          <p className="mb-4 text-sm text-muted">This entire site -- booking, AI chat, social feed -- built in 24 hours.</p>
          <Link href="/#pricing" className="inline-block rounded-lg bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent-dim">
            View Packages
          </Link>
        </section>
      </div>

      {/* Chat bubble */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl text-white shadow-lg transition-transform hover:scale-105"
        >
          💬
        </button>
      )}

      {/* Chat window */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] flex-col rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-accent px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">💈</span>
              <div>
                <div className="text-sm font-semibold text-white">Fresh Cuts Assistant</div>
                <div className="text-xs text-white/70">Ask me anything about the shop</div>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white/70 hover:text-white">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="mb-3">
                <div className="max-w-[85%] rounded-lg bg-background px-3 py-2 text-sm text-foreground">
                  Hey! 👋 I&apos;m the Fresh Cuts assistant. Ask me about our services, prices, hours, or book an appointment.
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user" ? "bg-accent text-white" : "bg-background text-foreground"
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="mb-3 flex justify-start">
                <div className="rounded-lg bg-background px-3 py-2 text-sm text-muted animate-pulse">Typing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && (
            <div className="flex gap-1.5 overflow-x-auto px-4 pb-2">
              {["What are your prices?", "Are you open today?", "How do I book?"].map((q) => (
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
                placeholder="Ask about services, prices, hours..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-30"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
