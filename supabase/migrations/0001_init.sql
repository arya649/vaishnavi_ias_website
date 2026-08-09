-- ============================================================================
-- Vaishnavi IAS Academy / reusable coaching-site CMS schema
-- Multi-tenant-ready: every content table carries site_id, even though only
-- one site is seeded today. See docs/CMS-AND-REUSE-GUIDE.md for the model.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tenancy
-- ---------------------------------------------------------------------------
create table sites (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  domain      text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table site_branding (
  site_id           uuid primary key references sites(id) on delete cascade,
  tagline           text,
  logo_url          text,
  favicon_url       text,
  primary_color     text not null default '#0B1F4D',
  accent_color      text not null default '#C9A227',
  contact_phone     text,
  contact_email     text,
  contact_address   text,
  social_links      jsonb not null default '{}'::jsonb,
  seo_default_title text,
  seo_default_desc  text,
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Generic page/section content model
-- ---------------------------------------------------------------------------
create table pages (
  id                uuid primary key default gen_random_uuid(),
  site_id           uuid not null references sites(id) on delete cascade,
  slug              text not null,
  title             text not null,
  meta_title        text,
  meta_description  text,
  is_published      boolean not null default true,
  created_at        timestamptz not null default now(),
  unique (site_id, slug)
);

create table sections (
  id          uuid primary key default gen_random_uuid(),
  page_id     uuid not null references pages(id) on delete cascade,
  type        text not null,
  position    integer not null default 0,
  content     jsonb not null default '{}'::jsonb,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now()
);
create index sections_page_position_idx on sections (page_id, position);

-- ---------------------------------------------------------------------------
-- Dedicated content tables
-- ---------------------------------------------------------------------------
create table courses (
  id              uuid primary key default gen_random_uuid(),
  site_id         uuid not null references sites(id) on delete cascade,
  track           text not null check (track in ('classes','mentorship')),
  name            text not null,
  duration_label  text,
  price_paise     integer,
  is_price_tbd    boolean not null default false,
  description     text,
  position        integer not null default 0,
  is_active       boolean not null default true
);

create table test_series_categories (
  id                uuid primary key default gen_random_uuid(),
  site_id           uuid not null references sites(id) on delete cascade,
  name              text not null,
  slug              text not null,
  summary           text,
  details_markdown  text,
  icon_url          text,
  position          integer not null default 0,
  is_active         boolean not null default true,
  unique (site_id, slug)
);

create table pricing_plans (
  id                      uuid primary key default gen_random_uuid(),
  site_id                 uuid not null references sites(id) on delete cascade,
  category                text not null check (category in ('test_series','classes','mentorship')),
  name                    text not null,
  description             text,
  price_paise             integer,
  unit_label              text,
  is_price_tbd            boolean not null default false,
  supports_installments   boolean not null default false,
  position                integer not null default 0,
  is_active               boolean not null default true
);

create table testimonials (
  id            uuid primary key default gen_random_uuid(),
  site_id       uuid not null references sites(id) on delete cascade,
  student_name  text not null,
  photo_url     text,
  rank_or_batch text,
  quote         text not null,
  video_url     text,
  position      integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

create table current_affairs_posts (
  id            uuid primary key default gen_random_uuid(),
  site_id       uuid not null references sites(id) on delete cascade,
  title         text not null,
  slug          text not null,
  body_markdown text not null,
  youtube_url   text,
  thumbnail_url text,
  post_date     date not null default current_date,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (site_id, slug)
);

create table faq_items (
  id              uuid primary key default gen_random_uuid(),
  site_id         uuid not null references sites(id) on delete cascade,
  question        text not null,
  answer_markdown text not null,
  category        text,
  position        integer not null default 0,
  is_published    boolean not null default true
);

create table resources (
  id            uuid primary key default gen_random_uuid(),
  site_id       uuid not null references sites(id) on delete cascade,
  title         text not null,
  file_url      text not null,
  category      text,
  position      integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

create table nav_items (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references sites(id) on delete cascade,
  label       text not null,
  href        text not null,
  position    integer not null default 0,
  is_visible  boolean not null default true,
  parent_id   uuid references nav_items(id) on delete cascade
);

create table enquiries (
  id                  uuid primary key default gen_random_uuid(),
  site_id             uuid not null references sites(id) on delete cascade,
  name                text not null,
  phone               text not null,
  email               text,
  message             text,
  interested_in       text,
  source_page         text,
  installment_access  boolean not null default false,
  status              text not null default 'new' check (status in ('new','contacted','converted','closed')),
  created_at          timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table sites enable row level security;
alter table site_branding enable row level security;
alter table pages enable row level security;
alter table sections enable row level security;
alter table courses enable row level security;
alter table test_series_categories enable row level security;
alter table pricing_plans enable row level security;
alter table testimonials enable row level security;
alter table current_affairs_posts enable row level security;
alter table faq_items enable row level security;
alter table resources enable row level security;
alter table nav_items enable row level security;
alter table enquiries enable row level security;

-- sites / site_branding: public read of active sites, admin write
create policy "public read active sites" on sites for select using (is_active = true);
create policy "admin full access sites" on sites for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read branding" on site_branding for select using (true);
create policy "admin full access branding" on site_branding for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read published pages" on pages for select using (is_published = true);
create policy "admin full access pages" on pages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read visible sections" on sections for select using (is_visible = true);
create policy "admin full access sections" on sections for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read active courses" on courses for select using (is_active = true);
create policy "admin full access courses" on courses for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read active test series categories" on test_series_categories for select using (is_active = true);
create policy "admin full access test series categories" on test_series_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read active pricing plans" on pricing_plans for select using (is_active = true);
create policy "admin full access pricing plans" on pricing_plans for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read published testimonials" on testimonials for select using (is_published = true);
create policy "admin full access testimonials" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read published current affairs" on current_affairs_posts for select using (is_published = true);
create policy "admin full access current affairs" on current_affairs_posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read published faq" on faq_items for select using (is_published = true);
create policy "admin full access faq" on faq_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read published resources" on resources for select using (is_published = true);
create policy "admin full access resources" on resources for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read visible nav items" on nav_items for select using (is_visible = true);
create policy "admin full access nav items" on nav_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- enquiries: public can only insert (submit the contact form); only admin can read/update/delete
create policy "public can submit enquiries" on enquiries for insert with check (true);
create policy "admin read enquiries" on enquiries for select using (auth.role() = 'authenticated');
create policy "admin update enquiries" on enquiries for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin delete enquiries" on enquiries for delete using (auth.role() = 'authenticated');

-- ============================================================================
-- Storage buckets
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('resources', 'resources', true)
on conflict (id) do nothing;

create policy "public read public-assets"
on storage.objects for select
using (bucket_id = 'public-assets');

create policy "admin write public-assets"
on storage.objects for insert
with check (bucket_id = 'public-assets' and auth.role() = 'authenticated');

create policy "admin update public-assets"
on storage.objects for update
using (bucket_id = 'public-assets' and auth.role() = 'authenticated');

create policy "admin delete public-assets"
on storage.objects for delete
using (bucket_id = 'public-assets' and auth.role() = 'authenticated');

create policy "public read resources bucket"
on storage.objects for select
using (bucket_id = 'resources');

create policy "admin write resources bucket"
on storage.objects for insert
with check (bucket_id = 'resources' and auth.role() = 'authenticated');

create policy "admin update resources bucket"
on storage.objects for update
using (bucket_id = 'resources' and auth.role() = 'authenticated');

create policy "admin delete resources bucket"
on storage.objects for delete
using (bucket_id = 'resources' and auth.role() = 'authenticated');
