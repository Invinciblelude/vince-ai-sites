"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Lead {
  id: string;
  name: string | null;
  contact: string | null;
  interest: string;
  status: string;
  created_at: string;
}

interface Booking {
  id: string;
  name: string;
  phone: string | null;
  service: string;
  date: string;
  time: string;
  notes: string | null;
  status: string;
  created_at: string;
}

interface FormSubmission {
  id: string;
  business_name: string | null;
  owner_name: string | null;
  business_type: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}

interface ConversationMessage {
  id: string;
  session_id: string | null;
  role: string;
  content: string;
  created_at: string;
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [conversations, setConversations] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "calendar" | "signups" | "conversations">("overview");

  useEffect(() => {
    fetch("/api/demo-dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => {
        setLeads(data.leads || []);
        setBookings(data.bookings || []);
        setForms(data.formSubmissions || []);
        setConversations(data.conversations || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const recentActivity = [
    ...leads.map((l) => ({ type: "lead" as const, label: l.interest || "Interest", name: l.name || l.contact || "Anonymous", at: l.created_at })),
    ...forms.map((f) => ({ type: "form" as const, label: "Tell Me About You", name: f.business_name || f.owner_name || f.email || "Form", at: f.created_at })),
    ...conversations.map((c) => ({ type: "message" as const, label: c.role || "message", name: (c.content || "").slice(0, 50) + ((c.content || "").length > 50 ? "…" : ""), at: c.created_at })),
    ...bookings.map((b) => ({ type: "booking" as const, label: `${b.date || ""} at ${b.time || ""}`, name: b.name || "Booking", sub: b.service, at: b.created_at })),
  ].filter((x) => x.at).sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 15);

  const bookingsByDate = bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    const d = b.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(b);
    return acc;
  }, {});

  const sortedDates = Object.keys(bookingsByDate).sort();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-sm text-muted mb-4">
            Check: (1) Signed in as admin, (2) <code className="bg-muted px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> in Vercel matches the project where you ran <code className="bg-muted px-1 rounded">SUPABASE-DEMO-SETUP-FULL.sql</code>, (3) Same Supabase project for URL + anon key.
          </p>
          <Link href="/clients" className="text-accent hover:underline">Back to Clients</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/clients" className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors">
            &larr; Clients
          </Link>
          <h1 className="text-3xl font-bold">Leads & Bookings</h1>
          <p className="text-muted text-sm mt-1">
            Demo activity from the pitch page — sign-ups, bookings, conversations
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "overview" ? "border-accent text-accent" : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("signups")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "signups" ? "border-accent text-accent" : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Sign-ups ({leads.length + forms.length})
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "calendar" ? "border-accent text-accent" : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Calendar ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("conversations")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "conversations" ? "border-accent text-accent" : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Conversations ({conversations.length})
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-3">
          {/* Alert cards */}
          <div className="rounded-xl border-2 border-accent/20 bg-accent/5 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              Recent activity
            </h3>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted">No activity yet. Chat and bookings from the pitch page will appear here.</p>
            ) : (
              <ul className="space-y-2">
                {recentActivity.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 rounded-lg bg-background px-4 py-3 text-sm">
                    <div className="min-w-0 flex-1">
                      {item.type === "message" ? (
                        <>
                          <span className="font-medium capitalize">{item.label}</span>
                          <div className="text-muted truncate mt-0.5">{item.name}</div>
                        </>
                      ) : item.type === "booking" ? (
                        <>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted"> — Session {item.label}</span>
                          {item.sub && <div className="text-muted truncate mt-0.5">{item.sub}</div>}
                        </>
                      ) : (
                        <>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted"> — {item.label}</span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-muted shrink-0">{item.at ? new Date(item.at).toLocaleString() : "—"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-2xl font-bold text-accent">{leads.length}</div>
              <div className="text-sm text-muted">Leads</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-2xl font-bold text-green">{bookings.length}</div>
              <div className="text-sm text-muted">Bookings</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-2xl font-bold text-accent">{forms.length}</div>
              <div className="text-sm text-muted">Forms</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-2xl font-bold text-accent">{conversations.length}</div>
              <div className="text-sm text-muted">Messages</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "conversations" && (
        <div className="space-y-6">
          <h3 className="font-semibold">All notes & conversations</h3>
          <p className="text-sm text-muted">Full chat log from the pitch page — user messages, Trion responses, and form notes.</p>
          {conversations.length === 0 ? (
            <p className="text-sm text-muted">No messages yet. Chat on the pitch page to see them here.</p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {conversations.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    m.role === "user" ? "border-accent/30 bg-accent/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-xs uppercase text-muted">{m.role}</span>
                    <span className="text-xs text-muted">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <div className="whitespace-pre-wrap break-words">{m.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "signups" && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Leads (chat interest)</h3>
            {leads.length === 0 ? (
              <p className="text-sm text-muted">No leads yet.</p>
            ) : (
              <div className="space-y-2">
                {leads.map((l) => (
                  <div key={l.id} className="rounded-lg border border-border bg-card p-4 text-sm">
                    <div className="font-medium">{l.name || l.contact || "Anonymous"}</div>
                    <div className="text-muted mt-1">{l.interest}</div>
                    <div className="text-xs text-muted mt-2">{new Date(l.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-3">Form submissions (Tell Me About You)</h3>
            {forms.length === 0 ? (
              <p className="text-sm text-muted">No form submissions yet.</p>
            ) : (
              <div className="space-y-2">
                {forms.map((f) => (
                  <div key={f.id} className="rounded-lg border border-border bg-card p-4 text-sm">
                    <div className="font-medium">{f.business_name || f.owner_name || "—"}</div>
                    <div className="text-muted mt-1">{f.business_type} {f.email && `• ${f.email}`}</div>
                    <div className="text-xs text-muted mt-2">{new Date(f.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="space-y-6">
          <h3 className="font-semibold">All booking sessions</h3>
          <p className="text-sm text-muted">Every session booked from the pitch page. Logged chronologically.</p>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted">No bookings yet. Bookings from the pitch page will appear here.</p>
          ) : (
            <>
              {/* Full log — all sessions, newest first */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="divide-y divide-border max-h-[50vh] overflow-y-auto">
                  {bookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-muted/30">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{b.name}</div>
                        <div className="text-muted truncate">{b.service}</div>
                        {b.phone && <div className="text-xs text-muted mt-0.5">{b.phone}</div>}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-medium">{b.date} at {b.time}</div>
                        <div className="text-xs text-muted">{new Date(b.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Grouped by date */}
              <details className="rounded-xl border border-border bg-card overflow-hidden">
                <summary className="bg-muted/30 px-4 py-3 font-medium text-sm cursor-pointer hover:bg-muted/50">
                  View by date
                </summary>
                <div className="divide-y divide-border">
                  {sortedDates.map((date) => (
                    <div key={date}>
                      <div className="bg-muted/20 px-4 py-2 font-medium text-sm">
                        {new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                      </div>
                      <div className="divide-y divide-border">
                        {bookingsByDate[date].map((b) => (
                          <div key={b.id} className="flex items-center justify-between px-4 py-3 text-sm">
                            <div>
                              <div className="font-medium">{b.name}</div>
                              <div className="text-muted">{b.service}</div>
                            </div>
                            <div className="text-right">
                              <div>{b.time}</div>
                              {b.phone && <div className="text-xs text-muted">{b.phone}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
}
