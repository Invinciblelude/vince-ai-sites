"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BookPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim();
    const businessType = (form.elements.namedItem("businessType") as HTMLInputElement)?.value?.trim();
    const website = (form.elements.namedItem("website") as HTMLInputElement)?.value?.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement)?.value?.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
    const date = (form.elements.namedItem("date") as HTMLInputElement)?.value;
    const time = (form.elements.namedItem("time") as HTMLInputElement)?.value;
    const topic = (form.elements.namedItem("topic") as HTMLInputElement)?.value?.trim() || "15-minute discovery call";

    if (!name || !date || !time) {
      setMessage({ type: "error", text: "Please fill in name, date, and time." });
      return;
    }
    if (!phone && !email) {
      setMessage({ type: "error", text: "Please provide phone or email." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const notes = [businessType && `Business: ${businessType}`, website && `Website: ${website}`].filter(Boolean).join(" · ");
      const res = await fetch("/api/demo-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: phone || undefined,
          email: email || undefined,
          date,
          time,
          topic,
          ...(notes && { notes }),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setMessage({ type: "success", text: "You're booked! We'll confirm by email or phone shortly." });
        form.reset();
      } else {
        const reason = data.reason ? ` ${data.reason}` : "";
        setMessage({ type: "error", text: (data.message || "Something went wrong. Please try again.") + reason });
      }
    } catch {
      setMessage({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/home" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
          <Image src="/trion-express-logo-orange.png" alt="" width={32} height={32} className="rounded-lg" />
          <span className="font-semibold">Trion Express</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">Make an appointment</h1>
        <p className="mb-6 text-muted">
          Tell us about your business. We&apos;ll discuss Launch (website + AI) or Trion Ultra (full AI team) and get you set up.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Your name *</label>
            <input name="name" required className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm" placeholder="John Smith" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Business type</label>
            <input name="businessType" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm" placeholder="Barber shop, restaurant, contractor..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Website (if any)</label>
            <input name="website" type="text" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm" placeholder="example.com or https://example.com" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input name="phone" type="tel" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm" placeholder="555-123-4567" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input name="email" type="email" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm" placeholder="you@example.com" />
            </div>
          </div>
          <p className="text-xs text-muted">Provide at least one: phone or email</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="book-date" className="mb-1 block text-sm font-medium">Preferred date *</label>
              <input id="book-date" name="date" type="date" required className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm" aria-label="Preferred date" />
            </div>
            <div>
              <label htmlFor="book-time" className="mb-1 block text-sm font-medium">Preferred time *</label>
              <input id="book-time" name="time" type="time" required className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm" aria-label="Preferred time" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Topic / interest</label>
            <input name="topic" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm" placeholder="15-minute discovery call" defaultValue="15-minute discovery call" />
          </div>

          {message && (
            <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "bg-green/10 text-green" : "bg-red-500/10 text-red-600"}`}>
              {message.type === "success" ? "✓" : "⚠"} {message.text}
              {message.type === "error" && (
                <a href="/setup" className="block mt-2 text-xs underline">
                  Fix Supabase setup →
                </a>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green py-3.5 font-semibold text-white transition-colors hover:bg-green/90 disabled:opacity-50"
          >
            {loading ? "Booking…" : "Schedule appointment"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          We&apos;ll confirm your slot and send a reminder. No spam.
        </p>
      </div>

      <p className="mt-6 text-center">
        <Link href="/home" className="text-sm text-muted hover:text-foreground">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
