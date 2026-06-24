-- ============================================================================
-- 0005_newsletter_unsubscribe.sql — Unsubscribe tokens for newsletter
-- ============================================================================
-- Adds a per-subscriber unguessable token used in unsubscribe links
-- (/newsletter/unsubscribe?token=...). Existing rows are backfilled by the
-- column default.
-- ============================================================================

alter table newsletter_subscribers
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid();

create unique index if not exists newsletter_unsubscribe_token_idx
  on newsletter_subscribers (unsubscribe_token);
