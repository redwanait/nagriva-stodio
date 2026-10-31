-- =============================================================================
-- PROPOSAL — DO NOT APPLY WITHOUT OWNER CONFIRMATION
-- Revoke anonymous INSERT on public.inquiries
-- =============================================================================
-- Status: proposal only. Nothing in this file has been applied anywhere.
-- The website code no longer depends on this policy (see the reasoning below),
-- but applying it changes production behavior for the old GitHub Pages copy
-- and must be coordinated with the deployment of the new website code.
--
-- WHY
--   The public website used to insert leads into public.inquiries directly from
--   the browser using the anon key, with "anon can create inquiries" as the only
--   gate. That policy lets ANY client that holds the public anon key insert
--   arbitrary "pending" rows without going through Turnstile verification or the
--   /api/inquiry email flow — those rows then show up in the dashboard as leads.
--
--   The website now submits through /api/inquiry, which verifies Turnstile
--   first and inserts server-side with the service-role key. Nothing in this
--   repository inserts into public.inquiries from the client anymore
--   (src/lib/startInquiryService.ts was removed), so the anon INSERT policy is
--   no longer needed by the website.
--
-- SAFETY ANALYSIS (what was checked before writing this)
--   * The only client-side insert into public.inquiries in this repo was
--     src/lib/startInquiryService.ts, used solely by the /start form. Removed.
--   * The nagriva-dashboard reads public.inquiries only (authenticated SELECT
--     restricted to the administrator). Its migration
--     "20261016120000_secure_inquiries_rls.sql" keeps the anon INSERT policy
--     untouched, so the DB/dashboard owner must confirm no dashboard feature
--     inserts into inquiries before applying this.
--   * Other tables with anon INSERT policies (project_inquiries,
--     call_bookings, feedbacks) are intentionally NOT touched here.
--   * RLS is already enabled on public.inquiries. With no INSERT policy, the
--     default is DENY even though the table has GRANT to anon.
--
-- ROLLOUT ORDER (important)
--   1. Deploy the new website code (server-side insert) to Vercel.
--   2. Then apply this change in the Supabase SQL editor.
--      - After step 1, the live form no longer uses the anon INSERT policy.
--      - The old GitHub Pages copy still runs the previous build, which inserts
--        from the browser. It will fail to insert after this change — which is
--        the intended outcome (that copy cannot create unverified leads).
--      Applying this BEFORE step 1 would break the live production form.
--
-- VERIFICATION (run after applying; expect NO anon INSERT row for inquiries)
--   select policyname, cmd, roles
--   from pg_policies
--   where schemaname = 'public' and tablename = 'inquiries'
--   order by cmd;
-- =============================================================================

begin;

drop policy if exists "anon can create inquiries" on public.inquiries;

commit;
