import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/demo-form
 * Saves Tell Me About You form data to Supabase demo_form_submissions.
 * Run docs/SUPABASE-DEMO-TABLES.sql to create the table.
 */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const {
      businessName,
      ownerName,
      type,
      services,
      location,
      hours,
      phone,
      email,
      goals,
      painPoints,
      features,
    } = body;

    if (!businessName && !ownerName && !type) {
      return NextResponse.json({ error: "At least one of businessName, ownerName, or type required" }, { status: 400 });
    }

    const supabase = createClient(url, key);
    const { error } = await supabase.from("demo_form_submissions").insert({
      business_name: businessName || null,
      owner_name: ownerName || null,
      business_type: type || null,
      services: services || null,
      location: location || null,
      hours: hours || null,
      phone: phone || null,
      email: email || null,
      goals: goals || null,
      pain_points: painPoints || null,
      features: features || null,
    });

    if (error) {
      console.error("Demo form API error:", error);
      return NextResponse.json({ error: "Failed to save form" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Form saved" });
  } catch (err) {
    console.error("Demo form API error:", err);
    return NextResponse.json({ error: "Failed to save form" }, { status: 500 });
  }
}
