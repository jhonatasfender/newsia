-- Make articles.category_id nullable to align with ON DELETE SET NULL
alter table if exists public.articles
  alter column category_id drop not null;


