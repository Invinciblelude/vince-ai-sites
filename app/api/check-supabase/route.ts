import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /api/check-supabase
 * Diagnostic: verify Supabase connection and demo_bookings table.
 * Visit trionexpress.com/api/check-supabase to debug booking issues.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    return NextResponse.json({
      ok: false,
      error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel env",
    });
  }

  try {
    // Try with service role first, then anon
    const key = serviceKey || anonKey;
    const supabase = createClient(url, key);

    const { data, error } = await supabase.from("demo_bookings").select("id").limit(1);

    if (error) {
      const msg = error.message || "";
      const hint = msg.includes("does not exist") || msg.includes("schema cache")
        ? "Run docs/SUPABASE-DEMO-SETUP-FULL.sql in Supabase SQL Editor. Make sure you're in the SAME project as your Vercel env vars (check Supabase URL in Vercel matches the project where you ran the SQL)."
        : msg.includes("JWT") || msg.includes("auth")
          ? "Invalid Supabase key. In Vercel, verify NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY match the project at NEXT_PUBLIC_SUPABASE_URL."
          : msg;

      const projectId = url.replace(/https:\/\//, "").split(".")[0];
      return NextResponse.json({
        ok: false,
        tableExists: false,
        error: msg,
        hint,
        projectId,
        projectUrl: projectId, // legacy
      });
    }

    const projectId = url.replace(/https:\/\//, "").split(".")[0];
    return NextResponse.json({
      ok: true,
      tableExists: true,
      message: "demo_bookings table is ready. Booking should work.",
      projectId,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
