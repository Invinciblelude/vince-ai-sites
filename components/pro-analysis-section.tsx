"use client";

import Link from "next/link";

const WORKLOAD_STEPS = [
  { id: 1, label: "Extract data", detail: "Revenue, costs, assumptions from report" },
  { id: 2, label: "Model scenarios", detail: "Conservative, Realistic, Optimistic" },
  { id: 3, label: "Verify costs", detail: "Distinguish verified vs estimated" },
  { id: 4, label: "Calculate & aggregate", detail: "Totals, net profit, ROI" },
  { id: 5, label: "Recommend", detail: "Clear strategy + rationale" },
];

const NERRADS_TABLE = {
  scenarios: ["Conservative", "Realistic", "Optimistic"] as const,
  revenue: [1135000, 1300000, 1450000],
  avgPrice: ["$142K", "$162K", "$181K"],
  costs: {
    infrastructure: 679389,
    financing: 67939,
    loanFees: 13588,
    salesCommission: [45400, 52000, 58000],
    legalClosing: 25000,
    propertyTaxes: 18000,
    insurance: 12000,
    marketing: 8000,
    contingency: 20377,
  },
  totalCosts: [889693, 896293, 902293],
  netProfit: [245307, 403707, 547707],
  roi: [36, 60, 81],
};

export function ProAnalysisSection() {
  return (
    <section id="pro-analysis" className="mb-24 border-t border-border/50 pt-24">
      <div className="mb-12 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-bold text-accent">
          <span>PRO</span>
          <span className="text-accent/80">· Demo</span>
        </span>
        <h2 className="mt-3 mb-2 text-3xl font-bold">I Analyze Reports & Projects</h2>
        <p className="mx-auto max-w-2xl text-muted">
          Pro feature: feasibility reports, market data, project plans. Trion extracts data, models scenarios, verifies costs, and delivers actionable tables.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/pro-demo"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dim"
          >
            Try the Pro Demo — Reports & Analysis
            <span>→</span>
          </Link>
          <Link
            href="/pro-operations"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-accent/50 bg-accent/10 px-6 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
          >
            Principal Operations Support
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        {/* Static showcase — Nerrads financial table */}
        <div className="rounded-2xl border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent overflow-hidden">
          <div className="border-b border-border bg-card/50 px-6 py-4">
            <h3 className="font-semibold">Complete Financial Analysis — Strategy A: Sell Finished Lots</h3>
            <p className="text-sm text-muted">4929 Nerrads Place • Verified from CWE engineering reports</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium">Scenario</th>
                  {NERRADS_TABLE.scenarios.map((s) => (
                    <th key={s} className="px-4 py-3 text-right font-medium">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="px-4 py-2 text-muted">Total Revenue</td>
                  {NERRADS_TABLE.revenue.map((v, i) => (
                    <td key={i} className="px-4 py-2 text-right">${(v / 1000).toFixed(0)}K</td>
                  ))}
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-4 py-2 text-muted">Avg Price Per Lot</td>
                  {NERRADS_TABLE.avgPrice.map((v, i) => (
                    <td key={i} className="px-4 py-2 text-right">{v}</td>
                  ))}
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-4 py-2 pl-6 text-muted">Infrastructure (verified)</td>
                  <td colSpan={3} className="px-4 py-2 text-right">-$679,389</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-4 py-2 pl-6 text-muted">Financing (12mo @ 10%)</td>
                  <td colSpan={3} className="px-4 py-2 text-right">-$67,939</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-4 py-2 pl-6 text-muted">Sales Commission (4%)</td>
                  {NERRADS_TABLE.costs.salesCommission.map((v, i) => (
                    <td key={i} className="px-4 py-2 text-right">-${(v / 1000).toFixed(0)}K</td>
                  ))}
                </tr>
                <tr className="border-b border-border/50">
                  <td className="px-4 py-2 pl-6 text-muted">Other (legal, taxes, etc.)</td>
                  <td colSpan={3} className="px-4 py-2 text-right">-$63K</td>
                </tr>
                <tr className="border-b border-border font-medium">
                  <td className="px-4 py-2">TOTAL COSTS</td>
                  {NERRADS_TABLE.totalCosts.map((v, i) => (
                    <td key={i} className="px-4 py-2 text-right">-${(v / 1000).toFixed(0)}K</td>
                  ))}
                </tr>
                <tr className="bg-green/10">
                  <td className="px-4 py-3 font-semibold text-green">NET PROFIT</td>
                  {NERRADS_TABLE.netProfit.map((v, i) => (
                    <td key={i} className="px-4 py-3 text-right font-semibold text-green">+${(v / 1000).toFixed(0)}K</td>
                  ))}
                </tr>
                <tr className="bg-green/10">
                  <td className="px-4 py-2 font-semibold text-green">ROI</td>
                  {NERRADS_TABLE.roi.map((v, i) => (
                    <td key={i} className="px-4 py-2 text-right font-semibold text-green">{v}%</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t border-border bg-card/30 px-6 py-3 text-center">
            <a
              href="https://silvercrowdcraft.com/nerrads-project.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent hover:underline"
            >
              View full Nerrads analysis →
            </a>
          </div>
        </div>

        {/* Workload design steps */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Workload Design — What Trion Does</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {WORKLOAD_STEPS.map((step) => (
              <div key={step.id} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/50 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                  {step.id}
                </span>
                <div>
                  <div className="font-medium">{step.label}</div>
                  <div className="text-xs text-muted">{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
