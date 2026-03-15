import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/platform-inquiry
 * Platform partner integration inquiry (GoDaddy, Jobber, Square, etc.)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, name, email, platform, message } = body;

    if (!company || !name || !email) {
      return NextResponse.json(
        { success: false, message: "Please provide company, name, and email." },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;

    if (adminEmail && resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Trion Express <onboarding@resend.dev>",
          to: [adminEmail],
          subject: `[Trion] Platform Integration Inquiry: ${company} — ${platform || "Other"}`,
          html: `
            <h2>Platform Integration Inquiry</h2>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Contact:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Platform:</strong> ${platform || "Not specified"}</p>
            ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>` : ""}
            <p><a href="https://trionexpress.com/partnership">Partnership page</a></p>
          `,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thanks! We'll be in touch soon.",
    });
  } catch (err) {
    console.error("Platform inquiry error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
