-- Run this ONLY if demo tables already exist (from SUPABASE-DEMO-TABLES.sql)
-- If tables don't exist, run SUPABASE-DEMO-SETUP-FULL.sql instead
-- Enables the dashboard to read demo_leads, demo_bookings, demo_form_submissions

CREATE POLICY "Allow select demo_leads" ON demo_leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow select demo_bookings" ON demo_bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow select demo_form_submissions" ON demo_form_submissions FOR SELECT USING (auth.role() = 'authenticated');
