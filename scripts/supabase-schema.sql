-- ============================================================
-- Dwelly Training Portal — Supabase Database Schema
-- Run this in your Supabase project: SQL Editor → New Query
-- ============================================================

-- ── User profiles ────────────────────────────────────────────
-- Extends Supabase's built-in auth.users with portal-specific fields
create table if not exists public.user_profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  role        text default 'property-manager',  -- property-manager | senior-pm | manager
  created_at  timestamptz default now()
);

-- Automatically create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Assessment results ────────────────────────────────────────
-- Stores every quiz attempt (replaces localStorage)
create table if not exists public.assessment_results (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  assessment_id text not null,                   -- e.g. 'mnt-02', 'master-assessment'
  score         integer not null,                -- percentage 0–100
  passed        boolean not null,
  answers       jsonb,                           -- full answer record for review
  completed_at  timestamptz default now()
);

-- ── Module progress ───────────────────────────────────────────
-- Tracks per-user progress on each video module
create table if not exists public.module_progress (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  module_id   text not null,                    -- e.g. 'mnt-01'
  progress    integer default 0,               -- 0–100 percentage
  completed   boolean default false,
  last_watched_at timestamptz default now(),
  unique(user_id, module_id)
);

-- ── CPD log ───────────────────────────────────────────────────
create table if not exists public.cpd_entries (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  activity    text not null,
  hours       numeric(4,1) not null,
  logged_at   timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────
-- Users can only read/write their own data

alter table public.user_profiles   enable row level security;
alter table public.assessment_results enable row level security;
alter table public.module_progress  enable row level security;
alter table public.cpd_entries      enable row level security;

-- user_profiles
create policy "Users can view own profile"
  on public.user_profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.user_profiles for update using (auth.uid() = id);

-- assessment_results
create policy "Users can view own results"
  on public.assessment_results for select using (auth.uid() = user_id);
create policy "Users can insert own results"
  on public.assessment_results for insert with check (auth.uid() = user_id);

-- module_progress
create policy "Users can view own progress"
  on public.module_progress for select using (auth.uid() = user_id);
create policy "Users can upsert own progress"
  on public.module_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress"
  on public.module_progress for update using (auth.uid() = user_id);

-- cpd_entries
create policy "Users can view own CPD"
  on public.cpd_entries for select using (auth.uid() = user_id);
create policy "Users can insert own CPD"
  on public.cpd_entries for insert with check (auth.uid() = user_id);
