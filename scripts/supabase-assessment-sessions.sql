create table if not exists public.assessment_sessions (
  user_id          uuid references auth.users(id) on delete cascade,
  module_id        text not null,
  answers          jsonb not null default '[]',
  current_question int not null default 0,
  started_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  primary key (user_id, module_id)
);

alter table public.assessment_sessions enable row level security;

create policy "Users can manage their own sessions"
  on public.assessment_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
