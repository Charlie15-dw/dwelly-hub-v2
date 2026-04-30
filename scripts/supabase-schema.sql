create table if not exists public.user_profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  role        text default 'property-manager',
  created_at  timestamptz default now()
);

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

create table if not exists public.assessment_results (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  assessment_id text not null,
  score         integer not null,
  passed        boolean not null,
  answers       jsonb,
  completed_at  timestamptz default now()
);

create table if not exists public.module_progress (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references auth.users(id) on delete cascade not null,
  module_id       text not null,
  progress        integer default 0,
  completed       boolean default false,
  last_watched_at timestamptz default now(),
  unique(user_id, module_id)
);

create table if not exists public.cpd_entries (
  id        uuid default gen_random_uuid() primary key,
  user_id   uuid references auth.users(id) on delete cascade not null,
  activity  text not null,
  hours     numeric(4,1) not null,
  logged_at timestamptz default now()
);

alter table public.user_profiles      enable row level security;
alter table public.assessment_results enable row level security;
alter table public.module_progress    enable row level security;
alter table public.cpd_entries        enable row level security;

create policy "Users can view own profile"
  on public.user_profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.user_profiles for update using (auth.uid() = id);

create policy "Users can view own results"
  on public.assessment_results for select using (auth.uid() = user_id);
create policy "Users can insert own results"
  on public.assessment_results for insert with check (auth.uid() = user_id);

create policy "Users can view own progress"
  on public.module_progress for select using (auth.uid() = user_id);
create policy "Users can upsert own progress"
  on public.module_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress"
  on public.module_progress for update using (auth.uid() = user_id);

create policy "Users can view own CPD"
  on public.cpd_entries for select using (auth.uid() = user_id);
create policy "Users can insert own CPD"
  on public.cpd_entries for insert with check (auth.uid() = user_id);
