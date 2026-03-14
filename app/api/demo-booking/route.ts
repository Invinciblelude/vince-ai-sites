import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/** Parse "HH:mm" or "H:mm" to minutes since midnight */
function timeToMinutes(t: string): number {
  const [h, m] = String(t).trim().split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** Check if requested time is within 1 hour of any existing booking on same date */
function hasConflict(requestedTime: string, existingTimes: string[]): boolean {
  const reqMin = timeToMinutes(requestedTime);
  for (const t of existingTimes) {
    const existMin = timeToMinutes(t);
    if (Math.abs(reqMin - existMin) < 60) return true;
  }
  return false;
}

/**
 * POST /api/demo-booking
 * Books a call from the pitch demo. Enforces 1-hour separation between bookings.
 * Body: { name, email?, phone?, date, time, topic }
 */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anonKey) {
    return NextResponse.json({
      success: false,
      error: "config",
      message: "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.",
    }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, date, time, topic } = body;

    if (!name || !date || !time || !topic) {
      return NextResponse.json({
        success: false,
        error: "missing_fields",
        message: "Please fill in name, date, time, and topic.",
      }, { status: 400 });
    }

    // Normalize date: HTML date input returns YYYY-MM-DD; some pickers use MM/DD/YYYY
    let dateStr = String(date).trim();
    const m = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) dateStr = `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
    const timeStr = String(time).trim();
    const contact = phone || email || "from demo";

    // Prefer service role — bypasses RLS. Fallback to anon.
    let supabase = createClient(url, serviceKey || anonKey);

    // Conflict check — skip if it fails (e.g. anon can't SELECT)
    let existingTimes: string[] = [];
    try {
      const { data: existing } = await supabase
        .from("demo_bookings")
        .select("time")
        .eq("date", dateStr);
      existingTimes = (existing || []).map((r: { time?: string }) => r.time).filter((t): t is string => !!t);
    } catch {
      // Ignore — proceed with insert
    }

    if (hasConflict(timeStr, existingTimes)) {
      return NextResponse.json({
        success: false,
        error: "slot_unavailable",
        message: "This time slot isn't available. Please choose a time at least 1 hour apart from existing bookings.",
      }, { status: 409 });
    }

    const row = {
      name: String(name).trim(),
      phone: contact,
      service: String(topic).trim(),
      date: dateStr,
      time: timeStr,
      notes: email ? `Email: ${email}` : "",
      status: "pending",
    };

    let { error } = await supabase.from("demo_bookings").insert(row);

    // If service role failed (e.g. wrong key), retry with anon
    if (error && serviceKey) {
      console.warn("Demo booking: service role failed, retrying with anon:", error.message);
      supabase = createClient(url, anonKey);
      const retry = await supabase.from("demo_bookings").insert(row);
      error = retry.error;
    }

    if (error) {
      console.error("Demo booking API error:", error);
      const hint = error.message?.includes("does not exist")
        ? "Table demo_bookings not found. Run docs/SUPABASE-DEMO-SETUP-FULL.sql in Supabase."
        : error.message?.includes("JWT") || error.message?.includes("auth")
          ? "Supabase key invalid. Check SUPABASE_SERVICE_ROLE_KEY and anon key in Vercel."
          : error.message || "Unknown database error.";
      return NextResponse.json({
        success: false,
        error: "save_failed",
        message: "Could not save booking.",
        reason: hint,
      }, { status: 500 });
    }

    // Email alert to admin — set RESEND_API_KEY and ADMIN_EMAIL in Vercel
    const adminEmail = process.env.ADMIN_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;
    if (adminEmail && resendKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "Trion Express <onboarding@resend.dev>",
            to: [adminEmail],
            subject: `New session booked: ${name} — ${date} at ${time}`,
            html: `<p><strong>${name}</strong> booked a session.</p><p><strong>Date:</strong> ${date} at ${time}</p><p><strong>Topic:</strong> ${topic}</p><p><strong>Contact:</strong> ${contact}</p><p><a href="https://trionexpress.com/dashboard">View dashboard</a></p>`,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) console.error("Resend email failed:", res.status, data);
      } catch (e) {
        console.error("Resend email error:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Booked! ${name} — ${date} at ${time} for ${topic}`,
    });
  } catch (err) {
    console.error("Demo booking API error:", err);
    return NextResponse.json({ success: false, error: "server_error", message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
