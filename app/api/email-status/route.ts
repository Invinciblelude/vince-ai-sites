import { NextResponse } from "next/server";

/**
 * GET /api/email-status
 * Check if email env vars are configured (does NOT reveal actual values).
 * Use this to debug why booking emails aren't arriving.
 */
export async function GET() {
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasAdmin = !!process.env.ADMIN_EMAIL;
  const adminPreview = process.env.ADMIN_EMAIL
    ? `${process.env.ADMIN_EMAIL.slice(0, 3)}***@${process.env.ADMIN_EMAIL.split("@")[1] || "?"}`
    : "not set";

  return NextResponse.json({
    resendConfigured: hasResend,
    adminEmailConfigured: hasAdmin,
    adminEmailPreview: adminPreview,
    ready: hasResend && hasAdmin,
    message: hasResend && hasAdmin
      ? "Email should work. If not, check Resend dashboard and spam folder."
      : !hasResend
        ? "RESEND_API_KEY not set. Add it in Vercel → Settings → Environment Variables."
        : "ADMIN_EMAIL not set. Add it in Vercel → Settings → Environment Variables.",
  });
}
