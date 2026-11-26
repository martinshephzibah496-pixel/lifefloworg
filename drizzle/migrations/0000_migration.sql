create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- Admin allow-list (emails that become admin when they sign up)
create table public.admin_emails (email text primary key);
grant all on public.admin_emails to service_role;
alter table public.admin_emails enable row level security;
insert into public.admin_emails (email) values ('lifeflowdesk@gmail.com');

create or replace function public.handle_new_user_role()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if exists (select 1 from public.admin_emails where lower(email) = lower(new.email)) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created_role after insert on auth.users
  for each row execute function public.handle_new_user_role();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end $$;

-- Categories (shared by store and affiliate sections)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('store','affiliate')),
  name text not null,
  slug text not null,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  unique (kind, slug)
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "Anyone reads categories" on public.categories for select to anon, authenticated using (true);
create policy "Admins manage categories" on public.categories for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Digital products
create table public.store_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  description text not null default '',
  category text not null default 'Guides',
  price_minor integer not null default 0 check (price_minor >= 0),
  currency text not null default 'NGN',
  is_free boolean not null default false,
  cover_url text,
  pdf_path text,
  file_size_bytes bigint,
  page_count integer,
  download_info text not null default 'Instant PDF download after checkout.',
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.store_products to anon, authenticated;
grant insert, update, delete on public.store_products to authenticated;
grant all on public.store_products to service_role;
alter table public.store_products enable row level security;
create policy "Public reads published products" on public.store_products for select to anon, authenticated using (published = true);
create policy "Admins read all products" on public.store_products for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins insert products" on public.store_products for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "Admins update products" on public.store_products for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "Admins delete products" on public.store_products for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger store_products_touch before update on public.store_products for each row execute function public.touch_updated_at();

-- Affiliate products
create table public.affiliate_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  category text not null default 'Home essentials',
  price_label text,
  image_url text,
  affiliate_url text not null check (affiliate_url ~* '^https?://'),
  partner text,
  active boolean not null default true,
  featured boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.affiliate_products to anon, authenticated;
grant insert, update, delete on public.affiliate_products to authenticated;
grant all on public.affiliate_products to service_role;
alter table public.affiliate_products enable row level security;
create policy "Public reads active affiliates" on public.affiliate_products for select to anon, authenticated using (active = true);
create policy "Admins read all affiliates" on public.affiliate_products for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins insert affiliates" on public.affiliate_products for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "Admins update affiliates" on public.affiliate_products for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "Admins delete affiliates" on public.affiliate_products for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger affiliate_products_touch before update on public.affiliate_products for each row execute function public.touch_updated_at();

-- Orders (written only by server code)
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.store_products(id) on delete restrict,
  email text not null,
  amount_minor integer not null,
  currency text not null,
  provider text not null check (provider in ('paystack','flutterwave','free')),
  reference text not null unique,
  status text not null default 'pending' check (status in ('pending','paid','failed')),
  download_token uuid not null default gen_random_uuid(),
  provider_transaction_id text,
  checkout_url text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
grant select on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "Admins read orders" on public.orders for select to authenticated using (public.has_role(auth.uid(),'admin'));

insert into public.categories (kind, name, slug, sort) values
 ('store','PDF Guides','pdf-guides',1),('store','Homeownership Planners','homeownership-planners',2),
 ('store','Financial Worksheets','financial-worksheets',3),('store','Budget Templates','budget-templates',4),
 ('store','Property Investment','property-investment',5),('store','Homebuyer Checklists','homebuyer-checklists',6),
 ('store','Printable Planners','printable-planners',7),('store','Educational Resources','educational-resources',8),
 ('affiliate','Home buying','home-buying',1),('affiliate','Mortgage comparison','mortgage-comparison',2),
 ('affiliate','Moving companies','moving-companies',3),('affiliate','Storage solutions','storage-solutions',4),
 ('affiliate','Furniture','furniture',5),('affiliate','Home essentials','home-essentials',6),
 ('affiliate','Home insurance','home-insurance',7),('affiliate','Utilities and internet','utilities-internet',8);

-- Storage policies (buckets created separately)
create policy "Public reads store images" on storage.objects for select to anon, authenticated using (bucket_id = 'store-images');
create policy "Admins upload store images" on storage.objects for insert to authenticated with check (bucket_id = 'store-images' and public.has_role(auth.uid(),'admin'));
create policy "Admins update store images" on storage.objects for update to authenticated using (bucket_id = 'store-images' and public.has_role(auth.uid(),'admin'));
create policy "Admins delete store images" on storage.objects for delete to authenticated using (bucket_id = 'store-images' and public.has_role(auth.uid(),'admin'));
create policy "Admins read pdfs" on storage.objects for select to authenticated using (bucket_id = 'store-pdfs' and public.has_role(auth.uid(),'admin'));
create policy "Admins upload pdfs" on storage.objects for insert to authenticated with check (bucket_id = 'store-pdfs' and public.has_role(auth.uid(),'admin'));
create policy "Admins update pdfs" on storage.objects for update to authenticated using (bucket_id = 'store-pdfs' and public.has_role(auth.uid(),'admin'));
create policy "Admins delete pdfs" on storage.objects for delete to authenticated using (bucket_id = 'store-pdfs' and public.has_role(auth.uid(),'admin'));
