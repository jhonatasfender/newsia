-- Schema: Initial news domain
-- Creates tables for categories and articles with public read RLS policies

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete set null,
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,
  image_url text,
  minutes integer,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.categories enable row level security;
alter table public.articles enable row level security;

-- Public read policies (anonymous allowed), no inserts/updates/deletes without auth
create policy "Public read categories" on public.categories for select to anon, authenticated using (true);
create policy "Public read articles" on public.articles for select to anon, authenticated using (true);

-- Helpful indexes
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_category on public.articles(category_id);
create index if not exists idx_articles_published_at on public.articles(published_at desc);

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_articles_set_updated_at on public.articles;
create trigger trg_articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();


