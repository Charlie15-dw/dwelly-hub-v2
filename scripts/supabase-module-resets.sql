-- Module Resets
-- Allows managers to grant a retake for a specific module assessment.
-- The quiz page checks for a pending reset on load and clears the localStorage lock.

create table if not exists public.module_resets (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references auth.users(id) on delete cascade not null,
  module_id   text        not null,
  manager_id  uuid        references auth.users(id) on delete set null,
  created_at  timestamptz default now(),
  consumed_at timestamptz
);

alter table public.module_resets enable row level security;

-- Users can read their own pending (unconsumed) resets
create policy "Users can read own pending resets"
  on public.module_resets for select
  using (auth.uid() = user_id and consumed_at is null);

-- Users can mark their own resets as consumed
create policy "Users can consume own resets"
  on public.module_resets for update
  using (auth.uid() = user_id);

-- Managers can insert resets for team members
create policy "Managers can create resets"
  on public.module_resets for insert
  with check (is_manager());

-- Managers can read resets they created
create policy "Managers can read own created resets"
  on public.module_resets for select
  using (auth.uid() = manager_id);
