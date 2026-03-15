-- Copy this ENTIRE file into Supabase SQL Editor and Run
-- Creates demo_bookings table with ALL required columns for the pitch page

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
