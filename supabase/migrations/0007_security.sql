-- ============================================================================
-- 0007_security.sql — Hardening
-- ============================================================================
-- 1. Lock profiles.is_admin: clients may only edit their own full_name; the
--    admin flag can only ever be changed via the service-role key.
-- 2. Remove anonymous direct INSERT on leads / newsletter_subscribers — those
--    writes must go through the validated server actions (which use the
--    service-role key and add honeypot + rate-limit + Zod validation).
-- ============================================================================

-- ---------- 1. Protect profiles.is_admin via column-level privileges ----------
-- RLS already restricts rows; column grants restrict WHICH columns clients
-- may write. Service-role bypasses both.
revoke update on public.profiles from anon, authenticated;
grant  update (full_name) on public.profiles to authenticated;

-- ---------- 2. Drop public INSERT policies ----------
-- With RLS enabled and no INSERT policy, anon/authenticated inserts are denied.
-- The contact + newsletter server actions use the service-role client, which
-- bypasses RLS, so they keep working.
drop policy if exists leads_insert_anyone on public.leads;
drop policy if exists newsletter_insert_anyone on public.newsletter_subscribers;
