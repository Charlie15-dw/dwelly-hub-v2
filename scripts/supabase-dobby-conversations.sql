-- Persistent chat history for Ask Dobby. Each user's conversations, and the
-- messages within them, are stored so a chat is no longer lost on navigation
-- and can be reopened and continued later.
--
-- Strictly per-user: RLS ensures a user can only ever see and modify their own
-- conversations and messages. Nothing here is ever read across users.

create table if not exists public.dobby_conversations (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  title      text not null default 'New chat',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.dobby_messages (
  id              uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.dobby_conversations(id) on delete cascade not null,
  user_id         uuid references auth.users(id) on delete cascade not null,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  created_at      timestamptz default now()
);

create index if not exists dobby_conversations_user_idx
  on public.dobby_conversations (user_id, updated_at desc);
create index if not exists dobby_messages_conversation_idx
  on public.dobby_messages (conversation_id, created_at);

alter table public.dobby_conversations enable row level security;
alter table public.dobby_messages enable row level security;

-- A single "for all" policy per table: users can select, insert, update and
-- delete only their own rows.
create policy "Users manage own dobby conversations"
  on public.dobby_conversations for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own dobby messages"
  on public.dobby_messages for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
