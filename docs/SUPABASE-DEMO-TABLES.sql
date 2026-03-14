-- Run this in Supabase SQL Editor to create demo tables for pitch page
-- These store leads and bookings from the Trion Express demo

-- Demo leads (interests from chat)
CREATE TABLE IF NOT EXISTS demo_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  contact TEXT,
  interest TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Demo form submissions (Tell Me About You data)
CREATE TABLE IF NOT EXISTS demo_form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT,
  owner_name TEXT,
  business_type TEXT,
  services TEXT,
  location TEXT,
  hours TEXT,
  phone TEXT,
  email TEXT,
  goals TEXT,
  pain_points TEXT,
  features TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE demo_form_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert demo_form_submissions" ON demo_form_submissions FOR INSERT WITH CHECK (true);

-- Demo bookings (session bookings from pitch form)
CREATE TABLE IF NOT EXISTS demo_bookings (
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

-- Allow anonymous inserts for demo (no auth required)
ALTER TABLE demo_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert demo_leads" ON demo_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert demo_bookings" ON demo_bookings FOR INSERT WITH CHECK (true);

-- Optional: only ADMIN_EMAIL can read (add your email)
-- CREATE POLICY "Admin read demo_leads" ON demo_leads FOR SELECT USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
-- CREATE POLICY "Admin read demo_bookings" ON demo_bookings FOR SELECT USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
