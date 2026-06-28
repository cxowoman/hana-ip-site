alter table public.registrations
  add column if not exists event_capacity integer,
  add column if not exists event_price text,
  add column if not exists email_opening text,
  add column if not exists email_closing text;
