-- ============================================================================
-- 0002_rls.sql — Row Level Security
-- ============================================================================
-- - Anon can INSERT into leads + newsletter_subscribers
-- - Anon can SELECT only published news_articles
-- - Admins (profiles.is_admin = true) have full access
-- ============================================================================

alter table leads                   enable row level security;
alter table newsletter_subscribers  enable row level security;
alter table news_articles           enable row level security;
alter table profiles                enable row level security;

-- ---------- HELPER: is current user admin? ----------
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ---------- LEADS ----------
drop policy if exists leads_insert_anyone on leads;
create policy leads_insert_anyone on leads
  for insert to anon, authenticated
  with check (true);

drop policy if exists leads_select_admin on leads;
create policy leads_select_admin on leads
  for select to authenticated
  using (is_admin());

drop policy if exists leads_update_admin on leads;
create policy leads_update_admin on leads
  for update to authenticated
  using (is_admin()) with check (is_admin());

drop policy if exists leads_delete_admin on leads;
create policy leads_delete_admin on leads
  for delete to authenticated
  using (is_admin());

-- ---------- NEWSLETTER ----------
drop policy if exists newsletter_insert_anyone on newsletter_subscribers;
create policy newsletter_insert_anyone on newsletter_subscribers
  for insert to anon, authenticated
  with check (true);

drop policy if exists newsletter_select_admin on newsletter_subscribers;
create policy newsletter_select_admin on newsletter_subscribers
  for select to authenticated
  using (is_admin());

drop policy if exists newsletter_update_admin on newsletter_subscribers;
create policy newsletter_update_admin on newsletter_subscribers
  for update to authenticated
  using (is_admin()) with check (is_admin());

drop policy if exists newsletter_delete_admin on newsletter_subscribers;
create policy newsletter_delete_admin on newsletter_subscribers
  for delete to authenticated
  using (is_admin());

-- ---------- NEWS ARTICLES ----------
-- Public: only published articles
drop policy if exists news_select_public on news_articles;
create policy news_select_public on news_articles
  for select to anon, authenticated
  using (published = true or is_admin());

drop policy if exists news_insert_admin on news_articles;
create policy news_insert_admin on news_articles
  for insert to authenticated
  with check (is_admin());

drop policy if exists news_update_admin on news_articles;
create policy news_update_admin on news_articles
  for update to authenticated
  using (is_admin()) with check (is_admin());

drop policy if exists news_delete_admin on news_articles;
create policy news_delete_admin on news_articles
  for delete to authenticated
  using (is_admin());

-- ---------- PROFILES ----------
drop policy if exists profiles_select_self_or_admin on profiles;
create policy profiles_select_self_or_admin on profiles
  for select to authenticated
  using (auth.uid() = id or is_admin());

drop policy if exists profiles_update_self on profiles;
create policy profiles_update_self on profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Note: profiles.is_admin can only be set via service_role key (server-side).
-- See README for how to promote a user to admin.
