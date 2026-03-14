"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Client {
  slug: string;
  business_name: string;
  owner: string;
  type: string;
  location: string;
  phone: string;
  email: string;
  instagram: string;
  vibe: string;
  package: string;
  status: string;
  created: string;
  services: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  building: "bg-blue-500/10 text-blue-500",
  active: "bg-green/10 text-green",
  paused: "bg-red-500/10 text-red-500",
};

const PKG_LABELS: Record<string, string> = {
  starter: "Starter ($199 + $50/mo)",
  pro: "Pro ($349 + $75/mo)",
  premium: "Premium ($599 + $150/mo)",
};

export default function ClientsDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => setClients(data.clients || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors">
            &larr; Home
          </Link>
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <p className="text-muted text-sm mt-1">
            {clients.length} client{clients.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background"
          >
            Sign-ups & Calendar
          </Link>
          <Link
            href="/try"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dim"
          >
            + New Client
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted animate-pulse">Loading clients...</div>
      ) : clients.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-4xl mb-4">&#128188;</div>
          <h2 className="text-xl font-bold mb-2">No clients yet</h2>
          <p className="text-muted mb-6">When someone signs up on your /try page, they&apos;ll appear here.</p>
          <Link href="/try" className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white">
            Create First Client
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((client) => (
            <div
              key={client.slug}
              className="rounded-xl border border-border bg-card overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedSlug(expandedSlug === client.slug ? null : client.slug)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">
                    {client.business_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{client.business_name}</div>
                    <div className="text-xs text-muted">{client.owner} &middot; {client.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[client.status] || STATUS_COLORS.pending}`}>
                    {client.status}
                  </span>
                  <span className="text-xs text-muted hidden sm:block">
                    {new Date(client.created).toLocaleDateString()}
                  </span>
                  <span className="text-muted">{expandedSlug === client.slug ? "−" : "+"}</span>
                </div>
              </button>

              {expandedSlug === client.slug && (
                <div className="border-t border-border px-5 py-4 text-sm space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                      <div className="text-xs text-muted mb-0.5">Package</div>
                      <div className="font-medium">{PKG_LABELS[client.package] || client.package}</div>
                    </div>
                    {client.email && (
                      <div>
                        <div className="text-xs text-muted mb-0.5">Email</div>
                        <div>{client.email}</div>
                      </div>
                    )}
                    {client.phone && (
                      <div>
                        <div className="text-xs text-muted mb-0.5">Phone</div>
                        <div>{client.phone}</div>
                      </div>
                    )}
                    {client.location && (
                      <div>
                        <div className="text-xs text-muted mb-0.5">Location</div>
                        <div>{client.location}</div>
                      </div>
                    )}
                    {client.instagram && (
                      <div>
                        <div className="text-xs text-muted mb-0.5">Instagram</div>
                        <div>{client.instagram}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-muted mb-0.5">Vibe</div>
                      <div>{client.vibe}</div>
                    </div>
                  </div>

                  {client.services && (
                    <div>
                      <div className="text-xs text-muted mb-1">Services</div>
                      <div className="rounded-lg bg-background p-3 font-mono text-xs whitespace-pre-wrap">
                        {client.services}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-dim">
                      Build AI Agent
                    </button>
                    <button className="rounded-lg border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-background">
                      Deploy Site
                    </button>
                    <button className="rounded-lg border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-background">
                      Connect Channels
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
