-- Run this in Supabase SQL Editor if booking fails with "Could not save booking"
-- This allows the conflict check to work when using anon key (fallback when service role fails)

-- Option 1: Allow anon to SELECT for conflict check (needed if SUPABASE_SERVICE_ROLE_KEY is wrong/missing)
DROP POLICY IF EXISTS "Allow anon select demo_bookings";
CREATE POLICY "Allow anon select demo_bookings" ON demo_bookings FOR SELECT USING (true);

-- Option 2: If table doesn't exist, run SUPABASE-DEMO-SETUP-FULL.sql first
