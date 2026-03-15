import { NextResponse } from "next/server";

/**
 * GET /api/test-email
 * Test if Resend is configured and can send to ADMIN_EMAIL.
 * Returns the actual Resend API response for debugging.
 */
export async function GET() {
  const adminEmail = process.env.ADMIN_EMAIL || "nestinghome916@gmail.com";
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    return NextResponse.json({
      ok: false,
      error: "RESEND_API_KEY not set in .env.local",
      adminEmail,
    }, { status: 503 });
  }

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
        subject: "[Trion] Test email — if you see this, Resend works",
        html: "<p>This is a test from Trion Express. Booking emails should work.</p>",
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json({
        ok: true,
        message: "Test email sent. Check your inbox (and spam) at " + adminEmail,
        resendId: data.id,
      });
    }

    return NextResponse.json({
      ok: false,
      error: data.message || `Resend returned ${res.status}`,
      resendResponse: data,
      adminEmail,
      hint: data.message?.includes("not allowed") || data.message?.includes("domain")
        ? "Resend free tier: onboarding@resend.dev can ONLY send to the email you signed up with. Sign up at resend.com using " + adminEmail
        : "Check your RESEND_API_KEY at resend.com → API Keys",
    }, { status: 400 });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      adminEmail,
    }, { status: 500 });
  }
}
