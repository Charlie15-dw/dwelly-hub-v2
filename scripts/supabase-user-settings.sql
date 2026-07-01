-- Per-user portal settings: notification, learning, and accessibility
-- preferences. Stored as a single jsonb blob so the shape can evolve without a
-- migration each time. One row per user; the client upserts on change.
--
-- Cross-device sync: settings are cached in localStorage for an instant, no-flash
-- load, then reconciled against this table (the source of truth) once the user is
-- known. See components/SettingsProvider.tsx.

create table if not exists public.user_settings (
  user_id    uuid references auth.users(id) on delete cascade primary key,
  settings   jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.user_settings enable row level security;

-- Users can only ever read and write their own settings row.
create policy "Users can view own settings"
  on public.user_settings for select using (auth.uid() = user_id);
create policy "Users can insert own settings"
  on public.user_settings for insert with check (auth.uid() = user_id);
create policy "Users can update own settings"
  on public.user_settings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
