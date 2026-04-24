-- Add manager_id to link each staff member to their manager
alter table public.user_profiles
add column if not exists manager_id uuid references auth.users(id) on delete set null;

-- Drop the old "see all" manager policies and replace with team-scoped ones
drop policy if exists "Managers can view all profiles" on public.user_profiles;
drop policy if exists "Managers can view all results" on public.assessment_results;
drop policy if exists "Managers can view all progress" on public.module_progress;

-- Managers can see: their own profile, their team, and unassigned users
create policy "Managers can view team profiles"
  on public.user_profiles for select
  using (
    auth.uid() = id
    or (public.is_manager() and (manager_id = auth.uid() or manager_id is null))
  );

-- Managers can assign users to themselves
create policy "Managers can update team assignment"
  on public.user_profiles for update
  using (public.is_manager())
  with check (public.is_manager());

-- Managers can view assessment results for their team
create policy "Managers can view team results"
  on public.assessment_results for select
  using (
    auth.uid() = user_id
    or (
      public.is_manager() and exists (
        select 1 from public.user_profiles
        where id = assessment_results.user_id
        and manager_id = auth.uid()
      )
    )
  );

-- Managers can view module progress for their team
create policy "Managers can view team progress"
  on public.module_progress for select
  using (
    auth.uid() = user_id
    or (
      public.is_manager() and exists (
        select 1 from public.user_profiles
        where id = module_progress.user_id
        and manager_id = auth.uid()
      )
    )
  );
