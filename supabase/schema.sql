-- Create leads table
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text,
  source text default 'web',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'new'
);

-- Enable RLS
alter table public.leads enable row level security;

-- Policies
create policy "Allow anonymous inserts" on public.leads
  for insert with check (true);

create policy "Allow read access for authenticated users only" on public.leads
  for select using (auth.role() = 'authenticated');
