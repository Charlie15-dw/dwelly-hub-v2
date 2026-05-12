-- Add confidence_rating column to module_progress
alter table public.module_progress
  add column if not exists confidence_rating integer check (confidence_rating between 1 and 5);
