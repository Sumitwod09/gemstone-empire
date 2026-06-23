-- ============================================================
-- Gemstone Empire — Promote User to Admin
-- Run this in Supabase SQL Editor AFTER the user has signed up.
-- Replace 'YOUR_EMAIL_HERE' with the actual admin email address.
-- ============================================================

-- Step 1: Promote the user
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
where email = 'YOUR_EMAIL_HERE';

-- Step 2: Verify (optional — run this SELECT to confirm)
-- select id, email, raw_app_meta_data from auth.users where email = 'YOUR_EMAIL_HERE';
