import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.businessName) {
      return NextResponse.json(
        { error: "Missing business name" },
        { status: 400 }
      );
    }

    const { data: client, error } = await supabase
      .from("clients")
      .insert({
        user_id: data.userId || null,
        business_name: data.businessName,
        owner_name: data.ownerName || "",
        business_type: data.type || "",
        services: data.services || "",
        hours: data.hours || "",
        location: data.location || "",
        phone: data.phone || "",
        email: data.email || "",
        instagram: data.instagram || "",
        vibe: data.vibe || "professional",
        package: data.package || "pro",
        goals: data.goals || "",
        pain_points: data.painPoints || "",
        features: data.features || "",
        status: "pending",
        agent_status: "creating",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    let agentResult = null;
    try {
      const agentRes = await fetch(new URL("/api/setup-agent", req.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      agentResult = await agentRes.json();

      if (agentResult.success) {
        await supabase
          .from("clients")
          .update({ agent_status: "ready", agent_slug: agentResult.slug })
          .eq("id", client.id);
      }
    } catch (agentErr) {
      console.error("Agent setup failed (non-blocking):", agentErr);
      await supabase
        .from("clients")
        .update({ agent_status: "failed" })
        .eq("id", client.id);
    }

    return NextResponse.json({
      success: true,
      id: client.id,
      agentSlug: agentResult?.slug || null,
      message: `${data.businessName} saved! AI agent ${agentResult?.success ? "created" : "pending"}. We'll be in touch within 24 hours.`,
    });
  } catch (err) {
    console.error("Save client error:", err);
    return NextResponse.json(
      { error: "Failed to save. Try again." },
      { status: 500 }
    );
  }
}
