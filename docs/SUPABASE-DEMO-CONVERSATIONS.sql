-- Run this in Supabase SQL Editor to add conversation logging
-- (If you already ran SUPABASE-DEMO-SETUP-FULL.sql, you may need to run this to add the new table)

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
