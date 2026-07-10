-- ============================================================================
-- 0010_chat_logs.sql — Journal des conversations du chatbot (supervision)
-- ============================================================================
-- Chaque ligne = un échange (question de l'utilisateur → réponse du bot).
-- Insertion faite côté serveur avec la clé service-role (bypass RLS).
-- Lecture réservée aux admins ; signalement (flag) par admin ; purge par superadmin.
-- ============================================================================

create table if not exists chat_logs (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  session_id  text,
  question    text not null,
  answer      text,
  model       text,
  flagged     boolean not null default false
);

create index if not exists chat_logs_created_idx on chat_logs (created_at desc);
create index if not exists chat_logs_session_idx on chat_logs (session_id);
create index if not exists chat_logs_flagged_idx on chat_logs (flagged) where flagged;

alter table chat_logs enable row level security;

-- Lecture : admins uniquement
drop policy if exists chat_logs_select on chat_logs;
create policy chat_logs_select on chat_logs
  for select to authenticated
  using (is_admin());

-- Signalement (flag) : admins uniquement
drop policy if exists chat_logs_update on chat_logs;
create policy chat_logs_update on chat_logs
  for update to authenticated
  using (is_admin())
  with check (is_admin());

-- Suppression : superadmin uniquement
drop policy if exists chat_logs_delete on chat_logs;
create policy chat_logs_delete on chat_logs
  for delete to authenticated
  using (is_superadmin());
