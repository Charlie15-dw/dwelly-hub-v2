-- Training requests for The Hub.
--
-- Unlike the anonymous Q&A, training requests are ATTRIBUTED: the requester's
-- identity is deliberately exposed to admins so they know who to follow up with
-- and who the training is for. Only managers and admins may submit (enforced in
-- the API route); property managers have no access.
--
-- Two request types:
--   * further      — further training for an existing team member on the system
--   * new_starter  — training for a new joiner
--
-- All access goes through server-side API routes using the service-role key,
-- which check the caller's role before reading or writing.

create table if not exists public.hub_training_requests (
  id            uuid default gen_random_uuid() primary key,
  request_type  text not null,                         -- 'further' | 'new_starter'
  focus_area    text,                                  -- optional area tag (CRM, Compliance, etc.)
  subject_name  text,                                  -- who the training is for; null = the requester themselves
  details       text not null,                         -- free-text description of what's needed
  urgency       text not null default 'normal',        -- 'low' | 'normal' | 'high'
  status        text not null default 'new',           -- new | reviewing | scheduled | completed
  admin_notes   text,                                  -- private notes from the admin actioning it
  requested_by  uuid references auth.users(id) on delete set null,  -- attributed (shown to admins)
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Lock the table down entirely: with RLS enabled and no policies, the anon and
-- authenticated client SDKs cannot read or write it. All access goes through
-- server-side API routes using the service-role key, which check auth + role.
alter table public.hub_training_requests enable row level security;

-- Helpful index for the admin list (newest first).
create index if not exists hub_training_requests_created_at_idx
  on public.hub_training_requests (created_at desc);
