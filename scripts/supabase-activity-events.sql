-- Lightweight usage tracking: one row per page view, recorded from the browser
-- as users navigate the portal. Powers the admin "Usage" view so we can see who
-- is using the Hub and what they're looking at.
--
-- Users can only ever write their own rows; reading across users is done in the
-- admin page with the service-role key (which bypasses RLS), so no broad read
-- policy is granted here.

create table if not exists public.activity_events (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  path       text not null,                    -- e.g. '/hub', '/training/general-navigation'
  label      text,                             -- human-friendly page name, when known
  created_at timestamptz default now()
);

create index if not exists activity_events_user_id_idx on public.activity_events (user_id);
create index if not exists activity_events_created_at_idx on public.activity_events (created_at desc);

alter table public.activity_events enable row level security;

create policy "Users can insert own activity"
  on public.activity_events for insert with check (auth.uid() = user_id);
create policy "Users can view own activity"
  on public.activity_events for select using (auth.uid() = user_id);
