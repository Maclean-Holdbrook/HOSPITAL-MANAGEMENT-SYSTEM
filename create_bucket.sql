-- Run this in your Supabase SQL Editor

-- 1. Create the storage bucket 'medical-reports'
insert into storage.buckets (id, name, public)
values ('medical-reports', 'medical-reports', true)
on conflict (id) do nothing;

-- 2. Allow public access to view files (so patients can download them)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'medical-reports' );

-- 3. Allow authenticated users (doctors/admins) to upload files
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'medical-reports' and auth.role() = 'authenticated' );

-- 4. Allow authenticated users to update/delete their own uploads (optional)
create policy "Authenticated Update"
  on storage.objects for update
  using ( bucket_id = 'medical-reports' and auth.role() = 'authenticated' );

create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'medical-reports' and auth.role() = 'authenticated' );
