alter table public.proposals
add column if not exists event_end_time time;

alter table public.registrations
add column if not exists event_end_time time;
