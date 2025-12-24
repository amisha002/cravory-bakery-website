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





