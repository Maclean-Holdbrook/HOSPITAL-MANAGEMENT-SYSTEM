-- Run this in your Supabase SQL Editor to create the medical_records table

create table if not exists medical_records (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default now(),
  patient_email text not null,
  doctor_name text,
  record_type text,
  record_url text
);

-- Turn on RLS
alter table medical_records enable row level security;

-- Policy: Patients can view their own records
create policy "Patients can view own records"
  on medical_records for select
  using ( (select auth.email()) = patient_email );

-- Policy: Doctors/Admins can insert records for anyone (or you can restrict to authenticated)
create policy "Doctors can insert records"
  on medical_records for insert
  with check ( auth.role() = 'authenticated' );

-- Policy: Doctors/Admins can view all records (optional, if you want doctors to see what they uploaded)
create policy "Doctors can view all records"
  on medical_records for select
  using ( auth.role() = 'authenticated' );
