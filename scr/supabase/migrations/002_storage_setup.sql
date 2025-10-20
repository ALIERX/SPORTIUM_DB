-- ============================================
-- SPORTIUM - Storage Buckets Setup
-- For images and files
-- ============================================

-- ============================================
-- CREATE STORAGE BUCKETS
-- ============================================

-- Auction images (private, admin upload only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'auction-images',
  'auction-images',
  true, -- Public read, admin write
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- User avatars (private, user upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-avatars',
  'user-avatars',
  true, -- Public read
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Reward images (private, admin upload only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reward-images',
  'reward-images',
  true, -- Public read
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Quiz images (private, admin upload only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'quiz-images',
  'quiz-images',
  true, -- Public read
  3145728, -- 3MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Auction Images: Public read, admin write
CREATE POLICY "Anyone can view auction images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'auction-images');

CREATE POLICY "Admin can upload auction images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'auction-images' 
    AND auth.uid() IS NOT NULL
    -- Add admin check if you have admin role in profiles table
  );

CREATE POLICY "Admin can update auction images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'auction-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin can delete auction images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'auction-images' AND auth.uid() IS NOT NULL);

-- User Avatars: Public read, owner write
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Reward Images: Public read, admin write
CREATE POLICY "Anyone can view reward images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'reward-images');

CREATE POLICY "Admin can upload reward images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'reward-images' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Admin can update reward images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'reward-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin can delete reward images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'reward-images' AND auth.uid() IS NOT NULL);

-- Quiz Images: Public read, admin write
CREATE POLICY "Anyone can view quiz images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'quiz-images');

CREATE POLICY "Admin can upload quiz images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'quiz-images' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Admin can update quiz images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'quiz-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin can delete quiz images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'quiz-images' AND auth.uid() IS NOT NULL);

-- ============================================
-- HELPER FUNCTIONS FOR UPLOADS
-- ============================================

-- Function to get public URL for a file
CREATE OR REPLACE FUNCTION public.get_public_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT CONCAT(
      current_setting('app.settings.supabase_url'),
      '/storage/v1/object/public/',
      bucket_name,
      '/',
      file_path
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMPLETED!
-- ============================================
-- Storage buckets and policies created
-- Next: Run RLS policies (003)
