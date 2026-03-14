import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/demo-lead
 * Logs lead/interest from pitch demo. Saves to Supabase demo_leads table.
 * Body: { name, contact, interest }
 * Run docs/SUPABASE-DEMO-TABLES.sql in Supabase to create the table.
 */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { name, contact, interest } = body;

    if (!interest || !interest.trim()) {
      return NextResponse.json({ error: "Interest/topic required" }, { status: 400 });
    }

    const supabase = createClient(url, key);
    const { error } = await supabase.from("demo_leads").insert({
      name: name || "Demo visitor",
      contact: contact || "",
      interest: String(interest).trim(),
      status: "new",
    });

    if (error) {
      console.error("Demo lead API error:", error);
      return NextResponse.json({ error: "Failed to log interest" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Interest logged" });
  } catch (err) {
    console.error("Demo lead API error:", err);
    return NextResponse.json({ error: "Failed to log interest" }, { status: 500 });
  }
}
