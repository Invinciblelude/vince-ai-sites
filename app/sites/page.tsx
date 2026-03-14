"use client";

import Link from "next/link";
import { TRION_SITES, SITE_CATEGORIES } from "@/lib/sites";

export default function SitesPage() {
  const byCategory = SITE_CATEGORIES.map((cat) => ({
    category: cat,
    sites: TRION_SITES.filter((s) => s.category === cat),
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-background" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,var(--accent)/15%,transparent)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,var(--green)/8%,transparent)]" />
      <div className="fixed inset-0 -z-10 opacity-30 bg-grid-overlay" />
      {/* Hero — websites / portfolio showcase */}
      <div className="mb-12 overflow-hidden rounded-2xl border border-border">
        <img
          src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80"
          alt="Websites and digital presence"
          className="w-full h-48 sm:h-64 object-cover"
        />
      </div>
      <div className="mb-16 text-center">
        <span className="inline-block mb-3 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
          My Portfolio
        </span>
        <h1 className="mb-3 text-4xl sm:text-5xl font-bold">My Accomplishments — Live Sites I&apos;ve Built</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          I&apos;m Trion. Here are {TRION_SITES.length} live sites I&apos;ve built across {SITE_CATEGORIES.length} industries. Real businesses. Real links. Click any one.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-accent">{TRION_SITES.length}</div>
          <div className="text-xs text-muted">Live Sites</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-green">{SITE_CATEGORIES.length}</div>
          <div className="text-xs text-muted">Industries</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center col-span-2 sm:col-span-1">
          <div className="text-2xl font-bold text-foreground">24h</div>
          <div className="text-xs text-muted">Launch Time</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center col-span-2 sm:col-span-1">
          <div className="text-2xl font-bold text-foreground">24/7</div>
          <div className="text-xs text-muted">AI Support</div>
        </div>
      </div>

      <div className="space-y-12">
        {byCategory.map(({ category, sites }) => (
          <section key={category}>
            <h2 className="mb-4 text-lg font-semibold uppercase tracking-wider text-muted">
              {category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {sites.map((site) => (
                <a
                  key={site.url}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={site.preview || `https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80`}
                      alt={`${site.name} — ${site.description || site.category}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-white/90">{site.category}</span>
                      <span className="text-white/80 group-hover:text-accent transition-colors">→</span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-4 p-5">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                        {site.name}
                      </div>
                      {site.description && (
                        <div className="mt-1 text-sm text-muted line-clamp-2">
                          {site.description}
                        </div>
                      )}
                      <div className="mt-2 truncate text-xs text-muted">
                        {site.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-green/10 p-10 text-center">
        <h3 className="mb-2 text-2xl font-bold">Want Me to Build Yours?</h3>
        <p className="mb-6 text-muted">
          I built these sites. I can build yours. Talk to me — live preview in 60 seconds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/pitch"
            className="rounded-xl bg-accent px-8 py-3.5 font-semibold text-white transition-colors hover:bg-accent-dim"
          >
            Talk to Trion — Get Your Site
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-border px-8 py-3.5 font-semibold transition-colors hover:bg-card"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <footer className="mt-16 border-t border-border py-8 text-center text-sm text-muted">
        Trion Express — Your AI Business Team
      </footer>
    </div>
  );
}
