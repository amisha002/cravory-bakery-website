-- Enable RLS on gallery_images table
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (safe to run multiple times)
DROP POLICY IF EXISTS "Allow public SELECT on gallery_images" ON gallery_images;

-- Allow public SELECT on gallery_images
CREATE POLICY "Allow public SELECT on gallery_images"
ON gallery_images
FOR SELECT
TO public
USING (true);

-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "Allow public SELECT on reviews" ON reviews;
DROP POLICY IF EXISTS "Allow public INSERT on reviews" ON reviews;

-- Allow public SELECT on reviews
CREATE POLICY "Allow public SELECT on reviews"
ON reviews
FOR SELECT
TO public
USING (true);

-- Allow public INSERT on reviews
CREATE POLICY "Allow public INSERT on reviews"
ON reviews
FOR INSERT
TO public
WITH CHECK (true);

-- Enable RLS on gallery_likes table
alter table gallery_likes enable row level security;

-- Allow public read on gallery_likes
create policy "Public read"
on gallery_likes
for select
using (true);

-- Allow public insert on gallery_likes
create policy "Public insert"
on gallery_likes
for insert
with check (true);

-- Allow public delete on gallery_likes (needed for unliking)
create policy "Public delete"
on gallery_likes
for delete
using (true);
