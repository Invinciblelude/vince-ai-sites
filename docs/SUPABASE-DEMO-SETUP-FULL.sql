-- Run this ONCE in Supabase SQL Editor
-- Creates demo tables + policies for Trion Express pitch page and dashboard

-- 1. Create tables
CREATE TABLE IF NOT EXISTS demo_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  contact TEXT,
  interest TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

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

-- 2. Enable RLS
ALTER TABLE demo_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;

-- 3. INSERT policies (anyone can insert from pitch page)
CREATE POLICY "Allow insert demo_leads" ON demo_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert demo_form_submissions" ON demo_form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert demo_bookings" ON demo_bookings FOR INSERT WITH CHECK (true);

-- Conversation messages (full chat log)
CREATE TABLE IF NOT EXISTS demo_conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE demo_conversation_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert demo_conversation_messages" ON demo_conversation_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select demo_conversation_messages" ON demo_conversation_messages FOR SELECT USING (auth.role() = 'authenticated');

-- 4. SELECT policies (authenticated admin can read in dashboard)
CREATE POLICY "Allow select demo_leads" ON demo_leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow select demo_form_submissions" ON demo_form_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow select demo_bookings" ON demo_bookings FOR SELECT USING (auth.role() = 'authenticated');
