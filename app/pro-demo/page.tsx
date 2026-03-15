"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { VinceAssistant } from "@/components/vince-assistant";

const WORKLOAD_STEPS = [
  { id: 1, label: "Extract data", detail: "Revenue, costs, assumptions from report" },
  { id: 2, label: "Model scenarios", detail: "Conservative, Realistic, Optimistic" },
  { id: 3, label: "Verify costs", detail: "Distinguish verified vs estimated" },
  { id: 4, label: "Calculate & aggregate", detail: "Totals, net profit, ROI" },
  { id: 5, label: "Recommend", detail: "Clear strategy + rationale" },
];

const SAMPLE_TABLE = {
  scenarios: ["Conservative", "Realistic", "Optimistic"] as const,
  revenue: [1135000, 1300000, 1450000],
  avgPrice: ["$142K", "$162K", "$181K"],
  totalCosts: [889693, 896293, 902293],
  netProfit: [245307, 403707, 547707],
  roi: [36, 60, 81],
};

function InputRow({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      ) : (
        <input
          type={label.toLowerCase().includes("url") ? "url" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      )}
    </div>
  );
}

export default function ProDemoPage() {
  const [reportUrl, setReportUrl] = useState("https://silvercrowdcraft.com/nerrads-project.html");
  const [projectType, setProjectType] = useState("feasibility");
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedData, setPastedData] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasInput = reportUrl.trim().length > 0 || uploadedFile !== null || pastedData.trim().length > 0;

  async function handleRunAnalysis() {
    if (!hasInput) return;
    setIsRunning(true);
    setShowOutput(true);
    setCompletedSteps(0);

    // Simulate workload steps completing
    for (let i = 1; i <= 5; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setCompletedSteps(i);
    }

    setIsRunning(false);
  }

  return (
    <div className="animate-fade-in min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-24">
        {/* Hero */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-bold text-accent">
            PRO
          </span>
          <h1 className="mt-3 mb-3 text-4xl font-bold sm:text-5xl">
            I Analyze Reports & Projects
          </h1>
          <p className="mx-auto max-w-2xl text-muted">
            Like building a website — but for reports. Upload Excel/CSV, paste data, or add a URL. Trion extracts, computes, and delivers structured analysis. Strategy comparison, cost breakdown, feasibility scenarios.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/pitch?analyze=https://silvercrowdcraft.com/nerrads-project.html"
              className="inline-flex items-center gap-2 rounded-xl border border-accent/50 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
            >
              Talk to Trion for full analysis →
            </Link>
            <Link
              href="/pro-operations"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-muted/50"
            >
              Principal Operations Support
            </Link>
          </div>
        </div>

        {/* 2-col: Tell Me About Your Report + Output */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left — Tell Me About Your Report */}
          <div className="min-w-0">
            <div className="flex min-h-[420px] flex-col rounded-2xl border-2 border-accent/20 bg-card p-6 shadow-lg">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-accent">
                Tell Me About Your Report
              </h3>
              <p className="mb-4 text-xs text-muted">
                Upload Excel/CSV, paste data, or add a URL. Trion will extract, compute, model scenarios, and deliver a structured analysis.
              </p>
              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="pro-demo-file" className="mb-1 block text-xs font-medium text-muted">Upload Excel or CSV</label>
                  <input
                    id="pro-demo-file"
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
                    aria-label="Upload Excel or CSV file"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-lg border border-dashed border-border bg-background px-3 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:bg-accent/5"
                  >
                    {uploadedFile ? uploadedFile.name : "Choose file (.xlsx, .csv)"}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs text-muted">
                    <span className="bg-card px-2">or</span>
                  </div>
                </div>
                <InputRow
                  label="Report URL"
                  value={reportUrl}
                  onChange={setReportUrl}
                  placeholder="https://example.com/report.pdf or project page"
                />
                <InputRow
                  label="Paste data (CSV, numbers, etc.)"
                  value={pastedData}
                  onChange={setPastedData}
                  placeholder="Paste spreadsheet data, CSV rows, or numbers here..."
                  textarea
                />
                <div>
                  <label htmlFor="project-type" className="mb-1 block text-xs font-medium text-muted">Project Type</label>
                  <select
                    id="project-type"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option value="feasibility">Feasibility / Strategy</option>
                    <option value="cost">Cost Estimate</option>
                    <option value="market">Market Analysis</option>
                    <option value="financial">Financial Projection</option>
                  </select>
                </div>
                <InputRow
                  label="Brief description (optional)"
                  value={description}
                  onChange={setDescription}
                  placeholder="e.g. 8-lot subdivision, sell vs build"
                  textarea
                />
              </div>
              <button
                onClick={handleRunAnalysis}
                disabled={!hasInput || isRunning}
                className="mt-4 w-full rounded-xl bg-accent py-3 font-semibold text-white transition-all hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? "Running workload…" : showOutput ? "Run again" : "Run Analysis"}
              </button>
              {!hasInput && (
                <p className="mt-2 text-center text-xs text-muted">
                  Upload a file, paste data, or add a URL to run analysis.{" "}
                  <a href="/sample-analysis-data.csv" download className="text-accent hover:underline">Download sample CSV</a>
                </p>
              )}
            </div>
          </div>

          {/* Right — Workload + Output */}
          <div className="min-w-0">
            <div className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card p-6 shadow-lg">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">
                Workload & Output
              </h3>

              {!showOutput ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-3xl">
                    📊
                  </div>
                  <p className="text-sm text-muted">
                    Click &quot;Run Analysis&quot; to see Trion&apos;s workload in action — extract, model, verify, calculate, recommend.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Workload steps */}
                  <div className="space-y-2">
                    {WORKLOAD_STEPS.map((step) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                          completedSteps >= step.id
                            ? "border-accent/40 bg-accent/10"
                            : "border-border bg-background/50"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            completedSteps >= step.id ? "bg-accent text-white" : "bg-muted text-muted"
                          }`}
                        >
                          {completedSteps >= step.id ? "✓" : step.id}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{step.label}</div>
                          <div className="text-xs text-muted">{step.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sample output table */}
                  {completedSteps >= 5 && (
                    <div className="rounded-xl border border-border overflow-hidden">
                      <div className="border-b border-border bg-muted/30 px-4 py-2 text-xs font-semibold text-muted">
                        Sample Output — Complete Financial Analysis
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[320px] text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20">
                              <th className="px-3 py-2 text-left font-medium">Scenario</th>
                              {SAMPLE_TABLE.scenarios.map((s) => (
                                <th key={s} className="px-3 py-2 text-right font-medium">{s}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border/50">
                              <td className="px-3 py-1.5 text-muted">Revenue</td>
                              {SAMPLE_TABLE.revenue.map((v, i) => (
                                <td key={i} className="px-3 py-1.5 text-right">${(v / 1000).toFixed(0)}K</td>
                              ))}
                            </tr>
                            <tr className="border-b border-border/50">
                              <td className="px-3 py-1.5 text-muted">Total Costs</td>
                              {SAMPLE_TABLE.totalCosts.map((v, i) => (
                                <td key={i} className="px-3 py-1.5 text-right">-${(v / 1000).toFixed(0)}K</td>
                              ))}
                            </tr>
                            <tr className="bg-green/10">
                              <td className="px-3 py-2 font-semibold text-green">Net Profit</td>
                              {SAMPLE_TABLE.netProfit.map((v, i) => (
                                <td key={i} className="px-3 py-2 text-right font-semibold text-green">+${(v / 1000).toFixed(0)}K</td>
                              ))}
                            </tr>
                            <tr className="bg-green/10">
                              <td className="px-3 py-1.5 font-semibold text-green">ROI</td>
                              {SAMPLE_TABLE.roi.map((v, i) => (
                                <td key={i} className="px-3 py-1.5 text-right font-semibold text-green">{v}%</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border-2 border-accent/20 bg-accent/5 p-8 text-center">
          <h3 className="mb-2 text-xl font-bold">Want the full analysis?</h3>
          <p className="mb-6 text-sm text-muted">
            Pro version: Trion analyzes your Excel, data, or reports, answers questions, and produces custom feasibility studies.
          </p>
          <Link
            href="/pitch#plans"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-semibold text-white transition-colors hover:bg-accent-dim"
          >
            Sign up for Pro version $999 and up
            <span>→</span>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← Back to Trion Express
          </Link>
        </div>
      </div>

      {/* Trion talk box */}
      <VinceAssistant />
    </div>
  );
}
