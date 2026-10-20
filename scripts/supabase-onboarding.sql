-- Staged onboarding for new starters.
--
-- New property-managers are walked through the training one stage at a time, in
-- segregated areas, before the full Hub unlocks. The sequence is fixed:
--   1 Maintenance (CRM 2.0)   2 Compliance (CRM 2.0)   3 Move-outs
--   4 Inspections             5 Support                6 Right to Rent
--   7 Graduated → full Hub
--
-- Two columns on user_profiles drive it:
--   onboarding_stage  — which stage the user is on (1..6), or 7 once graduated.
--   onboarding_bypass — an admin override that sends the user straight to the
--                       full Hub regardless of stage.
--
-- Managers and admins never go through onboarding (the app treats their role as
-- graduated), so this only ever gates property-managers.

alter table public.user_profiles
  add column if not exists onboarding_stage  smallint not null default 1,
  add column if not exists onboarding_bypass boolean  not null default false;

-- Everyone who already exists keeps the full Hub — this feature is only for
-- FUTURE starters, so backfill every current row to graduated. New rows created
-- after this runs start at stage 1 (the column default); the accept-invite flow
-- bumps managers/admins to 7 at creation time.
update public.user_profiles set onboarding_stage = 7 where onboarding_stage < 7;
