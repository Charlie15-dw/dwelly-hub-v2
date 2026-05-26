create table if not exists public.recall_schedules (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  assessment_id text not null,
  interval_days int  not null,   -- 3, 7, or 30
  due_date      date not null,
  completed_at  timestamptz,
  score         int,
  created_at    timestamptz default now()
);

alter table public.recall_schedules enable row level security;

-- Users can read their own upcoming recall checks (e.g. for a "My Recalls" dashboard widget)
create policy "Users can read own recall schedules"
  on public.recall_schedules
  for select
  using (auth.uid() = user_id);
