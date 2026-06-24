-- ============================================================================
-- 0008_superadmin.sql — Superadmin role
-- ============================================================================
-- Adds a `is_superadmin` flag on top of `is_admin`. A superadmin is also an
-- admin (full content access) PLUS the only role allowed to manage user
-- accounts (create / promote / demote / delete admins) — enforced in the
-- server actions, which verify is_superadmin before using the service-role key.
--
-- NOTE: a superadmin account must exist in Auth first. Create the user in
-- Supabase → Authentication → Users (or via the superadmin UI once you have
-- one), then this promote runs. Re-run the UPDATE below if the account is
-- created after applying this migration.
-- ============================================================================

alter table profiles
  add column if not exists is_superadmin boolean not null default false;

-- Helper mirroring is_admin().
create or replace function is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_superadmin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Promote the owner account (superadmin implies admin).
update profiles
   set is_admin = true,
       is_superadmin = true
 where email = 'saidouhw02@gmail.com';

-- Keep the is_admin column lock from 0007 intact: clients still may only
-- write full_name. is_superadmin therefore can only be set via service-role.
