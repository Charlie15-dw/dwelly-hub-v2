-- Anonymous usage tracking for the Dwelly Context Widget (the Chrome extension
-- that runs inside the CRM). Unlike activity_events, the people using the widget
-- are NOT logged into the Hub, so there is no user_id to attach. Instead each
-- browser install generates a random client_id (stored in chrome.storage) and we
-- count actions against that — enough to see how many people use the widget and
-- the split between the SOP and Ask Dobby sections, without any personal data.
--
-- Rows are written only by the server route /api/widget/event using the
-- service-role key (which bypasses RLS). The public/anon role is granted nothing,
-- so the table can't be read or written directly from the browser.

create table if not exists public.widget_events (
  id         uuid default gen_random_uuid() primary key,
  client_id  text not null,                    -- anonymous per-install id (chrome.storage)
  event      text not null,                    -- 'open' | 'tab' | 'dobby_ask' | 'sop_search'
  tab        text,                             -- which tab, for 'tab' events: 'sop' | 'dobby' | 'dash' | 'll' | 'prop'
  created_at timestamptz default now()
);

create index if not exists widget_events_event_idx on public.widget_events (event);
create index if not exists widget_events_created_at_idx on public.widget_events (created_at desc);
create index if not exists widget_events_client_id_idx on public.widget_events (client_id);

-- RLS on with no policies → the anon/authenticated roles get no access at all.
-- The service-role key used by the server route bypasses RLS, so inserts and the
-- admin read both work while the table stays sealed to the browser.
alter table public.widget_events enable row level security;
