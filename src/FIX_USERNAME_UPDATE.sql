-- ============================================
-- FIX USERNAME - Aggiorna Profiles
-- ============================================
-- Questo script aggiorna gli username nella
-- tabella profiles usando i dati corretti da
-- auth.users.raw_user_meta_data
-- ============================================

-- ============================================
-- STEP 1: Verifica Situazione Attuale
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '==========================================================';
  RAISE NOTICE '📊 BEFORE UPDATE - Current State';
  RAISE NOTICE '==========================================================';
END $$;

SELECT 
  'Current Profiles' as info,
  p.email,
  p.username as current_username,
  u.raw_user_meta_data->>'username' as metadata_username
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 10;

-- ============================================
-- STEP 2: Update Usernames from Metadata
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== Updating usernames from metadata ===';
END $$;

-- Update usernames from auth.users metadata
UPDATE profiles p
SET 
  username = COALESCE(
    u.raw_user_meta_data->>'username',
    split_part(u.email, '@', 1)
  ),
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id
  AND p.username != COALESCE(
    u.raw_user_meta_data->>'username',
    split_part(u.email, '@', 1)
  );

-- Get count of updated rows
DO $$ 
DECLARE
  updated_count integer;
BEGIN
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated % profiles', updated_count;
END $$;

-- ============================================
-- STEP 3: Verify Results
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE '✅ AFTER UPDATE - Verification';
  RAISE NOTICE '==========================================================';
END $$;

SELECT 
  'Updated Profiles' as info,
  p.email,
  p.username as updated_username,
  u.raw_user_meta_data->>'username' as metadata_username,
  CASE 
    WHEN p.username = COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1))
    THEN '✅ MATCH'
    ELSE '❌ MISMATCH'
  END as status
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 10;

-- ============================================
-- STEP 4: Summary Statistics
-- ============================================

SELECT 
  '=== SUMMARY ===' as info,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN username != 'CalcioFan2024' THEN 1 END) as unique_usernames,
  COUNT(CASE WHEN username = 'CalcioFan2024' THEN 1 END) as default_usernames
FROM profiles;

-- ============================================
-- Success Message
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE '✅ USERNAME UPDATE COMPLETE';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'All usernames updated from auth metadata!';
  RAISE NOTICE 'Refresh your app to see the changes.';
  RAISE NOTICE '==========================================================';
END $$;

-- ============================================
-- END
-- ============================================
