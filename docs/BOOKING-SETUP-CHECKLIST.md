# Booking Setup Checklist

The "Could not find the table demo_bookings" error usually means **project mismatch** or **wrong env file**.

## 1. Use ONE Supabase project

You have two different Supabase projects in your env files:
- `.env.local` (used when running `npm run dev` locally)
- `env-for-vercel.env` (used when deployed to Vercel)

**The SQL must be run in the SAME project your app connects to.**

- **Local dev** → Run SQL in the project from `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`
- **Deployed** → Run SQL in the project from Vercel env vars

## 2. Verify project match

1. Open Supabase Dashboard → your project
2. Check the URL in the browser: `https://supabase.com/dashboard/project/XXXXX`
3. Your `NEXT_PUBLIC_SUPABASE_URL` should be `https://XXXXX.supabase.co` (same project ID)

If they don't match, either:
- Run the SQL in the project that matches your `.env.local`, OR
- Update `.env.local` to point to the project where you ran the SQL

## 3. Required env vars (local dev)

In `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your anon key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your service role key...
```

Get both keys from: Supabase Dashboard → Project Settings → API

- **anon key** = `anon` / `public` key
- **service role key** = `service_role` key (keep secret, never expose to client)

## 4. SQL to run (exact schema the API expects)

Run this in Supabase SQL Editor → **the project that matches your .env.local**:

```sql
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
```

## 5. Restart dev server

After changing `.env.local`:

```bash
# Stop the server (Ctrl+C), then:
npm run dev
```

## 6. Deploy (Vercel)

For production, add the same vars to Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Use the **same Supabase project** you ran the SQL in. Redeploy after adding env vars.
