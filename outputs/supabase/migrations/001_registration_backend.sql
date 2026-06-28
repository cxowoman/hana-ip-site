create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'viewer'
    check (role in ('owner', 'admin', 'editor', 'viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  proposal_id text not null,
  event_title text not null,
  event_date date,
  event_time time,
  event_location text,
  member_name text not null,
  member_type text not null,
  email text not null,
  phone text not null,
  note text,
  notification_sent boolean not null default false,
  notification_error text,
  created_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id text primary key,
  slug text not null,
  teacher_name text not null,
  teacher_email text not null,
  title text not null,
  event_date date not null,
  event_time time not null,
  location text not null,
  capacity integer not null check (capacity > 0),
  price text not null,
  category text not null,
  description text not null,
  notes text,
  image_url text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.email_jobs (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  reminder_type text not null
    check (reminder_type in (
      'immediate',
      'two_days_after',
      'three_days_before',
      'one_day_before'
    )),
  scheduled_for timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'sent', 'failed')),
  attempts integer not null default 0,
  sent_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  unique (registration_id, reminder_type)
);

alter table public.profiles enable row level security;
alter table public.registrations enable row level security;
alter table public.proposals enable row level security;
alter table public.email_jobs enable row level security;

create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Staff can read registrations"
on public.registrations for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('owner', 'admin', 'editor', 'viewer')
  )
);

create policy "Admins can update registrations"
on public.registrations for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('owner', 'admin')
  )
);

create policy "Public can read approved proposals"
on public.proposals for select
to anon
using (status = 'approved');

create policy "Staff can read all proposals"
on public.proposals for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('owner', 'admin', 'editor', 'viewer')
  )
);

create policy "Staff can update proposals"
on public.proposals for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('owner', 'admin', 'editor')
  )
);

insert into storage.buckets (id, name, public)
values ('proposal-images', 'proposal-images', true)
on conflict (id) do update set public = true;

create index if not exists registrations_proposal_id_idx
on public.registrations (proposal_id);

create index if not exists registrations_created_at_idx
on public.registrations (created_at desc);

create index if not exists proposals_status_event_date_idx
on public.proposals (status, event_date);

create index if not exists email_jobs_due_idx
on public.email_jobs (status, scheduled_for);
