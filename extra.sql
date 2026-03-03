create table if not exists volunteer_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id integer not null,
  event_title text,
  user_id uuid references auth.users(id),
  name text not null,
  email text not null,
  phone text,
  message text,
  registered_at timestamptz default now()
);

-- ── Fix Submissions ──────────────────────────────────────────────────────────
create table if not exists fix_submissions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references reports(id),
  user_id uuid references auth.users(id),
  description text not null,
  video_url text,
  image_urls text[] default '{}',
  status text default 'pending', -- pending | approved | rejected
  points_awarded integer default 0,
  submitted_at timestamptz default now(),
  reviewed_at timestamptz
);

-- ── Profiles additions ───────────────────────────────────────────────────────
alter table profiles
  add column if not exists id_document_url text,
  add column if not exists id_verified boolean default false,
  add column if not exists id_type text default 'government_id', -- government_id | birth_certificate
  add column if not exists can_report boolean default false,
  add column if not exists is_banned boolean default false,
  add column if not exists fraud_chances integer default 3,
  add column if not exists admin_note text,
  add column if not exists report_count integer default 0;

-- ── Reports additions ────────────────────────────────────────────────────────
alter table reports
  add column if not exists video_url text,
  add column if not exists fraud_warning boolean default false,
  add column if not exists reviewed_at timestamptz;

-- ── Storage buckets ──────────────────────────────────────────────────────────
-- Run in Supabase Storage dashboard:
-- Create bucket: id-documents (private)
-- Create bucket: report-videos (public)
-- report-images bucket already exists

-- ── RLS Policies ─────────────────────────────────────────────────────────────
alter table volunteer_registrations enable row level security;
create policy "Anyone can insert" on volunteer_registrations for insert with check (true);
create policy "Users see own" on volunteer_registrations for select using (user_id = auth.uid());

alter table fix_submissions enable row level security;
create policy "Authenticated insert" on fix_submissions for insert with check (auth.uid() = user_id);
create policy "Users see own" on fix_submissions for select using (user_id = auth.uid());
create policy "Admins see all" on fix_submissions for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);