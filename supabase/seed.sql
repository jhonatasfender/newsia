-- Seed: fixed auth user and sample news data

-- Try to create a fixed user. On cloud, this helper may be unavailable.
do $$
begin
  begin
    perform auth.create_user(
      email := 'jhonatas.fender@gmail.com',
      password := '123456',
      email_confirm := true
    );
  exception
    when undefined_function then
      raise notice 'auth.create_user not available; skipping user creation on this environment';
    when others then
      raise notice 'auth.create_user failed: %', SQLERRM;
  end;
end $$;

-- Upsert sample categories
insert into public.categories (slug, title)
values
  ('tecnologia', 'Tecnologia')
, ('emprego', 'Emprego')
, ('sociedade', 'Sociedade')
on conflict (slug) do update set title = excluded.title;

-- Upsert sample articles
with cat as (
  select id, slug from public.categories
)
insert into public.articles (category_id, slug, title, excerpt, body, image_url, minutes, published_at)
values
  ((select id from cat where slug = 'tecnologia'),
   'ia-transforma-industria',
   'IA que transforma a indústria',
   'Como modelos avançados estão redesenhando processos produtivos.',
   'Corpo do artigo de demonstração. Conteúdo exemplo para desenvolvimento.',
   'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
   5,
   now()
  ),
  ((select id from cat where slug = 'sociedade'),
   'impactos-sociais-da-ia',
   'Impactos sociais da IA',
   'Os efeitos da automação no mercado de trabalho e na cultura.',
   'Outro artigo de exemplo para popular listagens durante o desenvolvimento.',
   'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
   7,
   now()
  )
on conflict (slug) do update set
  category_id = excluded.category_id,
  title = excluded.title,
  excerpt = excluded.excerpt,
  body = excluded.body,
  image_url = excluded.image_url,
  minutes = excluded.minutes,
  published_at = excluded.published_at;


