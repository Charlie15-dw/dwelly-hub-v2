-- Departments — the new cross-business IA.
--
-- `role` already means PERMISSION TIER ('property-manager' | 'manager' | 'admin')
-- and must not be touched — is_manager(), roleSkipsOnboarding() and
-- canAccessTrainingRequests() all key off it.
--
-- `department` is a new, separate axis: WHICH track's content/training a user
-- belongs to. Fixed per person (set by an admin when the account is created or
-- assigned), and used to:
--   - choose which role-overview + training content a user sees
--   - lock assessment submission to that department (see assessment_overrides
--     below for the one exception)
--   - let admins (role = 'admin') see and filter every department at once
--
-- Existing rows default to 'property-management' so nobody currently on the
-- live Hub is affected.

-- Helper function first — every policy below references it, and CREATE POLICY
-- resolves function names at creation time, not lazily at check time.
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

do $$ begin
  create type public.department as enum (
    'property-management',
    'tenant-find',
    'finance',
    'property-specialist'
  );
exception when duplicate_object then null;
end $$;

alter table public.user_profiles
  add column if not exists department public.department not null default 'property-management';

-- Admin override — lets an admin grant ONE specific user access to sit an
-- assessment (or a whole department's assessments) outside their own
-- department, without changing their department or role. Scoped and auditable:
-- every grant records who gave it and when, and `assessment_id = null` means
-- "every assessment in that department", not "every assessment everywhere".
create table if not exists public.assessment_overrides (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  department    public.department not null,
  assessment_id text, -- null = whole department
  granted_by    uuid references auth.users(id) on delete set null,
  granted_at    timestamptz default now(),
  unique (user_id, department, assessment_id)
);

alter table public.assessment_overrides enable row level security;

-- Users can see their own overrides (so the UI can show "unlocked for you").
drop policy if exists "Users can view own overrides" on public.assessment_overrides;
create policy "Users can view own overrides"
  on public.assessment_overrides for select
  using (auth.uid() = user_id);

-- Only admins can grant/view/revoke overrides for anyone.
drop policy if exists "Admins can manage overrides" on public.assessment_overrides;
create policy "Admins can manage overrides"
  on public.assessment_overrides for all
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can view every profile, result and progress row regardless of
-- department or manager_id — layered on top of the existing team-scoped
-- manager policies, not replacing them.
drop policy if exists "Admins can view all profiles" on public.user_profiles;
create policy "Admins can view all profiles"
  on public.user_profiles for select
  using (public.is_admin());

drop policy if exists "Admins can view all results" on public.assessment_results;
create policy "Admins can view all results"
  on public.assessment_results for select
  using (public.is_admin());

drop policy if exists "Admins can view all progress" on public.module_progress;
create policy "Admins can view all progress"
  on public.module_progress for select
  using (public.is_admin());

-- Admins can update any profile — needed to assign department/manager_id from
-- the admin console (managers can already update their own team's assignment
-- via the existing "Managers can update team assignment" policy).
drop policy if exists "Admins can update any profile" on public.user_profiles;
create policy "Admins can update any profile"
  on public.user_profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- Department lock on assessment submission — DB-enforced, not just hidden in
-- the UI. Maps an assessment_id to the department it belongs to by prefix;
-- mirrors assessmentDepartment() in lib/departments.ts — keep both in sync if
-- the id scheme changes. Only Property Management has real assessment ids
-- today, so every other department's ids return null (unrecognised = not
-- gated) until that content is actually built, which keeps this
-- forward-compatible rather than accidentally locking out content that
-- doesn't exist yet.
create or replace function public.assessment_department(p_assessment_id text)
returns public.department language sql immutable
as $$
  select case
    when p_assessment_id like 'mnt-%' or p_assessment_id like 'cmp-%' or p_assessment_id like 'ins-%'
      or p_assessment_id like 'mvt-%' or p_assessment_id like 'sys-%' or p_assessment_id like 'sup-%'
      or p_assessment_id like 'kno-%' or p_assessment_id like 'crm2-%'
      or p_assessment_id like 'release-%'
      or p_assessment_id in ('full-assessment', 'master-assessment')
      then 'property-management'::public.department
    else null
  end
$$;

drop policy if exists "Users can insert own results" on public.assessment_results;
drop policy if exists "Users can insert own results respecting department" on public.assessment_results;

create policy "Users can insert own results respecting department"
  on public.assessment_results for insert
  with check (
    auth.uid() = user_id
    and (
      public.is_admin()
      or public.assessment_department(assessment_id) is null
      or public.assessment_department(assessment_id) = (
           select department from public.user_profiles where id = auth.uid()
         )
      or exists (
           select 1 from public.assessment_overrides o
           where o.user_id = auth.uid()
             and o.department = public.assessment_department(assessment_results.assessment_id)
             and (o.assessment_id is null or o.assessment_id = assessment_results.assessment_id)
         )
    )
  );
