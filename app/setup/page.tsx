"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const DEMO_BOOKINGS_SQL = `-- Copy this ENTIRE block into Supabase SQL Editor and Run
-- Project: Supabase Dashboard → SQL Editor → New query

DROP TABLE IF EXISTS demo_bookings;

CREATE TABLE demo_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert demo_bookings" ON demo_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select demo_bookings" ON demo_bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow anon select demo_bookings" ON demo_bookings FOR SELECT USING (true);`;

export default function SetupPage() {
  const [status, setStatus] = useState<{ ok: boolean; message?: string; hint?: string; projectId?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [setupRunning, setSetupRunning] = useState(false);
  const [setupResult, setSetupResult] = useState<{ ok: boolean; message?: string } | null>(null);

  useEffect(() => {
    fetch("/api/check-supabase")
      .then((r) => r.json())
      .then((data) => {
        const projectId = data.projectId ?? data.projectUrl;
        if (data.ok) {
          setStatus({ ok: true, message: data.message, projectId });
        } else {
          setStatus({ ok: false, message: data.error, hint: data.hint, projectId });
        }
      })
      .catch(() => setStatus({ ok: false, message: "Could not reach API" }));
  }, []);

  async function copySql() {
    await navigator.clipboard.writeText(DEMO_BOOKINGS_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function runSetup() {
    setSetupRunning(true);
    setSetupResult(null);
    try {
      const res = await fetch("/api/setup-demo-bookings", { method: "POST" });
      const data = await res.json();
      setSetupResult({ ok: data.success, message: data.message || data.error || (data.hint ? `${data.error}. ${data.hint}` : "Unknown error") });
      if (data.success) {
        setTimeout(() => {
          fetch("/api/check-supabase").then((r) => r.json()).then((d) => {
            const projectId = d.projectId ?? d.projectUrl;
            setStatus(d.ok ? { ok: true, message: d.message, projectId } : { ok: false, message: d.error, hint: d.hint, projectId });
          });
        }, 500);
      }
    } catch {
      setSetupResult({ ok: false, message: "Request failed" });
    } finally {
      setSetupRunning(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/home" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
          <Image src="/trion-express-logo-orange.png" alt="" width={32} height={32} className="rounded-lg" />
          <span className="font-semibold">Trion Express</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">Supabase Booking Setup</h1>
        <p className="mb-6 text-muted">
          If you see &quot;Could not find the table demo_bookings&quot;, the table is missing or you&apos;re connected to the wrong project. Run the SQL below in the <strong>same Supabase project</strong> that matches your <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_URL</code> in .env.local.
        </p>

        {status && (
          <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${status.ok ? "bg-green/10 text-green" : "bg-red-500/10 text-red-600"}`}>
            {status.ok ? "✓" : "⚠"} {status.ok ? status.message : status.message}
            {status.projectId && (
              <p className="mt-1 text-xs">
                App connects to project: <code className="rounded bg-black/20 px-1">{status.projectId}</code>
                {!status.ok && " — run the SQL in this project."}
              </p>
            )}
            {status.hint && !status.ok && <p className="mt-2 text-xs opacity-90">{status.hint}</p>}
          </div>
        )}

        <h2 className="mb-2 font-semibold">Option A: One-click setup (easiest)</h2>
        <p className="mb-3 text-sm text-muted">
          Add <code className="rounded bg-muted px-1">SUPABASE_DATABASE_URL</code> to .env.local. Get it from Supabase → Settings → Database → Connection string (URI). Use &quot;Direct connection&quot; or &quot;Transaction pooler&quot;.
        </p>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            onClick={runSetup}
            disabled={setupRunning}
            className="rounded-lg bg-green px-4 py-2 text-sm font-semibold text-white hover:bg-green/90 disabled:opacity-50"
          >
            {setupRunning ? "Creating table…" : "Create demo_bookings table now"}
          </button>
          {setupResult && (
            <span className={`text-sm ${setupResult.ok ? "text-green" : "text-red-600"}`}>
              {setupResult.ok ? "✓" : "⚠"} {setupResult.message}
            </span>
          )}
        </div>

        <h2 className="mb-2 font-semibold">Option B: Manual SQL</h2>
        <ol className="mb-6 list-decimal list-inside space-y-2 text-sm text-muted">
          <li>Open Supabase Dashboard and select your project</li>
          <li>Go to SQL Editor → New query</li>
          <li>Copy the SQL below and paste it → Run</li>
          <li>Add <code className="rounded bg-muted px-1">SUPABASE_SERVICE_ROLE_KEY</code> to .env.local (from Supabase → Settings → API)</li>
          <li>Restart dev server: <code className="rounded bg-muted px-1">npm run dev</code></li>
        </ol>

        <div className="relative">
          <pre className="overflow-x-auto rounded-lg border border-border bg-background p-4 text-xs">
            <code>{DEMO_BOOKINGS_SQL}</code>
          </pre>
          <button
            onClick={copySql}
            className="absolute top-2 right-2 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-dim"
          >
            {copied ? "Copied!" : "Copy SQL"}
          </button>
        </div>

        {status?.projectId && (
          <div className="mb-6">
            <a
              href={`https://supabase.com/dashboard/project/${status.projectId}/sql/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-accent bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20"
            >
              Open SQL Editor in correct project →
            </a>
            <p className="mt-1 text-xs text-muted">Opens Supabase SQL Editor for project {status.projectId}. Paste the SQL above and Run.</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() =>
              fetch("/api/check-supabase")
                .then((r) => r.json())
                .then((d) => {
                  const projectId = d.projectId ?? d.projectUrl;
                  setStatus(d.ok ? { ok: true, message: d.message, projectId } : { ok: false, message: d.error, hint: d.hint, projectId });
                })
            }
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-card"
          >
            Verify again
          </button>
          <Link href="/book" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dim">
            Try booking
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center">
        <Link href="/home" className="text-sm text-muted hover:text-foreground">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
