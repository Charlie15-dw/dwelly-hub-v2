-- Addendum to supabase-hub-questions.sql: adds a public "Answered" feed.
--
-- published_at is null until an admin explicitly publishes an answered
-- question to the Hub's public feed. Publishing is a deliberate action, so
-- nothing reaches the team feed by accident.

alter table public.hub_questions
  add column if not exists published_at timestamptz;

-- Index for the public feed (most recently published first).
create index if not exists hub_questions_published_at_idx
  on public.hub_questions (published_at desc)
  where published_at is not null;
