import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabase } from "@supabase/supabase-js";

/**
 * GET /api/demo-dashboard
 * Fetches demo leads, bookings, form submissions for admin dashboard.
 * Requires admin auth. Uses service role if set (bypasses RLS on demo tables).
 */
export async function GET() {
  try {
    const serverClient = await createClient();
    const { data: { user } } = await serverClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || user.email !== adminEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
    }

    const supabase = serviceKey
      ? createSupabase(url, serviceKey)
      : serverClient;

    const [leadsRes, bookingsRes, formsRes] = await Promise.all([
      supabase.from("demo_leads").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("demo_bookings").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("demo_form_submissions").select("*").order("created_at", { ascending: false }).limit(50),
    ]);

    let conversations: Record<string, unknown>[] = [];
    try {
      const convRes = await supabase.from("demo_conversation_messages").select("*").order("created_at", { ascending: false }).limit(500);
      conversations = convRes.data || [];
    } catch {
      // Table may not exist yet
    }

    return NextResponse.json({
      leads: leadsRes.data || [],
      bookings: bookingsRes.data || [],
      formSubmissions: formsRes.data || [],
      conversations,
    });
  } catch (err) {
    console.error("Demo dashboard API error:", err);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
