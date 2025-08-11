-- Enums
create type user_role as enum ('customer','pro','admin');
create type kyc_status as enum ('pending','verified','rejected');
create type assign_status as enum ('pending','assigned','reassigned');
create type booking_status as enum ('booked','in_progress','completed','canceled');
create type tx_status as enum ('succeeded','pending','refunded');
create type capture_mode as enum ('automatic','manual');

-- Users
create table if not exists users (
  id uuid primary key,
  role user_role not null default 'customer',
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  user_id uuid primary key references users(id) on delete cascade,
  display_name text,
  photo_url text,
  bio text,
  language_pref text default 'en',
  verified boolean default false,
  rating_avg numeric,
  rating_count int
);

-- Pros & Services
create table if not exists pros (
  user_id uuid primary key references users(id) on delete cascade,
  business_name text,
  rfc text,
  stripe_account_id text,
  kyc_status kyc_status default 'pending',
  service_radius_km int,
  base_city text default 'CDMX'
);

create table if not exists categories (
  id bigserial primary key,
  parent_id bigint references categories(id),
  slug text unique not null,
  name_en text not null,
  name_es text not null
);

create type assign_strategy as enum ('nearest','top_rated','round_robin');

create table if not exists services (
  id bigserial primary key,
  category_id bigint references categories(id) on delete set null,
  title_en text not null,
  title_es text not null,
  description_en text,
  description_es text,
  photos text[],
  fixed_base_price numeric not null,
  fixed_duration_minutes int not null,
  included_scope_en text,
  included_scope_es text,
  max_area_sq_m int,
  instant_book_enabled boolean default true,
  auto_assign_strategy assign_strategy default 'nearest'
);

create table if not exists service_addons (
  id bigserial primary key,
  service_id bigint references services(id) on delete cascade,
  name_en text not null,
  name_es text not null,
  description_en text,
  description_es text,
  price_delta numeric not null default 0,
  duration_delta_minutes int not null default 0,
  max_qty int,
  is_required boolean default false
);

create table if not exists service_regions (
  id bigserial primary key,
  service_id bigint references services(id) on delete cascade,
  alcaldia text not null,
  price_modifier_percent numeric default 0
);

-- Addresses
create table if not exists addresses (
  id bigserial primary key,
  user_id uuid references users(id) on delete cascade,
  label text,
  street text,
  colonia text,
  alcaldia text,
  city text,
  state text,
  postal_code text,
  lat double precision,
  lng double precision,
  is_primary boolean
);

-- Bookings & Transactions
create table if not exists bookings (
  id bigserial primary key,
  service_id bigint references services(id),
  customer_id uuid references users(id),
  assigned_pro_id uuid references users(id),
  fixed_price_total numeric,
  addons jsonb,
  sla_window_start timestamptz,
  sla_window_end timestamptz,
  assignment_status assign_status default 'pending',
  status booking_status default 'booked'
);

-- Basic RLS enabling
alter table users enable row level security;
alter table profiles enable row level security;
alter table bookings enable row level security;

-- NOTE: These assume auth.uid() == users.id
create policy if not exists "users self" on users
  for select using (id = auth.uid());
create policy if not exists "profiles self" on profiles
  for select using (user_id = auth.uid());
create policy if not exists "bookings owner select" on bookings
  for select using (customer_id = auth.uid() or assigned_pro_id = auth.uid());
create policy if not exists "bookings insert by customer" on bookings
  for insert with check (customer_id = auth.uid());

-- Indexes for common lookups
create index if not exists idx_bookings_customer on bookings(customer_id);
create index if not exists idx_bookings_service on bookings(service_id);
create index if not exists idx_availability_pro on availability_blocks(pro_id, starts_at, ends_at);

create table if not exists transactions (
  id bigserial primary key,
  booking_id bigint references bookings(id) on delete cascade,
  stripe_payment_intent_id text,
  amount_total numeric,
  platform_fee numeric,
  status tx_status,
  capture_mode capture_mode,
  hold_expires_at timestamptz
);

create table if not exists payouts (
  id bigserial primary key,
  pro_id uuid references users(id),
  stripe_transfer_id text,
  amount numeric,
  status text
);

-- Availability
create table if not exists availability_blocks (
  id bigserial primary key,
  pro_id uuid references users(id) on delete cascade,
  starts_at timestamptz,
  ends_at timestamptz,
  capacity int default 1,
  service_id bigint references services(id)
);

-- Sample seed data for CDMX services (trimmed for brevity)
insert into categories (slug, name_en, name_es) values
  ('cleaning','Cleaning','Limpieza'),
  ('plumbing','Plumbing','Plomería'),
  ('electrical','Electrical','Electricidad'),
  ('handyman','Handyman','Manitas')
  on conflict do nothing;

-- Minimal services seed
insert into services (category_id, title_en, title_es, description_en, description_es, fixed_base_price, fixed_duration_minutes, instant_book_enabled)
select c.id, s.title_en, s.title_es, s.description_en, s.description_es, s.fixed_base_price, s.fixed_duration_minutes, true
from (
  values
    ('cleaning','Basic Cleaning (2 hrs)','Limpieza básica (2 h)', 'Two-hour cleaning', 'Limpieza de dos horas', 9000, 120),
    ('plumbing','Faucet Replacement','Cambio de grifo', 'Replace a faucet', 'Reemplazar un grifo', 12000, 60)
) as s(category_slug, title_en, title_es, description_en, description_es, fixed_base_price, fixed_duration_minutes)
join categories c on c.slug = s.category_slug
on conflict do nothing;



-- Messaging & Reviews
create table if not exists conversations (
  id bigserial primary key,
  booking_id bigint references bookings(id) on delete cascade
);

create table if not exists messages (
  id bigserial primary key,
  conversation_id bigint references conversations(id) on delete cascade,
  sender_id uuid references users(id),
  body text,
  attachments text[],
  created_at timestamptz default now()
);

create table if not exists reviews (
  id bigserial primary key,
  booking_id bigint references bookings(id) on delete set null,
  rater_id uuid references users(id),
  ratee_id uuid references users(id),
  stars int check (stars between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- Notifications & Disputes
create table if not exists notifications (
  id bigserial primary key,
  user_id uuid references users(id),
  type text,
  payload jsonb,
  read_at timestamptz
);

create table if not exists disputes (
  id bigserial primary key,
  booking_id bigint references bookings(id),
  opener_id uuid references users(id),
  reason text,
  details text,
  status text default 'open'
);


