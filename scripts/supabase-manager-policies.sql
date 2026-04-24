-- Add email to user_profiles so managers can see team emails
alter table public.user_profiles add column if not exists email text;

-- Update the trigger to also store email when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

-- Helper function: returns true if the current logged-in user is a manager
create or replace function public.is_manager()
returns boolean language sql security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'manager'
  );
$$;

-- Allow managers to view all team profiles
create policy "Managers can view all profiles"
  on public.user_profiles for select
  using (public.is_manager());

-- Allow managers to view all assessment results
create policy "Managers can view all results"
  on public.assessment_results for select
  using (public.is_manager());

-- Allow managers to view all module progress
create policy "Managers can view all progress"
  on public.module_progress for select
  using (public.is_manager());

-- Backfill emails for any existing users
update public.user_profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;
