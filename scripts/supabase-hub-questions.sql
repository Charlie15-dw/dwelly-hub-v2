-- Anonymous Q&A for The Hub.
--
-- Submissions are anonymous *in the app*: no API endpoint or UI ever returns
-- the submitter. The `submitted_by` column exists ONLY so a database
-- administrator can identify the author of an abusive submission via the
-- Supabase SQL editor. It must never be selected by application code.
--
-- This is NOT cryptographic anonymity — anyone with direct DB access can
-- unmask a submitter. That is intentional, for moderation/accountability.

create table if not exists public.hub_questions (
  id             uuid default gen_random_uuid() primary key,
  body           text not null,
  category       text,                                  -- optional area tag (CRM, Finance, etc.)
  status         text not null default 'new',           -- new | reviewing | answered
  admin_response text,                                  -- optional written response from an admin
  submitted_by   uuid references auth.users(id) on delete set null, -- moderation only; never exposed in-app
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Lock the table down entirely: with RLS enabled and no policies, the anon and
-- authenticated client SDKs cannot read or write it. All access goes through
-- server-side API routes using the service-role key, which checks auth/role
-- and never returns submitted_by.
alter table public.hub_questions enable row level security;

-- Helpful index for the admin list (newest first).
create index if not exists hub_questions_created_at_idx
  on public.hub_questions (created_at desc);

-- To identify the author of a specific submission (moderation only):
--   select q.id, q.body, p.full_name, p.email
--   from public.hub_questions q
--   join public.user_profiles p on p.id = q.submitted_by
--   where q.id = '<question-id>';
