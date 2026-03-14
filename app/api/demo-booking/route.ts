import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/demo-booking
 * Books a call from the pitch demo. Saves to Supabase demo_bookings table.
 * Body: { name, email?, phone?, date, time, topic }
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
    const { name, email, phone, date, time, topic } = body;

    if (!name || !date || !time || !topic) {
      return NextResponse.json(
        { error: "Missing required fields: name, date, time, topic" },
        { status: 400 }
      );
    }

    const contact = phone || email || "from demo";

    const supabase = createClient(url, key);
    const { error } = await supabase.from("demo_bookings").insert({
      name: String(name).trim(),
      phone: contact,
      service: String(topic).trim(),
      date: String(date).trim(),
      time: String(time).trim(),
      notes: email ? `Email: ${email}` : "",
      status: "pending",
    });

    if (error) {
      console.error("Demo booking API error:", error);
      return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Booked ${name} for ${topic} on ${date} at ${time}`,
    });
  } catch (err) {
    console.error("Demo booking API error:", err);
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  }
}
