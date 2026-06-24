-- ============================================================================
-- 0004_video.sql — Video support for news articles
-- ============================================================================
-- Adds two optional video sources to news_articles:
--   • video_embed_url : external player URL (YouTube / Vimeo) → rendered as iframe
--   • video_url       : self-hosted file in the `article-videos` bucket → <video>
-- Plus a public storage bucket for uploaded videos (admin-only writes).
-- ============================================================================

-- ---------- COLUMNS ----------
alter table news_articles
  add column if not exists video_embed_url text,
  add column if not exists video_url       text;

-- ---------- STORAGE BUCKET ----------
-- Public bucket (videos must be readable by anonymous visitors)
insert into storage.buckets (id, name, public)
values ('article-videos', 'article-videos', true)
on conflict (id) do nothing;

-- ---------- POLICIES ----------
-- Anyone can VIEW videos
drop policy if exists storage_article_videos_select on storage.objects;
create policy storage_article_videos_select on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'article-videos');

-- Only admins can WRITE
drop policy if exists storage_article_videos_insert on storage.objects;
create policy storage_article_videos_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'article-videos' and is_admin());

drop policy if exists storage_article_videos_update on storage.objects;
create policy storage_article_videos_update on storage.objects
  for update to authenticated
  using (bucket_id = 'article-videos' and is_admin())
  with check (bucket_id = 'article-videos' and is_admin());

drop policy if exists storage_article_videos_delete on storage.objects;
create policy storage_article_videos_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'article-videos' and is_admin());
