-- ============================================================================
-- 0003_storage.sql — Storage bucket for article cover images
-- ============================================================================

-- Public bucket (covers must be readable by anonymous visitors)
insert into storage.buckets (id, name, public)
values ('article-covers', 'article-covers', true)
on conflict (id) do nothing;

-- ---------- POLICIES ----------
-- Anyone can VIEW covers (bucket is public anyway, but explicit for clarity)
drop policy if exists storage_article_covers_select on storage.objects;
create policy storage_article_covers_select on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'article-covers');

-- Only admins can WRITE
drop policy if exists storage_article_covers_insert on storage.objects;
create policy storage_article_covers_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'article-covers' and is_admin());

drop policy if exists storage_article_covers_update on storage.objects;
create policy storage_article_covers_update on storage.objects
  for update to authenticated
  using (bucket_id = 'article-covers' and is_admin())
  with check (bucket_id = 'article-covers' and is_admin());

drop policy if exists storage_article_covers_delete on storage.objects;
create policy storage_article_covers_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'article-covers' and is_admin());
