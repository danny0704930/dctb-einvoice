create table einvoice_requests (
  id uuid primary key default gen_random_uuid(),
  store text not null,              -- C1 / C2 / C3
  receipt_no text not null,
  amount numeric,
  entity_type text not null,        -- business / individual
  id_type text not null,            -- brn / nric / passport
  name text not null,
  tin text,
  id_number text,                   -- BRN or NRIC/Passport number
  sst_no text,
  email text not null,
  phone text,
  address text,
  postcode text,
  city text,
  state text,
  status text not null default 'pending', -- pending / issued
  created_at timestamptz not null default now()
);

-- Row Level Security: allow anyone to submit a request (insert only),
-- but only authenticated/service-role access can read the list.
alter table einvoice_requests enable row level security;

create policy "public can insert requests"
  on einvoice_requests for insert
  to anon
  with check (true);

-- No select policy for anon — the admin page reads with the anon key too,
-- so if you want the /admin page to actually see data without a backend
-- function, either:
--   (a) add a select policy scoped to a signed-in Supabase Auth user, or
--   (b) keep this table anon-insert-only and read it from Vercel with the
--       service_role key in a serverless function instead of client-side.
-- For now, given /admin is only password-gated in the frontend, use option
-- (b) once you're ready to lock this down properly.
