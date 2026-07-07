-- ============================================================================
-- 0009_publish_guard.sql — Seul un superadmin peut publier un article
-- ============================================================================
-- Workflow brouillon / publié :
--   • Les managers (is_admin) créent et éditent des articles, mais ceux-ci
--     restent TOUJOURS en brouillon (published = false).
--   • Seul un superadmin (is_superadmin) peut publier (published = true).
--
-- Ce garde-fou est appliqué au niveau BASE (trigger), en plus du contrôle
-- côté server actions, pour qu'un manager ne puisse jamais publier même en
-- contournant l'interface (appel API direct).
-- ============================================================================

create or replace function enforce_publish_permission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Si l'article passe/reste publié mais que l'appelant n'est pas superadmin,
  -- on le force en brouillon.
  if new.published is true and not is_superadmin() then
    new.published := false;
    new.published_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_publish on news_articles;
create trigger trg_enforce_publish
  before insert or update on news_articles
  for each row
  execute function enforce_publish_permission();
