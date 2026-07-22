-- ============================================================================
-- Zambia Tungsten Assay OS — Supabase schema
-- Run this once in your Supabase project: SQL Editor ▸ paste ▸ Run.
-- It creates the readings table, a profiles/roles table, and the row-level
-- security (RLS) that controls who can read, add, edit and delete data.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES — one row per user, carrying their role
--    Roles:  capturer  = add/edit their own readings
--            geologist = add/edit any reading
--            manager   = add/edit/delete any reading + admin
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'capturer'
             check (role in ('capturer','geologist','manager')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Everyone signed in can see who's who; only the person (or a manager) can edit.
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles
  for select using (auth.role() = 'authenticated');

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile the moment a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: current user's role (used by the readings policies below)
create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- 2. READINGS — one row per XRF reading
--    elements is a JSONB map { "W": {"v":6.04,"e":0.079}, ... }
--    w_pct / wo3_pct are stored generated-style for fast dashboard queries.
-- ---------------------------------------------------------------------------
create table if not exists public.readings (
  id          uuid primary key default gen_random_uuid(),
  reading_no  text,
  sample_id   text not null,
  site        text,
  feature     text,
  from_m      numeric,
  to_m        numeric,
  sample_type text,
  prep        text not null default 'crushed'
              check (prep in ('insitu','grab','crushed','pulv','pellet')),
  mode        text,
  count_time  numeric,
  gps         text,
  qc          text,               -- '', 'dup', 'crm', 'blank', 'repeat'
  operator    text,
  notes       text,
  reading_at  timestamptz,        -- when the reading was taken (instrument time)
  elements    jsonb not null default '{}'::jsonb,
  w_pct       numeric,            -- convenience copy of elements->W->v
  w_2sigma    numeric,
  wo3_pct     numeric,            -- w_pct * 1.2611
  created_by  uuid references auth.users(id) default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists readings_sample_idx on public.readings (sample_id);
create index if not exists readings_prep_idx   on public.readings (prep);
create index if not exists readings_time_idx   on public.readings (reading_at desc);

alter table public.readings enable row level security;

-- READ: any signed-in user sees all readings (the shared assay register).
drop policy if exists readings_read on public.readings;
create policy readings_read on public.readings
  for select using (auth.role() = 'authenticated');

-- INSERT: any signed-in user may add readings (row is stamped with their id).
drop policy if exists readings_insert on public.readings;
create policy readings_insert on public.readings
  for insert with check (auth.uid() = created_by);

-- UPDATE: the author, a geologist, or a manager may edit.
drop policy if exists readings_update on public.readings;
create policy readings_update on public.readings
  for update using (
    auth.uid() = created_by
    or public.my_role() in ('geologist','manager')
  );

-- DELETE: managers only (data is precious — deletion is a privileged act).
drop policy if exists readings_delete on public.readings;
create policy readings_delete on public.readings
  for delete using (public.my_role() = 'manager');

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists readings_touch on public.readings;
create trigger readings_touch before update on public.readings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Make the first user a manager (optional convenience).
--    After you sign up once, run:
--      update public.profiles set role = 'manager' where email = 'you@example.com';
-- ---------------------------------------------------------------------------
