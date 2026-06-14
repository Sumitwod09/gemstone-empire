-- ============================================================
-- Gemstone Empire — Initial Schema Migration
-- Run this in your Supabase SQL editor (Settings > SQL Editor)
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── profiles ────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '',
  phone      text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── addresses ───────────────────────────────────────────────
create table if not exists public.addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  label      text not null default 'home',
  full_name  text not null,
  phone      text,
  line1      text not null,
  line2      text,
  city       text not null,
  state      text not null,
  country    text not null,
  zip        text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── categories ──────────────────────────────────────────────
create table if not exists public.categories (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  description      text,
  image_url        text,
  parent_id        uuid references public.categories(id) on delete set null,
  sort_order       int not null default 0,
  is_active        boolean not null default true,
  meta_title       text,
  meta_description text,
  created_at       timestamptz not null default now()
);

create index if not exists categories_slug_idx on public.categories(slug);
create index if not exists categories_active_idx on public.categories(is_active);

-- ─── products ────────────────────────────────────────────────
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  description      text,
  category_id      uuid not null references public.categories(id) on delete restrict,
  is_active        boolean not null default true,
  is_featured      boolean not null default false,
  meta_title       text,
  meta_description text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_active_idx on public.products(is_active);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_featured_idx on public.products(is_featured);

-- ─── gem_variants ────────────────────────────────────────────
create table if not exists public.gem_variants (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references public.products(id) on delete cascade,
  sku              text not null unique,
  price            numeric(10,2) not null,
  compare_at_price numeric(10,2),
  stock_qty        int not null default 1,
  shape            text not null,
  carat_weight     numeric(6,3) not null,
  length_mm        numeric(6,2),
  width_mm         numeric(6,2),
  depth_mm         numeric(6,2),
  color            text not null,
  color_grade      text,
  clarity          text,
  treatment        text,
  origin           text,
  cut_grade        text,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

create index if not exists variants_product_idx on public.gem_variants(product_id);
create index if not exists variants_active_idx on public.gem_variants(is_active);
create index if not exists variants_stock_idx on public.gem_variants(stock_qty);

-- ─── gem_images ──────────────────────────────────────────────
create table if not exists public.gem_images (
  id         uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.gem_variants(id) on delete cascade,
  url        text not null,
  alt_text   text,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists images_variant_idx on public.gem_images(variant_id);

-- ─── cart_items ──────────────────────────────────────────────
create table if not exists public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete cascade,
  session_id text,
  variant_id uuid not null references public.gem_variants(id) on delete cascade,
  quantity   int not null default 1,
  created_at timestamptz not null default now(),
  constraint cart_user_or_session check (user_id is not null or session_id is not null)
);

-- ─── orders ──────────────────────────────────────────────────
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  order_number        text not null unique,
  user_id             uuid references public.profiles(id) on delete set null,
  status              text not null default 'pending'
                        check (status in ('pending','processing','shipped','delivered','cancelled','refunded')),
  subtotal            numeric(10,2) not null,
  shipping_cost       numeric(10,2) not null default 0,
  total               numeric(10,2) not null,
  currency            text not null default 'USD',
  razorpay_order_id   text,
  razorpay_payment_id text,
  payment_status      text not null default 'pending'
                        check (payment_status in ('pending','paid','failed','refunded')),
  shipping_address    jsonb not null,
  notes               text,
  shipped_at          timestamptz,
  delivered_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- ─── order_items ─────────────────────────────────────────────
create table if not exists public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  variant_id       uuid references public.gem_variants(id) on delete set null,
  product_name     text not null,
  variant_sku      text not null,
  variant_snapshot jsonb not null,
  quantity         int not null default 1,
  unit_price       numeric(10,2) not null,
  total_price      numeric(10,2) not null
);

create index if not exists order_items_order_idx on public.order_items(order_id);

-- ─── contact_submissions ─────────────────────────────────────
create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  email      text not null,
  phone      text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ─── Stock decrement RPC ─────────────────────────────────────
