"use client";

import Link from "next/link";
import { VinceAssistant } from "@/components/vince-assistant";
import { TRION_SITES, SITE_CATEGORIES } from "@/lib/sites";

const TRION_SERVICES = [
  {
    title: "I Answer 24/7",
    desc: "I answer every customer question — services, prices, hours, location. I never sleep, I never miss a message.",
    tag: "Core",
  },
  {
    title: "I Book Appointments",
    desc: "I collect name, phone, service, date, and time. I log to your workspace. I confirm instantly. No double-bookings.",
    tag: null,
  },
  {
    title: "I Capture Leads",
    desc: "When someone inquires but doesn't book — I save name, contact, and interest to your CRM. You follow up when you're ready.",
    tag: null,
  },
  {
    title: "I Handle Reviews & Reminders",
    desc: "I log review requests after visits. I read bookings and prepare reminder messages. I handle the follow-up.",
    tag: null,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 bg-grid-pattern min-h-screen">
      {/* Hero — friendly, inviting */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center text-center animate-fade-in overflow-hidden">
        {/* Hero background — AI assistant / digital help */}
        <img
          src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--accent)/25%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,var(--green)/15%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_20%_80%,var(--accent)/12%,transparent)]" />
        {/* Decorative floating orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-32 right-20 w-48 h-48 rounded-full bg-green/10 blur-3xl animate-glow-pulse [animation-delay:1.5s]" />
        {/* Abstract grid visual */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="relative">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-accent via-amber-500 to-green text-5xl font-bold text-white shadow-2xl shadow-accent/30 ring-4 ring-accent/20 animate-float">
          T
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-foreground via-foreground to-muted bg-clip-text">
          Hi, I&apos;m Trion 👋
        </h1>
        <p className="mb-2 text-lg text-accent font-semibold">
          I&apos;m your AI agent — here to help your business grow.
        </p>
        <p className="mx-auto mb-8 max-w-2xl text-base text-muted leading-relaxed">
          I answer your customers 24/7. I log leads, book appointments, and collect reviews.
          I run as five roles — CEO, COO, CFO, Secretary, Employee. Check out my accomplishments below — {TRION_SITES.length} live sites I&apos;ve built across {SITE_CATEGORIES.length} industries.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pitch#plans"
            className="rounded-xl bg-accent px-8 py-3.5 font-semibold text-white transition-all hover:bg-accent-dim hover:scale-[1.02] shadow-lg shadow-accent/20"
          >
            Talk to Trion — Get Your Site
          </Link>
          <Link
            href="/sites"
            className="rounded-xl border-2 border-accent/50 bg-accent/5 px-8 py-3.5 font-semibold text-accent transition-all hover:bg-accent/10 hover:border-accent"
          >
            See {TRION_SITES.length} Live Sites
          </Link>
        </div>
        </div>
      </section>

      {/* Trion Services — with friendly images */}
      <section id="services" className="mb-24 border-t border-border/50 pt-24">
        <div className="mb-12 text-center">
          <span className="inline-block mb-3 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            Services I Provide
          </span>
          <h2 className="mb-2 text-3xl font-bold">I Answer · I Log · I Book · I Review</h2>
          <p className="mx-auto max-w-2xl text-muted">
            I&apos;m your AI agent. Here&apos;s what I do for your business — 24/7.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { ...TRION_SERVICES[0], icon: "📱", gradient: "from-orange-500/20 to-amber-600/10", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80" },
            { ...TRION_SERVICES[1], icon: "📅", gradient: "from-amber-500/20 to-orange-600/10", img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80" },
            { ...TRION_SERVICES[2], icon: "📋", gradient: "from-emerald-500/20 to-green-600/10", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80" },
            { ...TRION_SERVICES[3], icon: "⭐", gradient: "from-rose-500/20 to-pink-600/10", img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80" },
          ].map((s) => (
            <div key={s.title} className={`group relative flex min-h-[240px] flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 bg-gradient-to-br ${s.gradient}`}>
              <div className="h-32 shrink-0 overflow-hidden">
                <img src={s.img} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" aria-hidden />
              </div>
              <div className="relative flex flex-1 flex-col p-6">
                {s.tag && (
                  <span className="absolute -top-2.5 right-6 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {s.tag}
                  </span>
                )}
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-2xl group-hover:bg-accent/30 transition-colors">
                  {s.icon}
                </div>
                <h3 className="mb-2 font-semibold">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sites We Built — Showcase */}
      <section id="sites" className="mb-24 border-t border-border/50 pt-24">
        <div className="mb-12 text-center">
          <span className="inline-block mb-3 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            My Accomplishments
          </span>
          <h2 className="mb-2 text-3xl font-bold">Check Out the Live Sites I&apos;ve Built</h2>
          <p className="mx-auto max-w-2xl text-muted">
            {TRION_SITES.length} live sites across {SITE_CATEGORIES.length} industries. Real businesses. Real links. Click any one — I built them all.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRION_SITES.slice(0, 6).map((site) => (
            <a
              key={site.url}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10"
            >
              <div className="relative h-40 shrink-0 overflow-hidden">
                <img
                  src={site.preview || `https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80`}
                  alt={`${site.name} — ${site.description || site.category}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <span className="text-xs font-medium text-white/90">{site.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                    {site.name}
                  </div>
                  <div className="text-xs text-muted truncate">{site.url.replace(/^https?:\/\//, "").split("/")[0]}</div>
                </div>
                <span className="shrink-0 text-muted group-hover:text-accent transition-colors">→</span>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/sites"
            className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-6 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent/10"
          >
            See all {TRION_SITES.length} sites I&apos;ve built
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* The CTA — friendly, inviting */}
      <section className="mb-24 rounded-2xl border-2 border-accent/30 overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/10 to-green/10" />
        <div className="relative p-10 sm:p-12">
        <div className="relative text-center">
          <h2 className="mb-3 text-3xl sm:text-4xl font-bold">Hey — Want Me to Build Yours?</h2>
          <p className="mx-auto mb-3 max-w-2xl text-muted">
            I build AI assistants, booking, CRM, and reviews — live in 24 hours. Barber shops, salons, restaurants, contractors — any business that needs to answer customers 24/7.
          </p>
          <p className="mx-auto mb-8 max-w-xl text-sm text-muted">
            Talk to me. I&apos;ll give you a live preview in 60 seconds. No payment, no commitment.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href="/pitch#plans"
              className="rounded-xl bg-accent px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-accent-dim hover:scale-[1.02] shadow-lg shadow-accent/25"
            >
              Talk to Trion — Get Your Site
            </Link>
            <Link
              href="/sites"
              className="rounded-xl border-2 border-green/50 bg-green/5 px-10 py-4 text-lg font-semibold text-green transition-all hover:bg-green/10"
            >
              Check Out My {TRION_SITES.length} Live Sites
            </Link>
          </div>
        </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <span className="font-medium text-foreground">Trion Express</span> — Your AI Business Team
      </footer>

      {/* Thrive AI Assistant */}
      <VinceAssistant />
    </div>
  );
}
