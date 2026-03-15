import { NextRequest, NextResponse } from "next/server";
import { routeToSkill, getSkill } from "@/lib/trion-skills";
import { buildTrionSystemPrompt, getSkillModeInstruction } from "@/lib/trion-agent";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 503, headers: CORS_HEADERS }
    );
  }

  try {
    const body = await req.json();
    const {
      messages,
      systemPrompt: customPrompt,
      hasPro = false,
    } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: messages required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === "user");
    const lastContent = lastUser?.content ?? "";

    const { skill } = routeToSkill(lastContent);
    const skillDef = getSkill(skill);

    const basePrompt = customPrompt ?? buildTrionSystemPrompt();
    const modeInstruction = getSkillModeInstruction(skill);
    const systemPrompt = modeInstruction + basePrompt;

    const trimmed = messages.slice(-15).map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [{ role: "system", content: systemPrompt }, ...trimmed],
        max_tokens: skill === "strategist" ? 1024 : 512,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.error?.message ?? `OpenAI returned ${response.status}` },
        { status: 502, headers: CORS_HEADERS }
      );
    }

    const headers = {
      ...CORS_HEADERS,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Trion-Skill": skill,
      "X-Trion-Skill-Name": skillDef?.name ?? skill,
      "X-Trion-Skill-Tier": skillDef?.tier ?? "free",
    };

    return new NextResponse(response.body, { headers });
  } catch (err) {
    console.error("Trion agent error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
