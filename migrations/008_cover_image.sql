-- Migration 008: choose which image is the cover (shown first on the website).
-- display_order: 0 = cover, then 1, 2, 3 ...  Safe to run more than once.
alter table property_images
  add column if not exists display_order integer not null default 0;

-- Back-fill old rows so the oldest upload is the cover.
-- (Run this ONLY ONCE. Running it again resets any cover you chose in the admin panel.)
update property_images p
set display_order = r.rn - 1
from (
  select id, row_number() over (partition by property_id order by created_at asc) as rn
  from property_images
) r
where p.id = r.id;

-- Allow logged-in admins to change the cover image
drop policy if exists "Admins can update property images" on property_images;
create policy "Admins can update property images" on property_images
    for update to authenticated using (true) with check (true);
grant update on property_images to authenticated;
