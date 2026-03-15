import { NextResponse } from "next/server";
import { Client } from "pg";

const SQL = `
DROP TABLE IF EXISTS demo_bookings;

CREATE TABLE demo_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert demo_bookings" ON demo_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select demo_bookings" ON demo_bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow anon select demo_bookings" ON demo_bookings FOR SELECT USING (true);
`;

/**
 * POST /api/setup-demo-bookings
 * Creates demo_bookings table using direct Postgres connection.
 * Requires SUPABASE_DATABASE_URL in .env.local (from Supabase → Settings → Database → Connection string)
 */
export async function POST() {
  const dbUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({
      success: false,
      error: "SUPABASE_DATABASE_URL or DATABASE_URL not set",
      hint: "Add it to .env.local. Get it from Supabase Dashboard → Settings → Database → Connection string (URI). Use 'Direct connection' or 'Transaction pooler'.",
    }, { status: 503 });
  }

  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    await client.query(SQL);
    return NextResponse.json({ success: true, message: "demo_bookings table created. Try booking again." });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      success: false,
      error: msg,
      hint: "Check that SUPABASE_DATABASE_URL is the correct connection string from Supabase → Settings → Database.",
    }, { status: 500 });
  } finally {
    await client.end();
  }
}
