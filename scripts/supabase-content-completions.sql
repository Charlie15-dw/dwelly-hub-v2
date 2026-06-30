-- Per-user "I've read this" markers for Training Guides and Knowledge Base
-- articles. One row per (user, content_type, content_id). Drives the ticks on
-- the Hub journey and feeds usage reporting.

create table if not exists public.content_completions (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  content_type text not null,                  -- 'training' | 'knowledge'
  content_id   text not null,                  -- e.g. 'general-navigation', 'kb-tenancy-law'
  completed_at timestamptz default now(),
  unique (user_id, content_type, content_id)
);

alter table public.content_completions enable row level security;

create policy "Users can view own completions"
  on public.content_completions for select using (auth.uid() = user_id);
create policy "Users can insert own completions"
  on public.content_completions for insert with check (auth.uid() = user_id);
create policy "Users can delete own completions"
  on public.content_completions for delete using (auth.uid() = user_id);
create policy "Managers can view team completions"
  on public.content_completions for select
  using (
    public.is_manager() and exists (
      select 1 from public.user_profiles
      where id = content_completions.user_id
      and manager_id = auth.uid()
    )
  );
