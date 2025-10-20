-- ============================================
-- SPORTIUM - Verify Signup Fix
-- ============================================
-- Run questo DOPO aver eseguito SIGNUP_FIX_COMPLETE.sql
-- per verificare che tutto sia a posto
-- ============================================

-- ============================================
-- 1. Check Wallets Table Schema
-- ============================================

SELECT 
  '=== WALLETS SCHEMA ===' as check_name,
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'wallets'
ORDER BY ordinal_position;

-- Expected columns:
-- id, user_id, balance_points, total_earned, total_spent, created_at, updated_at

-- ============================================
-- 2. Check Trigger Exists
-- ============================================

SELECT 
  '=== TRIGGER CHECK ===' as check_name,
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Expected: trigger_name = 'on_auth_user_created'

-- ============================================
-- 3. Check Trigger Function Exists
-- ============================================

SELECT 
  '=== FUNCTION CHECK ===' as check_name,
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
  AND routine_schema = 'public';

-- Expected: routine_name = 'handle_new_user'

-- ============================================
-- 4. Count Existing Users
-- ============================================

SELECT 
  '=== USER COUNTS ===' as check_name,
  (SELECT COUNT(*) FROM auth.users) as total_auth_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  (SELECT COUNT(*) FROM wallets) as total_wallets;

-- profiles and wallets should match auth.users

-- ============================================
-- 5. Check for Users Without Wallets
-- ============================================

SELECT 
  '=== USERS WITHOUT WALLETS ===' as check_name,
  p.id,
  p.email,
  p.username
FROM profiles p
LEFT JOIN wallets w ON p.id = w.user_id
WHERE w.id IS NULL;

-- Should be empty (0 rows)
-- If you see rows here, those users need wallets created manually

-- ============================================
-- 6. Sample Wallet Data
-- ============================================

SELECT 
  '=== SAMPLE WALLETS ===' as check_name,
  w.user_id,
  p.email,
  w.balance_points,
  w.total_earned,
  w.total_spent,
  w.created_at
FROM wallets w
JOIN profiles p ON w.user_id = p.id
LIMIT 5;

-- Check that total_earned and total_spent columns exist and have values

-- ============================================
-- 7. Check Default Values
-- ============================================

SELECT 
  '=== DEFAULT VALUES ===' as check_name,
  column_name,
  column_default
FROM information_schema.columns
WHERE table_name = 'wallets'
  AND column_name IN ('balance_points', 'total_earned', 'total_spent');

-- All should have DEFAULT 0

-- ============================================
-- SUCCESS CRITERIA
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '==========================================================';
  RAISE NOTICE '✅ VERIFICATION COMPLETE';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'Check the results above:';
  RAISE NOTICE '';
  RAISE NOTICE '✓ wallets table has: balance_points, total_earned, total_spent';
  RAISE NOTICE '✓ Trigger "on_auth_user_created" exists';
  RAISE NOTICE '✓ Function "handle_new_user" exists';
  RAISE NOTICE '✓ All users have wallets';
  RAISE NOTICE '';
  RAISE NOTICE 'If all checks pass, try signup now!';
  RAISE NOTICE '==========================================================';
END $$;

-- ============================================
-- END
-- ============================================
