import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * POST /api/booking
 * Accepts booking data from: Trion agent, voice AI (Vapi/Bland), or calendar sync.
 * Writes to workspace-{slug}/data/bookings.jsonl
 *
 * Body: { workspaceSlug, name, phone, service, date, time, notes? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceSlug, name, phone, service, date, time, notes } = body;

    if (!workspaceSlug || !name || !phone || !service || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields: workspaceSlug, name, phone, service, date, time" },
        { status: 400 }
      );
    }

    const base = process.env.HOME || "/tmp";
    const dataDir = join(base, ".openclaw", `workspace-${workspaceSlug}`, "data");
    const bookingsPath = join(dataDir, "bookings.jsonl");

    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    const booking = {
      name,
      phone,
      service,
      date,
      time,
      notes: notes || "",
      status: "pending",
      created: new Date().toISOString(),
    };

    const line = JSON.stringify(booking) + "\n";
    await writeFile(bookingsPath, line, { flag: "a" });

    return NextResponse.json({
      success: true,
      message: `Booked ${name} for ${service} on ${date} at ${time}`,
    });
  } catch (err) {
    console.error("Booking API error:", err);
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  }
}
