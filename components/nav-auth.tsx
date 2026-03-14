"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

export function NavAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.isAdmin === true))
      .catch(() => setIsAdmin(false));
  }, [user]);

  if (loading) return null;

  if (user) {
    const initial = (user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase();

    return (
      <div className="flex items-center gap-3">
        {isAdmin && (
          <Link href="/clients" className="hidden sm:block text-sm text-muted transition-colors hover:text-foreground">
            Dashboard
          </Link>
        )}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            {initial}
          </div>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-card"
    >
      Sign in
    </Link>
  );
}
