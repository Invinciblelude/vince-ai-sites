# Booking Setup Checklist

If "Could not save booking" or "table not found" appears:

## 1. Verify Same Supabase Project

**Critical:** Vercel env vars and the SQL you run must use the **same** Supabase project.

- In **Vercel** → Project → Settings → Environment Variables, note:
  - `NEXT_PUBLIC_SUPABASE_URL` (e.g. `https://xxxxx.supabase.co`)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (optional but recommended)

- In **Supabase** → Project Settings → API, confirm:
  - Project URL matches `NEXT_PUBLIC_SUPABASE_URL` exactly
  - Anon key matches `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Service role key matches `SUPABASE_SERVICE_ROLE_KEY`

## 2. Run the SQL

1. Supabase Dashboard → **SQL Editor**
2. Copy all of `docs/SUPABASE-DEMO-SETUP-FULL.sql`
3. Paste and click **Run**
4. Confirm no errors

## 3. Test

Visit **https://trionexpress.com/api/check-supabase**

- If `ok: true` → Booking should work. Try again.
- If `ok: false` → Read the `hint` field. Usually means wrong project or SQL not run in that project.

## 4. Redeploy (if you changed env vars)

After editing Vercel env vars, trigger a redeploy so the new values are used.
