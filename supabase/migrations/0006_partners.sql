-- ============================================================================
-- 0006_partners.sql — Partners managed from the admin backoffice
-- ============================================================================
-- Table `partners` (logo + name + optional website + display order) with the
-- usual RLS (public read, admin write) and a public `partner-logos` bucket.
-- ============================================================================

-- ---------- TABLE ----------
create table if not exists partners (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  logo_url    text,
  website     text,
  sort_order  int not null default 0
);

create index if not exists partners_order_idx on partners (sort_order, created_at);

-- ---------- RLS ----------
alter table partners enable row level security;

drop policy if exists partners_select_public on partners;
create policy partners_select_public on partners
  for select to anon, authenticated
  using (true);

drop policy if exists partners_insert_admin on partners;
create policy partners_insert_admin on partners
  for insert to authenticated
  with check (is_admin());

drop policy if exists partners_update_admin on partners;
create policy partners_update_admin on partners
  for update to authenticated
  using (is_admin()) with check (is_admin());

drop policy if exists partners_delete_admin on partners;
create policy partners_delete_admin on partners
  for delete to authenticated
  using (is_admin());

-- ---------- STORAGE BUCKET ----------
insert into storage.buckets (id, name, public)
values ('partner-logos', 'partner-logos', true)
on conflict (id) do nothing;

drop policy if exists storage_partner_logos_select on storage.objects;
create policy storage_partner_logos_select on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'partner-logos');

drop policy if exists storage_partner_logos_insert on storage.objects;
create policy storage_partner_logos_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'partner-logos' and is_admin());

drop policy if exists storage_partner_logos_update on storage.objects;
create policy storage_partner_logos_update on storage.objects
  for update to authenticated
  using (bucket_id = 'partner-logos' and is_admin())
  with check (bucket_id = 'partner-logos' and is_admin());

drop policy if exists storage_partner_logos_delete on storage.objects;
create policy storage_partner_logos_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'partner-logos' and is_admin());
