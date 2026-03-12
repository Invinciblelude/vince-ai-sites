"use client";

import Link from "next/link";
import { VinceAssistant } from "@/components/vince-assistant";

const SERVICES = [
  {
    title: "AI-Powered Websites",
    desc: "Custom websites with built-in AI assistants that handle customer questions, booking, and lead capture 24/7.",
    tag: "Most Requested",
  },
  {
    title: "General Contracting",
    desc: "Licensed GC handling residential and commercial builds, renovations, and project management in the Sacramento area.",
    tag: null,
  },
  {
    title: "Real Estate Investment",
    desc: "Acquisitions, flips, and rental portfolio management. Always looking for deals and JV partners.",
    tag: null,
  },
  {
    title: "AI Consulting",
    desc: "Helping businesses integrate AI into their operations -- from chatbots and CRM automation to content generation.",
    tag: "New",
  },
];

const SCHEDULE_SLOTS = [
  { day: "Mon-Fri", time: "9:00 AM - 6:00 PM", type: "Meetings & Calls" },
  { day: "Saturday", time: "10:00 AM - 2:00 PM", type: "Site Visits / Consultations" },
  { day: "Sunday", time: "Closed", type: "Family time" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* Hero */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center text-center animate-fade-in">
        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-accent to-green text-5xl font-bold text-white shadow-lg shadow-accent/20">
          VD
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Vince Dang
        </h1>
        <p className="mb-2 text-lg text-accent font-medium">
          Entrepreneur &middot; General Contractor &middot; AI Developer &middot; Investor
        </p>
        <p className="mx-auto mb-8 max-w-2xl text-base text-muted leading-relaxed">
          I build things -- houses, businesses, and AI systems. Based in Sacramento, CA.
          Need to talk? My AI assistant handles my schedule, answers questions about
          my services, and can book you a meeting with me. Try it out.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#schedule"
            className="rounded-xl bg-accent px-8 py-3.5 font-semibold text-white transition-colors hover:bg-accent-dim"
          >
            Book a Meeting
          </a>
          <Link
            href="/try"
            className="rounded-xl border border-border px-8 py-3.5 font-semibold transition-colors hover:bg-card"
          >
            Get This For Your Business
          </Link>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mb-24">
        <div className="grid gap-8 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <h2 className="mb-4 text-3xl font-bold">About Me</h2>
            <div className="space-y-4 text-sm text-muted leading-relaxed">
              <p>
                I&apos;m Vince Dang. I started in construction -- licensed general
                contractor, built and renovated properties across the Sacramento
                area. That got me into real estate investing, which taught me how
                businesses actually run.
              </p>
              <p>
                I realized most small business owners are drowning in the same
                problems: missed calls, no online presence, scheduling headaches,
                and zero time to deal with any of it. So I learned to build AI
                systems that solve all of that.
              </p>
              <p>
                Now I build AI-powered websites and automation for businesses.
                The site you&apos;re on right now is an example -- my AI assistant
                handles my scheduling, answers questions about my services, and
                manages my CRM. Everything you see here, I can build for your
                business too.
              </p>
              <p className="text-foreground font-medium">
                Try my assistant in the bottom right. Ask it anything -- about my
                services, my availability, how to work with me. That&apos;s the same
                experience your customers would get on your site.
              </p>
            </div>
          </div>
          <div className="sm:col-span-2 space-y-3">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Facts</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-muted">Location</span><span>Sacramento, CA</span></div>
                <div className="flex justify-between"><span className="text-muted">GC License</span><span>Active</span></div>
                <div className="flex justify-between"><span className="text-muted">Properties</span><span>Investor / Flipper</span></div>
                <div className="flex justify-between"><span className="text-muted">AI Clients</span><span>Taking new clients</span></div>
                <div className="flex justify-between"><span className="text-muted">Response Time</span><span className="text-green">AI: Instant</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Connect</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
                  <span>🌐</span> vincedangcapital.com
                </a>
                <a href="#" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
                  <span>📸</span> Instagram
                </a>
                <a href="#" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
                  <span>🎵</span> TikTok
                </a>
                <a href="#" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
                  <span>📧</span> Email me
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mb-24">
        <h2 className="mb-2 text-center text-3xl font-bold">What I Do</h2>
        <p className="mb-10 text-center text-muted">Ask my assistant for details on any of these.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <div key={s.title} className="relative rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/30">
              {s.tag && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {s.tag}
                </span>
              )}
              <h3 className="mb-2 font-semibold">{s.title}</h3>
              <p className="text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule / Booking */}
      <section id="schedule" className="mb-24">
        <h2 className="mb-2 text-center text-3xl font-bold">My Availability</h2>
        <p className="mb-10 text-center text-muted">
          Book through my assistant or use the form below. I&apos;ll confirm within a few hours.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Hours</h3>
            <div className="space-y-2">
              {SCHEDULE_SLOTS.map((s) => (
                <div key={s.day} className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-3 text-sm">
                  <div>
                    <span className="font-medium">{s.day}</span>
                    <span className="ml-2 text-muted">{s.time}</span>
                  </div>
                  <span className="text-xs text-muted">{s.type}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              You can also just ask my AI assistant &quot;What&apos;s Vince&apos;s availability?&quot;
              or &quot;I want to book a consultation&quot; and it&apos;ll handle it.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Request a Meeting</h3>
            <div className="space-y-3">
              <input placeholder="Your name" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" />
              <input placeholder="Email or phone" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" />
              <select className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent">
                <option value="">What do you need?</option>
                <option>AI Website for my business</option>
                <option>Construction / GC project</option>
                <option>Real estate / investment</option>
                <option>AI consulting</option>
                <option>Other</option>
              </select>
              <textarea
                placeholder="Brief description of what you need..."
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent resize-none"
              />
              <button className="w-full rounded-lg bg-accent py-3 font-semibold text-white transition-colors hover:bg-accent-dim">
                Request Meeting
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              I&apos;ll get back to you within 24 hours to confirm a time.
            </p>
          </div>
        </div>
      </section>

      {/* The CTA -- "Want this for your business?" */}
      <section className="mb-24 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-green/5 p-8 sm:p-10">
        <div className="text-center">
          <h2 className="mb-3 text-3xl font-bold">Want This For Your Business?</h2>
          <p className="mx-auto mb-3 max-w-2xl text-muted">
            Everything you just experienced on this site -- the AI assistant, the
            scheduling, the CRM, the clean design -- I can build for your business
            in 24 hours. Barber shops, nail techs, salons, restaurants, contractors --
            any business that needs to be online and answer customers.
          </p>
          <p className="mx-auto mb-8 max-w-xl text-sm text-muted">
            Try it right now. Enter your business info and see a live preview of
            what your AI-powered site would look like. No payment, no commitment.
          </p>
          <Link
            href="/try"
            className="inline-block rounded-xl bg-accent px-10 py-4 text-lg font-semibold text-white transition-colors hover:bg-accent-dim"
          >
            Build My AI Site Now
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <span className="font-medium text-foreground">Vince Dang</span> &middot; Sacramento, CA &middot; Entrepreneur &middot; Builder &middot; AI Developer
      </footer>

      {/* Vince's AI Assistant */}
      <VinceAssistant />
    </div>
  );
}
