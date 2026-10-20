-- Retake Requests
-- A learner whose single assessment attempt is used can ask their assigned
-- manager for a retake. This records the request so the manager sees it on the
-- member's detail page; granting a retake still happens via module_resets.

create table if not exists public.retake_requests (
  id            uuid        default gen_random_uuid() primary key,
  user_id       uuid        references auth.users(id) on delete cascade not null,
  assessment_id text        not null,
  manager_id    uuid        references auth.users(id) on delete set null,
  status        text        not null default 'pending',  -- pending | resolved
  requested_at  timestamptz default now(),
  resolved_at   timestamptz
);

-- One live pending request per learner per assessment.
create unique index if not exists retake_requests_one_pending
  on public.retake_requests (user_id, assessment_id)
  where status = 'pending';

alter table public.retake_requests enable row level security;

-- Learners can raise and read their own requests
create policy "Users can create own retake requests"
  on public.retake_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can read own retake requests"
  on public.retake_requests for select
  using (auth.uid() = user_id);

-- Managers can read and resolve requests routed to them
create policy "Managers can read requests routed to them"
  on public.retake_requests for select
  using (auth.uid() = manager_id);

create policy "Managers can resolve requests routed to them"
  on public.retake_requests for update
  using (auth.uid() = manager_id);
