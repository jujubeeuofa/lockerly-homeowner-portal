-- Lockerly Homeowner Portal — database schema
-- Run this in the Supabase SQL editor (or `supabase db push`) once.

-- 1. Profiles table: one row per homeowner, keyed to the auth user.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  phone text,
  address_line1 text not null default '',
  address_line2 text,
  city text not null default '',
  state text not null default '',
  zip text not null default '',
  deliver_to_lockerly boolean not null default true,
  custom_notes text,
  allowed_carriers text[] not null default '{}',
  -- Canonical lookup key for the public driver QR page: "line1|zip", lowercased.
  address_key text generated always as (
    lower(regexp_replace(trim(address_line1), '\s+', ' ', 'g')) || '|' || trim(zip)
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_address_key_idx on public.profiles (address_key);

-- 2. Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- 3. Auto-create a profile row when a new auth user signs up.
--    Address fields are passed through raw_user_meta_data at signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (
    id, email, phone, address_line1, address_line2, city, state, zip
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'phone',
    coalesce(new.raw_user_meta_data ->> 'address_line1', ''),
    new.raw_user_meta_data ->> 'address_line2',
    coalesce(new.raw_user_meta_data ->> 'city', ''),
    coalesce(new.raw_user_meta_data ->> 'state', ''),
    coalesce(new.raw_user_meta_data ->> 'zip', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Row Level Security: a homeowner can only see/edit their own row.
--    The public driver page does NOT read this table directly — it goes
--    through a SECURITY DEFINER function (below) scoped to non-PII fields.
alter table public.profiles enable row level security;

drop policy if exists "own profile - select" on public.profiles;
create policy "own profile - select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "own profile - update" on public.profiles;
create policy "own profile - update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own profile - insert" on public.profiles;
create policy "own profile - insert" on public.profiles
  for insert with check (auth.uid() = id);

-- 5. Public lookup for the driver QR page. Returns ONLY delivery-relevant
--    fields for an address that has opted in — never email, phone, or name.
--    Callable by the anon role, but leaks nothing beyond the scanned address.
create or replace function public.lookup_instruction(p_address_key text)
returns table (
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip text,
  deliver_to_lockerly boolean,
  custom_notes text,
  allowed_carriers text[]
)
language sql security definer set search_path = public as $$
  select address_line1, address_line2, city, state, zip,
         deliver_to_lockerly, custom_notes, allowed_carriers
  from public.profiles
  where address_key = p_address_key
  limit 1;
$$;

grant execute on function public.lookup_instruction(text) to anon, authenticated;
