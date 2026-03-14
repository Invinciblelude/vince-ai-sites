import { NextResponse } from "next/server";
import { buildTrionSystemPrompt } from "@/lib/trion-agent";

export async function GET() {
  try {
    const prompt = buildTrionSystemPrompt();
    return NextResponse.json({ prompt });
  } catch (err) {
    console.error("Trion prompt build error:", err);
    return NextResponse.json(
      { error: "Failed to build Trion prompt" },
      { status: 500 }
    );
  }
}
