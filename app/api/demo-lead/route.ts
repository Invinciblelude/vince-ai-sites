import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * POST /api/demo-lead
 * Logs lead/interest from pitch demo. Writes to workspace-trion-demo/data/leads.jsonl
 * Body: { name, contact, interest }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contact, interest } = body;

    if (!interest || !interest.trim()) {
      return NextResponse.json({ error: "Interest/topic required" }, { status: 400 });
    }

    const base = process.env.HOME || "/tmp";
    const dataDir = join(base, ".openclaw", "workspace-trion-demo", "data");
    const leadsPath = join(dataDir, "leads.jsonl");

    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    const lead = {
      name: name || "Demo visitor",
      contact: contact || "",
      interest: String(interest).trim(),
      status: "new",
      created: new Date().toISOString(),
    };

    const line = JSON.stringify(lead) + "\n";
    await writeFile(leadsPath, line, { flag: "a" });

    return NextResponse.json({ success: true, message: "Interest logged" });
  } catch (err) {
    console.error("Demo lead API error:", err);
    return NextResponse.json({ error: "Failed to log interest" }, { status: 500 });
  }
}
