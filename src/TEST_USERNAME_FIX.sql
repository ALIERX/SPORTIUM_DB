-- ============================================
-- TEST USERNAME FIX
-- ============================================
-- Quick test per verificare che il fix
-- funzioni correttamente
-- ============================================

-- ============================================
-- TEST 1: Check Current Usernames
-- ============================================

SELECT 
  '=== TEST 1: Current Usernames ===' as test_name,
  email,
  username,
  CASE 
    WHEN username = 'CalcioFan2024' THEN '❌ DEFAULT (needs fix)'
    WHEN username IS NULL THEN '❌ NULL (needs fix)'
    ELSE '✅ UNIQUE'
  END as status
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- TEST 2: Compare with Auth Metadata
-- ============================================

SELECT 
  '=== TEST 2: Metadata Comparison ===' as test_name,
  p.email,
  p.username as profile_username,
  u.raw_user_meta_data->>'username' as metadata_username,
  split_part(u.email, '@', 1) as email_prefix,
  CASE 
    WHEN p.username = u.raw_user_meta_data->>'username' THEN '✅ PERFECT MATCH'
    WHEN p.username = split_part(u.email, '@', 1) THEN '✅ EMAIL PREFIX (OK)'
    WHEN p.username = 'CalcioFan2024' THEN '❌ DEFAULT (fix needed)'
    ELSE '⚠️ CUSTOM (check if correct)'
  END as match_status
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 10;

-- ============================================
-- TEST 3: Count Issues
-- ============================================

SELECT 
  '=== TEST 3: Issue Count ===' as test_name,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN username = 'CalcioFan2024' THEN 1 END) as default_usernames,
  COUNT(CASE WHEN username IS NULL THEN 1 END) as null_usernames,
  COUNT(CASE WHEN username != 'CalcioFan2024' AND username IS NOT NULL THEN 1 END) as unique_usernames,
  CASE 
    WHEN COUNT(CASE WHEN username = 'CalcioFan2024' OR username IS NULL THEN 1 END) = 0 
    THEN '✅ ALL GOOD!'
    ELSE '❌ FIX NEEDED'
  END as overall_status
FROM profiles;

-- ============================================
-- TEST 4: Trigger Check
-- ============================================

SELECT 
  '=== TEST 4: Trigger Status ===' as test_name,
  trigger_name,
  event_object_table,
  action_timing,
  CASE 
    WHEN trigger_name = 'on_auth_user_created' THEN '✅ TRIGGER EXISTS'
    ELSE '❌ TRIGGER MISSING'
  END as status
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- TEST 5: Recent Users Check
-- ============================================

SELECT 
  '=== TEST 5: Recent Users (Last 24h) ===' as test_name,
  p.email,
  p.username,
  p.created_at,
  CASE 
    WHEN p.username != 'CalcioFan2024' AND p.username IS NOT NULL THEN '✅ GOOD'
    ELSE '❌ ISSUE'
  END as status
FROM profiles p
WHERE p.created_at > NOW() - INTERVAL '24 hours'
ORDER BY p.created_at DESC;

-- ============================================
-- SUMMARY & RECOMMENDATIONS
-- ============================================

DO $$ 
DECLARE
  total_count integer;
  issue_count integer;
  trigger_exists boolean;
BEGIN
  -- Count issues
  SELECT COUNT(*) INTO total_count FROM profiles;
  SELECT COUNT(*) INTO issue_count FROM profiles 
  WHERE username = 'CalcioFan2024' OR username IS NULL;
  
  -- Check trigger
  SELECT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
  ) INTO trigger_exists;
  
  RAISE NOTICE '==========================================================';
  RAISE NOTICE '📊 TEST SUMMARY';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Total Profiles: %', total_count;
  RAISE NOTICE 'Profiles with Issues: %', issue_count;
  RAISE NOTICE 'Trigger Status: %', CASE WHEN trigger_exists THEN '✅ Active' ELSE '❌ Missing' END;
  RAISE NOTICE '';
  
  IF issue_count > 0 THEN
    RAISE NOTICE '❌ ACTION REQUIRED:';
    RAISE NOTICE '';
    RAISE NOTICE '1. Run: /FIX_USERNAME_UPDATE.sql';
    RAISE NOTICE '   → Updates % profiles to correct usernames', issue_count;
    RAISE NOTICE '';
  END IF;
  
  IF NOT trigger_exists THEN
    RAISE NOTICE '❌ TRIGGER MISSING:';
    RAISE NOTICE '';
    RAISE NOTICE '2. Run: /SIGNUP_FIX_COMPLETE.sql';
    RAISE NOTICE '   → Recreates trigger for new signups';
    RAISE NOTICE '';
  END IF;
  
  IF issue_count = 0 AND trigger_exists THEN
    RAISE NOTICE '✅✅✅ ALL TESTS PASSED! ✅✅✅';
    RAISE NOTICE '';
    RAISE NOTICE 'Everything is working correctly!';
    RAISE NOTICE 'New signups will get correct usernames.';
    RAISE NOTICE 'Existing users have correct usernames.';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '==========================================================';
END $$;

-- ============================================
-- END
-- ============================================
