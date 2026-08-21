create type public.app_role as enum ('admin', 'editor', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can read their own roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

create policy "Admins manage roles"
on public.user_roles for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.claim_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    return false;
  end if;
  if exists (select 1 from public.user_roles where role = 'admin') then
    return public.has_role(uid, 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (uid, 'admin')
  on conflict do nothing;
  return true;
end;
$$;

grant execute on function public.claim_admin() to authenticated;

create table public.site_content (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid
);

grant select on public.site_content to anon;
grant select, insert, update on public.site_content to authenticated;
grant all on public.site_content to service_role;
alter table public.site_content enable row level security;

create policy "Anyone can read site content"
on public.site_content for select to anon, authenticated
using (true);

create policy "Admins can insert site content"
on public.site_content for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update site content"
on public.site_content for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

insert into public.site_content (id, data) values ('main', '{}'::jsonb)
on conflict (id) do nothing;

create policy "Admins can view site media"
on storage.objects for select to authenticated
using (bucket_id = 'site-media' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can upload site media"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-media' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update site media"
on storage.objects for update to authenticated
using (bucket_id = 'site-media' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'site-media' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete site media"
on storage.objects for delete to authenticated
using (bucket_id = 'site-media' and public.has_role(auth.uid(), 'admin'));