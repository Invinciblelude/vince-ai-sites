"use client";

import Link from "next/link";

import { BOOK_CALL_URL } from "@/lib/config";
import Image from "next/image";
import { VinceAssistant } from "@/components/vince-assistant";
import { ProAnalysisSection } from "@/components/pro-analysis-section";
import { TRION_SITES, SITE_CATEGORIES } from "@/lib/sites";
import { FEASIBILITY_REPORTS } from "@/lib/feasibility-reports";

const TRION_SERVICES = [
  {
    title: "Universal Role & Job Analysis",
    desc: "Paste any job posting, role description, or business info. We extract core needs (5–10 bullets by theme), infer hidden goals and pain points, and translate into what the principal is really trying to get done.",
    tag: "Pro",
  },
  {
    title: "TRION Service Model Design",
    desc: "We design how TRION delivers those outcomes as a service — not as one employee. Strategy & planning, systems & tools (CRMs, dashboards, SOPs), coordination & execution, communication & reporting. Concrete weekly/monthly deliverables.",
    tag: "Pro",
  },
  {
    title: "Packages & Outreach Scripts",
    desc: "2–3 offer shapes: Fractional [Role] retainer, done-with-you systems build, one-time setup + ops support. Includes positioning statement and outreach message (email/DM) ready to send. Copy-paste into proposals.",
    tag: "Pro",
  },
  {
    title: "Industry Agnostic",
    desc: "Any industry. We identify tools, regulations, and KPIs to respect. No vertical lock-in. Works for job posts, business websites, RFPs — one universal flow.",
    tag: "Pro",
  },
  {
    title: "24/7 Execution Layer",
    desc: "When your site is live: answer customers, book appointments, capture leads, handle reviews & reminders. The tactical layer that runs 24/7.",
    tag: "Core",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 bg-grid-pattern min-h-screen">
      {/* Hero — friendly, inviting */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center text-center animate-fade-in overflow-hidden">
        {/* Logo as background — large, subtle, creative */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src="/trion-express-logo-orange.png"
            alt=""
            width={800}
            height={800}
            className="opacity-[0.06] scale-150 object-contain"
            aria-hidden
          />
        </div>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--accent)/0.15,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,var(--green)/0.08,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_20%_80%,var(--accent)/0.08,transparent)]" />
        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-32 right-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl animate-glow-pulse [animation-delay:1.5s]" />
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="relative">
        <div className="mb-6 flex items-center justify-center gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-accent/20 ring-4 ring-accent/20 animate-float overflow-hidden sm:h-32 sm:w-32">
            <Image src="/trion-express-logo-orange.png" alt="" width={128} height={128} className="object-contain" priority />
          </div>
          <span className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Trion Express</span>
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-foreground via-foreground to-muted bg-clip-text">
          Simple websites with 24/7 AI assistants for local businesses
        </h1>
        <p className="mb-2 text-lg text-accent font-semibold">
          We build your site, set up your AI, and get you more calls and bookings in under 14 days.
        </p>
        <p className="mx-auto mb-8 max-w-2xl text-base text-muted leading-relaxed">
          Upgrade to Trion Ultra when you&apos;re ready for a full AI business team across your whole customer journey.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:flex-wrap">
          <Link
            href="/home#launch"
            className="rounded-xl bg-accent px-8 py-3.5 font-semibold text-white transition-all hover:bg-accent-dim hover:scale-[1.02] shadow-lg shadow-accent/20"
          >
            See Website + AI Launch Package
          </Link>
          <Link
            href="/pitch"
            className="rounded-xl border-2 border-accent/50 bg-accent/5 px-8 py-3.5 font-semibold text-accent transition-all hover:bg-accent/10 hover:border-accent"
          >
            Learn about Trion Ultra
          </Link>
          {BOOK_CALL_URL.startsWith("/") ? (
            <Link href={BOOK_CALL_URL} className="rounded-xl border-2 border-green/50 bg-green/5 px-8 py-3.5 font-semibold text-green transition-all hover:bg-green/10 hover:border-green">
              Make an appointment
            </Link>
          ) : (
            <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl border-2 border-green/50 bg-green/5 px-8 py-3.5 font-semibold text-green transition-all hover:bg-green/10 hover:border-green">
              Make an appointment
            </a>
          )}
        </div>
        </div>
      </section>

      {/* Two-tier comparison — Launch vs Trion Ultra */}
      <section id="launch" className="mb-24 border-t border-border/50 pt-24">
        <div className="mb-12 text-center">
          <span className="inline-block mb-3 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            Two Tiers
          </span>
          <h2 className="mb-2 text-3xl font-bold">Website + AI or Full AI Business Team</h2>
          <p className="mx-auto max-w-2xl text-muted">
            Tier 1: We build your website and set up an AI assistant. Tier 2: We become your AI team across the whole customer journey.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Launch Package — Tier 1 */}
          <div className="flex flex-col rounded-2xl border-2 border-border bg-card p-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Launch Package</h3>
              <span className="rounded-full bg-green/10 px-3 py-1 text-xs font-medium text-green">Website + AI</span>
            </div>
            <p className="mb-6 text-sm text-muted">
              For small businesses that just want someone to &quot;do it for me.&quot; Clean site + AI assistant. Done in 7–14 days.
            </p>
            <ul className="mb-6 flex-1 space-y-3 text-sm">
              <li className="flex items-center gap-2"><span className="text-green">✓</span> 1–5 page website (Home, About, Services, Gallery, Contact)</li>
              <li className="flex items-center gap-2"><span className="text-green">✓</span> Basic SEO + mobile-friendly</li>
              <li className="flex items-center gap-2"><span className="text-green">✓</span> AI assistant on site to answer FAQs and capture leads</li>
              <li className="flex items-center gap-2"><span className="text-green">✓</span> Contact forms and notifications</li>
              <li className="flex items-center gap-2"><span className="text-green">✓</span> 1–2 rounds of revisions</li>
              <li className="flex items-center gap-2"><span className="text-muted">—</span> Multi-channel AI</li>
              <li className="flex items-center gap-2"><span className="text-muted">—</span> Automations / CRM</li>
            </ul>
            <div className="mb-6">
              <div className="text-2xl font-bold text-accent">$500–$1,500 setup</div>
              <div className="text-xs text-muted">Optional: $49–$99/mo hosting + updates + AI tuning</div>
            </div>
            <Link
              href="/pitch"
              className="block w-full rounded-xl bg-accent px-6 py-3.5 text-center font-semibold text-white transition-all hover:bg-accent-dim"
            >
              Get my website + AI set up
            </Link>
          </div>

          {/* Trion Ultra — Tier 2 */}
          <div id="trion-ultra" className="flex flex-col rounded-2xl border-2 border-accent/40 bg-accent/5 p-8 relative">
            <div className="absolute -top-2.5 right-6 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold text-white">AI BUSINESS TEAM</div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Trion Ultra</h3>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">Full Platform</span>
            </div>
            <p className="mb-6 text-sm text-muted">
              For businesses that want an ongoing AI team handling more than just the website.
            </p>
            <ul className="mb-6 flex-1 space-y-3 text-sm">
              <li className="flex items-center gap-2"><span className="text-green">✓</span> Everything in Launch Package</li>
              <li className="flex items-center gap-2"><span className="text-green">✓</span> Multi-channel AI (site chat + SMS/email)</li>
              <li className="flex items-center gap-2"><span className="text-green">✓</span> Workflow automations (follow-ups, reminders, CRM)</li>
              <li className="flex items-center gap-2"><span className="text-green">✓</span> Multiple agent roles (reception, FAQ, intake)</li>
              <li className="flex items-center gap-2"><span className="text-green">✓</span> Monthly optimization and reporting</li>
            </ul>
            <div className="mb-6">
              <div className="text-2xl font-bold text-accent">$750–$2,000 setup + $49–$199/mo</div>
              <div className="text-xs text-muted">Recurring revenue model. Best for: &quot;I want AI in my whole business&quot;</div>
            </div>
            <Link
              href="/pitch"
              className="block w-full rounded-xl border-2 border-accent bg-accent/10 px-6 py-3.5 text-center font-semibold text-accent transition-all hover:bg-accent/20"
            >
              Talk about AI for my whole business
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center">
          {BOOK_CALL_URL.startsWith("/") ? (
            <Link href={BOOK_CALL_URL} className="inline-flex items-center gap-2 rounded-xl bg-green px-6 py-3 font-semibold text-white transition-all hover:bg-green/90">
              Make an appointment
              <span>→</span>
            </Link>
          ) : (
            <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-green px-6 py-3 font-semibold text-white transition-all hover:bg-green/90">
              Make an appointment
              <span>→</span>
            </a>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-24 border-t border-border/50 pt-24">
        <div className="mb-12 text-center">
          <span className="inline-block mb-3 rounded-full bg-green/10 px-4 py-1.5 text-sm font-medium text-green">
            How It Works
          </span>
          <h2 className="mb-2 text-3xl font-bold">From Chat to Live Site in 24 Hours</h2>
          <p className="mx-auto max-w-2xl text-muted">
            Tell us your business. We build your AI team, website, booking, and CRM. No coding. No chasing customers.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "1", title: "Tell us your business", desc: "Chat with Trion. Share your industry, services, and goals. Get a live site preview in 60 seconds." },
            { step: "2", title: "We build your AI team", desc: "Website, AI chat, booking, CRM, reviews — all connected. Five roles working 24/7." },
            { step: "3", title: "Go live in 24 hours", desc: "Your site goes live. Customers can book, ask questions, and get answers — even at 2am." },
            { step: "4", title: "You focus on your work", desc: "We handle the calls, texts, bookings, and follow-ups. You run your business." },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-border bg-card p-6">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-lg font-bold text-accent">{item.step}</span>
              <h3 className="mb-2 font-semibold">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6">
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">What we handle for you</h4>
          <div className="flex flex-wrap gap-2">
            {["24/7 customer answers", "Appointment booking", "Lead capture", "Review requests", "Reminder texts", "Website + AI chat", "CRM", "No double-bookings"].map((item) => (
              <span key={item} className="rounded-full bg-background px-3 py-1.5 text-sm font-medium border border-border">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 1. Services — Universal Pro Model */}
      <section id="services" className="mb-24 border-t border-border/50 pt-24">
        <div className="mb-12 text-center">
          <span className="inline-block mb-3 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-bold text-accent">
            Pro Platform
          </span>
          <h2 className="mb-2 text-3xl font-bold">Business Strategist & Offer Designer — Any Industry</h2>
          <p className="mx-auto max-w-2xl text-muted">
            We read job postings, role descriptions, or business info. We extract what the principal needs, design TRION as a service (not a hire), and output packages + outreach scripts. One universal flow.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { ...TRION_SERVICES[0], icon: "🔍", gradient: "from-accent/20 to-accent/5", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80" },
            { ...TRION_SERVICES[1], icon: "📐", gradient: "from-accent/15 to-accent/5", img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80" },
            { ...TRION_SERVICES[2], icon: "📦", gradient: "from-accent/20 to-green/10", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80" },
            { ...TRION_SERVICES[3], icon: "🌐", gradient: "from-accent/15 to-accent/5", img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80" },
            { ...TRION_SERVICES[4], icon: "📱", gradient: "from-accent/20 to-accent/10", img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80" },
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

      {/* 2. Hire Agent CTA */}
      <section id="hire-agent" className="mb-24 rounded-2xl border-2 border-accent/30 overflow-hidden relative">
        {/* Logo as subtle background pattern */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <Image src="/trion-express-logo-orange.png" alt="" width={600} height={600} className="object-contain" aria-hidden />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/10 to-accent/20" />
        <div className="relative p-10 sm:p-12">
        <div className="relative text-center">
          <h2 className="mb-3 text-3xl sm:text-4xl font-bold">See Your Site Before You Build</h2>
          <p className="mx-auto mb-3 max-w-2xl text-muted">
            Tell us your business — barber shop, salon, restaurant, contractor — and we&apos;ll show your live site preview in 60 seconds. Services, booking, AI chat, gallery. No payment, no commitment.
          </p>
          <p className="mx-auto mb-8 max-w-xl text-sm text-muted">
            Chat with Trion. Get an instant preview. See what working with us could look like.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
            {BOOK_CALL_URL.startsWith("/") ? (
              <Link href={BOOK_CALL_URL} className="rounded-xl bg-green px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-green/90 shadow-lg hover:scale-[1.02]">
                Make an appointment
              </Link>
            ) : (
              <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-green px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-green/90 shadow-lg hover:scale-[1.02]">
                Make an appointment
              </a>
            )}
            <Link
              href="/pitch"
              className="rounded-xl bg-accent px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-accent-dim hover:scale-[1.02] shadow-lg shadow-accent/25"
            >
              Try Trion — See Live Preview
            </Link>
            <Link
              href="/sites"
              className="rounded-xl border-2 border-accent/50 bg-accent/5 px-10 py-4 text-lg font-semibold text-accent transition-all hover:bg-accent/10"
            >
              View {TRION_SITES.length} Live Sites
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mb-24 border-t border-border/50 pt-24">
        <div className="mb-12 text-center">
          <span className="inline-block mb-3 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            Who We Serve
          </span>
          <h2 className="mb-2 text-3xl font-bold">Built for Service Businesses That Answer the Phone</h2>
          <p className="mx-auto max-w-2xl text-muted">
            Barbers, salons, spas, restaurants, contractors, photographers — any business where customers call, book, and ask questions.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {["Barber shops", "Salons & spas", "Restaurants", "Contractors", "Photographers", "Groomers", "Trainers", "Retail stores"].map((item) => (
            <span key={item} className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium">{item}</span>
          ))}
        </div>
        <div id="pricing" className="mt-8 rounded-xl border-2 border-accent/20 bg-accent/5 p-6 text-center">
          <p className="text-sm text-muted">
            <strong className="text-foreground">Launch:</strong> $500–$1,500 setup (website + AI) · <strong className="text-foreground">Trion Ultra:</strong> $750–$2,000 setup + $49–$199/mo (full AI business team). We emphasize recurring revenue.
          </p>
          {BOOK_CALL_URL.startsWith("/") ? (
            <Link href={BOOK_CALL_URL} className="mt-3 inline-block text-sm font-semibold text-green hover:underline">
              Make an appointment →
            </Link>
          ) : (
            <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-green hover:underline">
              Make an appointment →
            </a>
          )}
        </div>
      </section>

      {/* 3. Sites */}
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

      {/* 4. Analysis */}
      <section id="analysis" className="mb-24 border-t border-border/50 pt-24">
        <div className="mb-12 text-center">
          <span className="inline-block mb-3 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            Analysis in Action
          </span>
          <h2 className="mb-2 text-3xl font-bold">Real Analysis, Real Duties & Tasks</h2>
          <p className="mx-auto max-w-2xl text-muted">
            See what Trion&apos;s analysis actually delivers — strategy comparison, cost breakdown, feasibility assessment, and clear recommendations. Live example below.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent overflow-hidden">
          <div className="grid gap-0 sm:grid-cols-2">
            <div className="p-8 sm:p-10">
              <h3 className="mb-2 text-xl font-bold">4929 Nerrads Place — Complete Strategy Analysis</h3>
              <p className="mb-6 text-sm text-muted">
                Sacramento subdivision • 1.17 acres • 75% de-risked. Trion analyzed two strategies with verified engineering data.
              </p>
              <a
                href="https://silvercrowdcraft.com/nerrads-project.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dim"
              >
                View full analysis
                <span>→</span>
              </a>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-border bg-card/50 p-8 sm:p-10">
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">What Trion Delivered</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { task: "Strategy comparison", detail: "Strategy A (Sell Lots) vs Strategy B (Build Homes) — side-by-side ROI, timeline, risk" },
                  { task: "Cost breakdown", detail: "Verified infrastructure costs ($679K), land basis, construction estimates from engineering reports" },
                  { task: "Feasibility assessment", detail: "Conservative, realistic, optimistic scenarios — profit/loss at each" },
                  { task: "Clear recommendation", detail: "Strategy A profitable ($245K–$548K). Strategy B loses money. Hybrid option outlined." },
                  { task: "Action plan", detail: "Month-by-month timeline, pre-sales targets, builder contacts, cost reduction paths" },
                  { task: "De-risking status", detail: "75% complete — what's done vs remaining, value of completed milestones" },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <div>
                      <span className="font-medium">{item.task}</span>
                      <span className="text-muted"> — {item.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Reports */}
      <section id="reports" className="mb-24 border-t border-border/50 pt-24">
        <div className="mb-12 text-center">
          <span className="inline-block mb-3 rounded-full bg-green/10 px-4 py-1.5 text-sm font-medium text-green">
            What Trion Can Do
          </span>
          <h2 className="mb-2 text-3xl font-bold">Feasibility Reports</h2>
          <p className="mx-auto max-w-2xl text-muted">
            Trion analyzes reports and projects — feasibility studies, market analysis, competitor research, revenue projections.{" "}
            <a href="/home#analysis" className="text-accent underline underline-offset-2 hover:no-underline">See real duties & tasks</a>{" "}
            from the Nerrads strategy analysis. Ask Trion to analyze yours.
          </p>
        </div>
        {FEASIBILITY_REPORTS.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEASIBILITY_REPORTS.map((report) => (
              <a
                key={report.url}
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10"
              >
                <div className="relative h-36 shrink-0 overflow-hidden">
                  <img
                    src={report.preview || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
                    <span className="text-xs font-medium text-white/90">{report.category}</span>
                    <span className="rounded bg-green/80 px-1.5 py-0.5 text-[10px] font-medium text-white">Site + Analysis</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {report.title}
                    </div>
                    <p className="text-xs text-muted mt-1 line-clamp-2">{report.description}</p>
                  </div>
                  <span className="shrink-0 text-muted group-hover:text-accent transition-colors">→</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
            <div className="mb-4 flex justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10 text-3xl">📊</span>
            </div>
            <h3 className="mb-2 font-semibold">Feasibility Reports Coming Soon</h3>
            <p className="mx-auto max-w-md text-sm text-muted mb-6">
              Add your feasibility reports to <code className="rounded bg-muted px-1.5 py-0.5 text-xs">lib/feasibility-reports.ts</code> to display them here. Market analysis, competitor research, revenue projections — showcase what Trion can produce.
            </p>
            <Link
              href="/pitch"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dim"
            >
              Get a feasibility report — Talk to Trion
            </Link>
          </div>
        )}
      </section>

      {/* 6. Pro — Analysis & Workload Design with demo */}
      <ProAnalysisSection />

      {/* Trion Express Advantage + Roadmap */}
      <section id="advantage" className="mb-24 border-t border-border/50 pt-24">
        <div className="mb-12 text-center">
          <span className="inline-block mb-3 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            Why Trion
          </span>
          <h2 className="mb-4 text-3xl font-bold">Trion Express Advantage</h2>
          <blockquote className="mx-auto max-w-2xl text-lg font-medium text-foreground italic">
            &quot;SiteSwan gives you a pretty site. Trion Express gives you a site plus an AI that books appointments, captures leads, and sends review requests 24/7.&quot;
          </blockquote>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
            <h3 className="mb-4 font-bold">5 Things We&apos;re Adding</h3>
            <ul className="space-y-3 text-sm">
              <li><strong>1. Local prospecting tool</strong> — Search by industry + city → list businesses with/without sites → one-click demo</li>
              <li><strong>2. Sales kit</strong> — One-pager, flyer, email templates for prospects</li>
              <li><strong>3. Client billing</strong> — Stripe for setup + recurring, managed from your dashboard</li>
              <li><strong>4. Referral program</strong> — &quot;Refer a business → $50 or 1 month free&quot;</li>
              <li><strong>5. Reseller tier</strong> — Agencies sell Trion under their brand; we take a platform fee</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 font-bold">12 Ways to Get Clients</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm text-muted">
              {["Local prospecting tool", "Existing customers", "Family & friends", "Referrals", "Chamber of Commerce", "Rotary, Kiwanis", "Your marketing site", "Sales materials", "Seminars/workshops", "Website redesigns (bad/old sites)", "Social media", "Paid ads"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-green">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <p className="mb-3"><span className="font-medium text-foreground">Trion Express</span> — Simple websites + AI for local businesses</p>
        {BOOK_CALL_URL.startsWith("/") ? (
          <Link href={BOOK_CALL_URL} className="inline-block rounded-lg bg-green/10 px-4 py-2 text-sm font-semibold text-green hover:bg-green/20 transition-colors">
            Make an appointment
          </Link>
        ) : (
          <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg bg-green/10 px-4 py-2 text-sm font-semibold text-green hover:bg-green/20 transition-colors">
            Make an appointment
          </a>
        )}
      </footer>

      {/* Thrive AI Assistant */}
      <VinceAssistant />
    </div>
  );
}
