-- ============================================================================
-- 0001_init.sql — Sirius Assurances schema
-- ============================================================================
-- Tables: leads, newsletter_subscribers, news_articles, profiles
-- Triggers: auto-update updated_at, auto-create profile on signup
-- ============================================================================

-- Required extensions
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------- ENUMS ----------
do $$ begin
  create type lead_status as enum ('new', 'contacted', 'qualified', 'converted', 'lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type insurance_type as enum (
    'auto_habitation',
    'sante_vie',
    'multirisque_pro',
    'construction',
    'autre'
  );
exception when duplicate_object then null; end $$;

-- ---------- LEADS ----------
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  phone         text,
  insurance_type insurance_type,
  message       text not null,
  status        lead_status not null default 'new',
  notes         text,
  ip_address    text,
  user_agent    text
);

create index if not exists leads_status_idx     on leads (status);
create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_email_idx      on leads (email);

-- ---------- NEWSLETTER ----------
create table if not exists newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  email           text not null unique,
  status          text not null default 'active' check (status in ('active','unsubscribed')),
  unsubscribed_at timestamptz
);

create index if not exists newsletter_status_idx on newsletter_subscribers (status);

-- ---------- NEWS ARTICLES ----------
create table if not exists news_articles (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  content       text, -- markdown
  cover_url     text,
  tag           text,
  published     boolean not null default false,
  published_at  timestamptz,
  author_id     uuid references auth.users (id) on delete set null
);

create index if not exists news_published_idx on news_articles (published, published_at desc);
create index if not exists news_slug_idx      on news_articles (slug);

-- ---------- PROFILES (admin flag) ----------
create table if not exists profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------- TRIGGERS ----------

-- Auto-update `updated_at`
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_leads_updated_at on leads;
create trigger trg_leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

drop trigger if exists trg_news_updated_at on news_articles;
create trigger trg_news_updated_at
  before update on news_articles
  for each row execute function set_updated_at();

-- Auto-create profile row when a new auth user is created
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
