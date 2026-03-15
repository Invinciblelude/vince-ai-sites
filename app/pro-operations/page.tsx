"use client";

import Link from "next/link";

const PIPELINES = [
  { title: "Construction / Reno", items: ["Intake, scope, bids", "Approvals, progress tracking", "Punchlists, walk-throughs"] },
  { title: "Property Maintenance", items: ["Recurring schedules", "Emergency work orders", "Vendor SLAs"] },
  { title: "Household Logistics", items: ["Task board, errands", "Inventory & supplies", "Vehicle calendar"] },
  { title: "Business Workflows", items: ["Content calendar", "E-com ops tasks", "Consulting deliverables"] },
];

const VENDOR_WORKFLOWS = [
  "Request bids from 2–3 vendors, present side-by-side mini report",
  "Create Gantt/roadmap with milestones and payment triggers",
  "Conduct walk-through with checklists, photos, sign-offs",
];

const PACKAGES = [
  { name: "Weekly Home Readiness", desc: "Trash, mail, packages, obvious issues" },
  { name: "Monthly Systems Check", desc: "HVAC, appliances, minor maintenance scheduling" },
  { name: "Quarterly Property Audit", desc: "Punchlist, budget estimates, vendor performance" },
];

export default function ProOperationsPage() {
  return (
    <div className="animate-fade-in min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 pt-10 pb-24">
        {/* Hero */}
        <div className="mb-16 text-center">
          <span className="inline-flex gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-bold text-accent">
            PRO · Principal Operations
          </span>
          <h1 className="mt-4 mb-4 text-4xl font-bold sm:text-5xl">
            Project & Operations Manager — As a System
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            Not just one employee. Trion Express is the ops backbone: project coordination, property management, household logistics, and multi-business workflows — delivered as a system plus on-call support.
          </p>
          <Link
            href="/pitch"
            className="mt-6 inline-flex gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-dim"
          >
            Talk to Trion — Get a Proposal
          </Link>
        </div>

        {/* What this role really needs */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">What Principals Actually Need</h2>
          <p className="mb-6 text-muted">
            A small personal operations company around one principal. Someone to run construction projects, manage properties, coordinate household staff, handle admin, and protect time across a multi-business portfolio.
          </p>
          <ul className="space-y-3 text-muted">
            {[
              "Run residential construction/renovation projects end-to-end (bids, timelines, vendors, inspections)",
              "Manage ongoing maintenance across multiple properties (scheduling, tracking, documentation)",
              "Coordinate household staff, errands, logistics, vehicle maintenance",
              "Handle admin and basic financial tracking for vendors and projects",
              "Support e-com, real estate, consulting, digital publishing — streamline workflows",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* How Trion delivers */}
        <section className="mb-16 rounded-2xl border-2 border-accent/20 bg-card p-8">
          <h2 className="mb-6 text-2xl font-bold">How Trion Express Delivers</h2>
          <p className="mb-8 text-muted">
            A hybrid: operations management system + dedicated contact. One main person, backed by standardized pipelines and dashboards.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {PIPELINES.map((p) => (
              <div key={p.title} className="rounded-xl border border-border bg-background/50 p-5">
                <h3 className="mb-3 font-semibold text-accent">{p.title}</h3>
                <ul className="space-y-1.5 text-sm text-muted">
                  {p.items.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Vendor coordination */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Vendor & Project Coordination</h2>
          <p className="mb-6 text-muted">
            Vetted vendor pool (GCs, subs, cleaners, handymen, auto shops). Standard Trion workflows:
          </p>
          <ul className="space-y-3">
            {VENDOR_WORKFLOWS.map((item, i) => (
              <li key={i} className="flex gap-3 rounded-lg border border-border bg-card/50 px-4 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Property playbook */}
        <section className="mb-16 rounded-2xl border border-border bg-muted/20 p-8">
          <h2 className="mb-6 text-2xl font-bold">Property Playbook & Recurring Packages</h2>
          <p className="mb-6 text-muted">
            A playbook for each address: specs for systems (HVAC, water heater, appliances), preferred vendors, maintenance frequencies, access instructions.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {PACKAGES.map((p) => (
              <div key={p.name} className="rounded-xl border border-border bg-card p-4">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-muted mt-1">{p.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Multi-business support */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Multi-Business Support</h2>
          <p className="mb-6 text-muted">
            Simple operating systems for each business line:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { biz: "E-com", ex: "Product launch checklist, inventory with 3PL, customer service escalations" },
              { biz: "Real estate", ex: "Rehab timelines, listing prep, turn-over checklists for rentals" },
              { biz: "Digital publishing", ex: "Content calendar, asset pipeline, publishing and promotion steps" },
              { biz: "Consulting", ex: "Deliverable tracking, client follow-ups, proposal pipeline" },
            ].map((item) => (
              <div key={item.biz} className="rounded-xl border border-border bg-card p-4">
                <span className="font-semibold text-accent">{item.biz}</span>
                <p className="text-sm text-muted mt-1">{item.ex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-10 text-center">
          <h2 className="mb-3 text-2xl font-bold">Fractional Operations Partner</h2>
          <p className="mx-auto mb-6 max-w-xl text-muted">
            Not just applying as an employee — offering Trion Express as a system with one main contact and backup. Retainer or project-based.
          </p>
          <Link
            href="/pitch"
            className="inline-flex gap-2 rounded-xl bg-accent px-8 py-3.5 font-semibold text-white transition-colors hover:bg-accent-dim"
          >
            Get a Proposal — Talk to Trion
          </Link>
        </section>

        <div className="mt-12 text-center">
          <Link href="/pro-demo" className="text-sm text-muted hover:text-foreground">
            ← Back to Pro Demo (Reports & Analysis)
          </Link>
        </div>
      </div>
    </div>
  );
}
