create table if not exists public.pending_invites (
  id         uuid default gen_random_uuid() primary key,
  email      text not null,
  full_name  text,
  role       text not null default 'property-manager',
  created_at timestamptz default now(),
  used_at    timestamptz,
  invited_by text
);

-- Only service role can read/write this table
alter table public.pending_invites enable row level security;
