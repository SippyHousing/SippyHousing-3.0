-- Migration 009: REPAIR for "enquiry is saved in Supabase but not visible in the admin panel".
-- Works even if the enquiries table already existed with different settings. Safe to run many times.

-- 1) Make sure every column the admin page needs exists
alter table enquiries add column if not exists full_name text;
alter table enquiries add column if not exists phone_number text;
alter table enquiries add column if not exists email text;
alter table enquiries add column if not exists interest_area text default 'General Inquiry';
alter table enquiries add column if not exists message text;
alter table enquiries add column if not exists source text default 'Contact Us Form';
alter table enquiries add column if not exists status text default 'New';
alter table enquiries add column if not exists admin_notes text;
alter table enquiries add column if not exists created_at timestamptz default now();

update enquiries set status = 'New' where status is null;

-- 2) Permissions: visitors can submit, logged-in admins can read / update / delete
alter table enquiries enable row level security;

-- remove every old policy (names may differ from mine) and create clean ones
do $$
declare r record;
begin
  for r in select policyname from pg_policies where schemaname = 'public' and tablename = 'enquiries' loop
    execute format('drop policy if exists %I on enquiries', r.policyname);
  end loop;
end $$;

create policy "enq_insert_anyone"  on enquiries for insert to anon, authenticated with check (true);
create policy "enq_select_admin"   on enquiries for select to authenticated using (true);
create policy "enq_update_admin"   on enquiries for update to authenticated using (true) with check (true);
create policy "enq_delete_admin"   on enquiries for delete to authenticated using (true);

grant insert on enquiries to anon;
grant select, insert, update, delete on enquiries to authenticated;
