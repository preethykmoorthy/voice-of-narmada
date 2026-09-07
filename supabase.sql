-- VOICE OF NARMADA DATABASE

create extension if not exists pgcrypto;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  reference_code text unique not null,
  category text not null,
  message text not null
    check (char_length(message) between 1 and 2000),
  status text not null default 'Received'
    check (status in ('Received', 'Under Review', 'Action Taken', 'Closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.messages enable row level security;

-- Anonymous users can submit messages.
create policy "Anyone can submit anonymous messages"
on public.messages
for insert
to anon
with check (
  char_length(message) between 1 and 2000
  and char_length(reference_code) between 1 and 30
);

-- Anonymous users should NOT have direct SELECT access.
-- Status checking will use the secure function below.

-- Admin users can read messages.
create policy "Admins can read messages"
on public.messages
for select
to authenticated
using (true);

-- Admin users can update messages.
create policy "Admins can update messages"
on public.messages
for update
to authenticated
using (true)
with check (true);

-- Secure anonymous status lookup.
create or replace function public.check_message_status(
  lookup_reference_code text
)
returns table (
  reference_code text,
  status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    m.reference_code,
    m.status,
    m.created_at
  from public.messages m
  where m.reference_code = lookup_reference_code
  limit 1;
$$;

-- Allow anonymous visitors to call the status-check function.
grant execute
on function public.check_message_status(text)
to anon;

-- Keep updated_at current automatically.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists messages_updated_at on public.messages;

create trigger messages_updated_at
before update on public.messages
for each row
execute function public.set_updated_at();