create or replace function public.decrement_stock(variant_id uuid, qty int)
returns void
language plpgsql
security definer
as $$
begin
  update public.gem_variants
  set stock_qty = greatest(0, stock_qty - qty)
  where id = variant_id;
end;
$$;

-- ============================================================
-- Row Level Security
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles          enable row level security;
alter table public.addresses         enable row level security;
alter table public.categories        enable row level security;
alter table public.products          enable row level security;
alter table public.gem_variants      enable row level security;
alter table public.gem_images        enable row level security;
alter table public.cart_items        enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.contact_submissions enable row level security;

-- Helper: is current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- ─── profiles policies ───────────────────────────────────────
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Service role insert profile"
  on public.profiles for insert
  with check (true);

-- ─── addresses policies ──────────────────────────────────────
create policy "Users CRUD own addresses"
  on public.addresses for all
  using (auth.uid() = user_id);

-- ─── categories policies ─────────────────────────────────────
create policy "Public read active categories"
  on public.categories for select
  using (is_active = true or public.is_admin());

create policy "Admin write categories"
  on public.categories for all
  using (public.is_admin());

-- ─── products policies ───────────────────────────────────────
create policy "Public read active products"
  on public.products for select
  using (is_active = true or public.is_admin());

create policy "Admin write products"
  on public.products for all
  using (public.is_admin());

-- ─── gem_variants policies ───────────────────────────────────
create policy "Public read active variants"
  on public.gem_variants for select
  using (is_active = true or public.is_admin());

create policy "Admin write variants"
  on public.gem_variants for all
  using (public.is_admin());

-- ─── gem_images policies ─────────────────────────────────────
create policy "Public read images"
  on public.gem_images for select
  using (true);

create policy "Admin write images"
  on public.gem_images for all
  using (public.is_admin());

-- ─── cart_items policies ─────────────────────────────────────
create policy "Users manage own cart"
  on public.cart_items for all
  using (auth.uid() = user_id or session_id is not null);

-- ─── orders policies ─────────────────────────────────────────
create policy "Users read own orders"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users create orders"
  on public.orders for insert
  with check (true);

create policy "Admin update orders"
  on public.orders for update
  using (public.is_admin());

-- ─── order_items policies ────────────────────────────────────
create policy "Users read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and (orders.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Insert order items"
  on public.order_items for insert
  with check (true);

-- ─── contact_submissions policies ────────────────────────────
create policy "Anyone can insert contact"
  on public.contact_submissions for insert
  with check (true);

create policy "Admin reads contact"
  on public.contact_submissions for select
  using (public.is_admin());

-- ============================================================
-- Storage
-- ============================================================

-- Create public bucket for gem images
insert into storage.buckets (id, name, public)
values ('gem-images', 'gem-images', true)
on conflict (id) do nothing;

create policy "Public read gem images"
  on storage.objects for select
  using (bucket_id = 'gem-images');

create policy "Admin upload gem images"
  on storage.objects for insert
  using (bucket_id = 'gem-images' and public.is_admin());

create policy "Admin delete gem images"
  on storage.objects for delete
  using (bucket_id = 'gem-images' and public.is_admin());

-- ============================================================
-- Sample seed data (optional — remove if not needed)
-- ============================================================

insert into public.categories (name, slug, description, sort_order, is_active)
values
  ('Ruby',       'ruby',       'Natural rubies from Burma, Mozambique, and Sri Lanka', 1, true),
  ('Sapphire',   'sapphire',   'Blue, pink, and fancy sapphires from Ceylon and Kashmir', 2, true),
  ('Emerald',    'emerald',    'Colombian and Zambian emeralds', 3, true),
  ('Alexandrite','alexandrite','Color-change alexandrite from Brazil and Russia', 4, true),
  ('Tourmaline', 'tourmaline', 'Paraiba, rubellite, and chrome tourmalines', 5, true),
  ('Spinel',     'spinel',     'Burmese and Tanzanian spinels', 6, true)
on conflict (slug) do nothing;
