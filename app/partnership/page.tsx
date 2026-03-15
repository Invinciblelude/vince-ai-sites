"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PartnershipPage() {
  const [platformLoading, setPlatformLoading] = useState(false);
  const [platformMessage, setPlatformMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handlePlatformSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const company = (form.elements.namedItem("company") as HTMLInputElement)?.value?.trim();
    const name = (form.elements.namedItem("platform-name") as HTMLInputElement)?.value?.trim();
    const email = (form.elements.namedItem("platform-email") as HTMLInputElement)?.value?.trim();
    const platform = (form.elements.namedItem("platform") as HTMLSelectElement)?.value?.trim();
    const message = (form.elements.namedItem("platform-message") as HTMLTextAreaElement)?.value?.trim();

    if (!company || !name || !email) {
      setPlatformMessage({ type: "error", text: "Please provide company, name, and email." });
      return;
    }

    setPlatformLoading(true);
    setPlatformMessage(null);
    try {
      const res = await fetch("/api/platform-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, name, email, platform, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setPlatformMessage({ type: "success", text: "Thanks! We'll be in touch soon." });
        form.reset();
      } else {
        setPlatformMessage({ type: "error", text: data.message || "Something went wrong. Please try again." });
      }
    } catch {
      setPlatformMessage({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setPlatformLoading(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-16 animate-fade-in bg-grid-pattern min-h-screen">
      {/* Theme accents — subtle orange gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent)/0.08,transparent_50%)]" />
      <div className="pointer-events-none absolute top-20 right-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-40 left-0 w-48 h-48 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative">
      {/* Header */}
      <div className="mb-12 text-center">
        <Link href="/home" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent mb-6 transition-colors">
          <Image src="/trion-express-logo-orange.png" alt="" width={24} height={24} className="rounded" />
          <span>Trion Express</span>
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
          AI Venture Partner Wanted
        </h1>
        <p className="mt-4 text-lg text-muted">
          Building operational AI systems for underserved industries — Sacramento, CA
        </p>
      </div>

      {/* Platform Integration — B2B2C (GoDaddy, Jobber, Square, etc.) */}
      <section id="platform-integration" className="mb-12 rounded-2xl border-2 border-accent/40 bg-accent/5 p-8 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-foreground">Integrate Trion into Your Platform</h2>
        <p className="mb-4 text-muted">
          Your platform builds the site. Trion makes it run — answering customers, booking jobs, capturing leads, and sending review requests 24/7 without hiring anyone.
        </p>
        <p className="mb-6 text-sm text-muted">
          We&apos;re the AI workforce layer your users can&apos;t afford to hire. White-label add-on or marketplace app. 16 live sites across 8 industries. <Link href="/pitch" className="text-accent hover:underline">Live demo →</Link>
        </p>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {["GoDaddy", "Jobber", "Square", "Toast", "Mindbody", "Fresha", "Housecall Pro", "Shopify", "Wix", "Squarespace"].map((p) => (
            <div key={p} className="rounded-lg border border-accent/10 bg-background px-3 py-2 text-sm font-medium">
              {p}
            </div>
          ))}
        </div>

        <form onSubmit={handlePlatformSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="company" className="mb-1 block text-sm font-medium">Company</label>
              <input id="company" name="company" type="text" required placeholder="Acme Inc" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="platform" className="mb-1 block text-sm font-medium">Platform you represent</label>
              <select id="platform" name="platform" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
                <option value="">Select...</option>
                <option value="GoDaddy">GoDaddy</option>
                <option value="Jobber">Jobber</option>
                <option value="Square">Square</option>
                <option value="Toast">Toast</option>
                <option value="Mindbody">Mindbody</option>
                <option value="Fresha">Fresha</option>
                <option value="Housecall Pro">Housecall Pro</option>
                <option value="Shopify">Shopify</option>
                <option value="Wix">Wix</option>
                <option value="Squarespace">Squarespace</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="platform-name" className="mb-1 block text-sm font-medium">Your name</label>
              <input id="platform-name" name="platform-name" type="text" required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="platform-email" className="mb-1 block text-sm font-medium">Email</label>
              <input id="platform-email" name="platform-email" type="email" required className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="platform-message" className="mb-1 block text-sm font-medium">Message (optional)</label>
            <textarea id="platform-message" name="platform-message" rows={3} placeholder="Tell us about your platform and how you'd like to integrate Trion..." className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
          </div>
          {platformMessage && (
            <div className={`rounded-lg px-4 py-2 text-sm ${platformMessage.type === "success" ? "bg-green/10 text-green" : "bg-red-500/10 text-red-600"}`}>
              {platformMessage.text}
            </div>
          )}
          <button type="submit" disabled={platformLoading} className="rounded-xl bg-accent px-8 py-3 font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50">
            {platformLoading ? "Sending..." : "Request Platform Integration"}
          </button>
        </form>
      </section>

      {/* What We Build */}
      <section className="mb-12 rounded-2xl border border-accent/20 bg-card p-8 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-foreground">What Trion Express Is Building</h2>
        <p className="mb-6 text-muted">
          This is not another &quot;AI agency.&quot; We build specialized AI systems that create real leverage inside traditional businesses that are still operating manually or with outdated software stacks.
        </p>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">•</span>
            <span><strong>Deploying AI-powered internal tools</strong> — appointments, CRM, lead capture, review collection — embedded in real workflows</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">•</span>
            <span><strong>Designing AI-driven workflow automation</strong> — CEO, COO, CFO, Secretary, Employee roles — all running 24/7</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">•</span>
            <span><strong>Creating proprietary knowledge systems</strong> for niche industries — barbers, contractors, nail techs, restaurants, legal support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">•</span>
            <span><strong>Building domain-specific AI skills</strong> that become long-term competitive moats — not generic chatbots</span>
          </li>
        </ul>
      </section>

      {/* Target Markets */}
      <section className="mb-12 rounded-2xl border border-accent/20 bg-card p-8 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-foreground">Target Markets</h2>
        <p className="mb-6 text-muted">
          Businesses that have recurring operational friction, generate strong cash flow, have minimal AI adoption, and are too niche for large SaaS companies to pursue.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Specialty contractors",
            "Barber shops & salons",
            "Legal support firms",
            "Local logistics operations",
            "Industrial supply distributors",
            "Healthcare-adjacent service providers",
            "Restaurants & food service",
            "Nail techs, lash techs, spas",
          ].map((m) => (
            <div key={m} className="rounded-lg border border-accent/10 bg-accent/5 px-4 py-2 text-sm font-medium">
              {m}
            </div>
          ))}
        </div>
      </section>

      {/* What We&apos;ve Built */}
      <section className="mb-12 rounded-2xl border border-accent/20 bg-card p-8 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-foreground">What We&apos;ve Built So Far</h2>
        <ul className="space-y-3 text-sm text-muted">
          <li>• 16+ live sites across 8 industries — real businesses, real AI agents</li>
          <li>• Modular AI prompt architectures for real business use cases</li>
          <li>• Rapid deployment of custom AI assistants — site + agent in 24 hours</li>
          <li>• Mapping inefficiencies inside small-to-mid operations into AI-solvable processes</li>
          <li>• Transparent skills disclosure — we show business owners exactly what we can apply</li>
        </ul>
      </section>

      {/* Who We&apos;re Looking For */}
      <section className="mb-12 rounded-2xl border-2 border-accent/40 bg-accent/10 p-8 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-foreground">Who We&apos;re Looking For</h2>
        <p className="mb-6 text-muted">
          This is a partnership opportunity — not a job listing. Ideally:
        </p>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">✓</span>
            <span>Strong technical background (software, automation, ML, backend systems)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">✓</span>
            <span>Or strong operator/business development background with real-world experience</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">✓</span>
            <span>High agency and self-directed</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">✓</span>
            <span>Interested in ownership, not just freelance work</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">✓</span>
            <span>Comfortable building from zero</span>
          </li>
        </ul>
        <p className="mt-6 text-sm text-muted">
          If you understand the leverage AI provides, want equity in something real, think long-term about infrastructure rather than quick flips, and are serious about building an actual company — we should talk.
        </p>
      </section>

      {/* What This Is NOT */}
      <section className="mb-12 rounded-2xl border border-accent/20 bg-card p-8 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-foreground">What This Is NOT</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>• Not a get-rich-quick scheme</li>
          <li>• Not an influencer brand</li>
          <li>• Not an AI &quot;wrapper&quot; agency</li>
          <li>• Not a vague startup idea</li>
        </ul>
        <p className="mt-4 text-sm font-medium">
          We are building proprietary operational systems for real-world businesses.
        </p>
      </section>

      {/* Location & Next Step */}
      <section className="mb-12 rounded-2xl border border-accent/20 bg-card p-8 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-foreground">Location</h2>
        <p className="mb-6 text-muted">
          Sacramento area preferred. In-person collaboration is important early on.
        </p>
        <h2 className="mb-2 text-xl font-bold">Next Step</h2>
        <p className="mb-4 text-muted">
          <strong>Platform partners</strong> (GoDaddy, Jobber, Square, etc.): Use the form at the top to request integration. <a href="#platform-integration" className="text-accent hover:underline">Jump to form →</a>
        </p>
        <p className="mb-6 text-muted">
          <strong>Venture partners</strong>: Reply with your background, what you&apos;re building or studying, why this interests you, and what you bring that most people don&apos;t.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/pitch"
            className="rounded-xl bg-accent px-8 py-3 font-semibold text-white transition-colors hover:bg-accent/90"
          >
            Talk to Trion — Get Started
          </Link>
          <Link
            href="/book"
            className="rounded-xl border-2 border-accent/40 px-8 py-3 font-semibold transition-colors hover:bg-accent/10 hover:border-accent"
          >
            Make an appointment
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-accent/20 pt-8 text-center text-sm text-muted">
        <p><span className="font-semibold text-foreground">Trion Express</span> · Sacramento, CA</p>
        <p className="mt-1">Serious inquiries only. We&apos;re looking for long-term builders.</p>
      </footer>
      </div>
    </div>
  );
}
