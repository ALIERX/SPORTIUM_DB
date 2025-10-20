-- ============================================
-- DEBUG USERNAME - Diagnosi Problema
-- ============================================
-- Controlla perché tutti gli utenti hanno
-- username "CalcioFan2024"
-- ============================================

-- ============================================
-- 1. Check Profiles Table
-- ============================================

SELECT 
  '=== CURRENT PROFILES ===' as info,
  id,
  email,
  username,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 2. Check Auth Users Metadata
-- ============================================

-- This will show what's in auth.users metadata
SELECT 
  '=== AUTH USERS METADATA ===' as info,
  id,
  email,
  raw_user_meta_data,
  raw_user_meta_data->>'username' as extracted_username,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 3. Compare: Profiles vs Auth Metadata
-- ============================================

SELECT 
  '=== MISMATCH CHECK ===' as info,
  p.email,
  p.username as profile_username,
  u.raw_user_meta_data->>'username' as metadata_username,
  CASE 
    WHEN p.username != COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1))
    THEN '❌ MISMATCH'
    ELSE '✅ OK'
  END as status
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 20;

-- ============================================
-- 4. Count Users with Default Username
-- ============================================

SELECT 
  '=== USERS WITH CALCIO FAN ===' as info,
  COUNT(*) as count
FROM profiles
WHERE username LIKE '%Calcio%' OR username LIKE '%Fan%';

-- ============================================
-- 5. Check Trigger Status
-- ============================================

SELECT 
  '=== TRIGGER CHECK ===' as info,
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- DIAGNOSIS
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'DIAGNOSI USERNAME';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Controlla i risultati sopra:';
  RAISE NOTICE '';
  RAISE NOTICE '1. Se metadata_username è NULL → il server non sta salvando username';
  RAISE NOTICE '2. Se metadata_username è OK ma profile_username è sbagliato → trigger problema';
  RAISE NOTICE '3. Se entrambi NULL → utenti creati prima del fix';
  RAISE NOTICE '';
  RAISE NOTICE '==========================================================';
END $$;

-- ============================================
-- END
-- ============================================
