import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * POST /api/demo-booking
 * Books a call from the pitch demo. Writes to workspace-trion-demo/data/bookings.jsonl
 * Body: { name, email?, phone?, date, time, topic }
 */
export async function POST(req: NextRequest) {
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

    const base = process.env.HOME || "/tmp";
    const dataDir = join(base, ".openclaw", "workspace-trion-demo", "data");
    const bookingsPath = join(dataDir, "bookings.jsonl");

    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    const booking = {
      name: String(name).trim(),
      phone: contact,
      service: String(topic).trim(),
      date: String(date).trim(),
      time: String(time).trim(),
      notes: email ? `Email: ${email}` : "",
      status: "pending",
      created: new Date().toISOString(),
    };

    const line = JSON.stringify(booking) + "\n";
    await writeFile(bookingsPath, line, { flag: "a" });

    return NextResponse.json({
      success: true,
      message: `Booked ${name} for ${topic} on ${date} at ${time}`,
    });
  } catch (err) {
    console.error("Demo booking API error:", err);
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  }
}
