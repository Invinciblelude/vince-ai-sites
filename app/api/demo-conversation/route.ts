import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/demo-conversation
 * Logs a conversation message (user or assistant) to Supabase.
 * Body: { sessionId, role, content }
 */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { sessionId, role, content } = body;

    if (!role || !content || !content.trim()) {
      return NextResponse.json({ error: "role and content required" }, { status: 400 });
    }

    if (role !== "user" && role !== "assistant") {
      return NextResponse.json({ error: "role must be user or assistant" }, { status: 400 });
    }

    const supabase = createClient(url, key);
    const { error } = await supabase.from("demo_conversation_messages").insert({
      session_id: sessionId || null,
      role,
      content: String(content).trim().slice(0, 10000),
    });

    if (error) {
      console.error("Demo conversation API error:", error);
      return NextResponse.json({ error: "Failed to log message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Demo conversation API error:", err);
    return NextResponse.json({ error: "Failed to log message" }, { status: 500 });
  }
}
