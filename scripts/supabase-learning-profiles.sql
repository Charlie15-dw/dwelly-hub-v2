create table if not exists public.learning_profiles (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null unique,
  answers      jsonb not null,
  style_label  text,
  style_icon   text,
  confidence_label text,
  confidence_pct   integer,
  manager_note text,
  completed_at timestamptz default now()
);

alter table public.learning_profiles enable row level security;

create policy "Users can view own profile"
  on public.learning_profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile"
  on public.learning_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile"
  on public.learning_profiles for update using (auth.uid() = user_id);
create policy "Managers can view team learning profiles"
  on public.learning_profiles for select
  using (
    public.is_manager() and exists (
      select 1 from public.user_profiles
      where id = learning_profiles.user_id
      and manager_id = auth.uid()
    )
  );
