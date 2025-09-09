-- Allow authenticated users to update articles (admin can be enforced later via roles/claims)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'articles'
      and policyname = 'Authenticated update articles'
  ) then
    create policy "Authenticated update articles"
      on public.articles
      for update
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;


