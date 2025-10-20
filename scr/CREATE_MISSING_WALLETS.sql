-- ============================================
-- SPORTIUM - Create Missing Wallets
-- ============================================
-- Use questo script SOLO SE hai utenti esistenti
-- che non hanno wallet (creati prima del fix)
-- ============================================

-- ============================================
-- 1. Find Users Without Wallets
-- ============================================

SELECT 
  'Users without wallets:' as info,
  COUNT(*) as count
FROM profiles p
LEFT JOIN wallets w ON p.id = w.user_id
WHERE w.id IS NULL;

-- ============================================
-- 2. Create Wallets for Existing Users
-- ============================================

-- This will create wallets for all users who don't have one
INSERT INTO wallets (
  user_id,
  balance_points,
  total_earned,
  total_spent,
  created_at,
  updated_at
)
SELECT 
  p.id,
  18450,  -- Welcome bonus
  18450,  -- Total earned
  0,      -- Total spent
  NOW(),
  NOW()
FROM profiles p
LEFT JOIN wallets w ON p.id = w.user_id
WHERE w.id IS NULL;

-- ============================================
-- 3. Create Welcome Transactions
-- ============================================

-- Create welcome transaction for users who got wallet
INSERT INTO transactions (
  user_id,
  type,
  amount,
  description,
  created_at
)
SELECT 
  p.id,
  'reward',
  18450,
  '🎉 Welcome Bonus! Inizia la tua avventura su SPORTIUM!',
  NOW()
FROM profiles p
LEFT JOIN transactions t ON (
  t.user_id = p.id 
  AND t.description LIKE '%Welcome Bonus%'
)
WHERE t.id IS NULL
  AND EXISTS (
    SELECT 1 FROM wallets w WHERE w.user_id = p.id
  );

-- ============================================
-- 4. Create Welcome Notifications
-- ============================================

-- Create welcome notification for users
INSERT INTO notifications (
  user_id,
  type,
  title,
  message,
  read,
  created_at
)
SELECT 
  p.id,
  'welcome',
  '🎉 Benvenuto su SPORTIUM!',
  'Hai ricevuto 18,450 Fans Points di benvenuto! Inizia a competere e vinci premi esclusivi!',
  false,
  NOW()
FROM profiles p
LEFT JOIN notifications n ON (
  n.user_id = p.id 
  AND n.type = 'welcome'
)
WHERE n.id IS NULL
  AND EXISTS (
    SELECT 1 FROM wallets w WHERE w.user_id = p.id
  );

-- ============================================
-- 5. Verification
-- ============================================

SELECT 
  '=== FINAL CHECK ===' as info,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  (SELECT COUNT(*) FROM wallets) as total_wallets,
  (SELECT COUNT(*) FROM profiles p 
   LEFT JOIN wallets w ON p.id = w.user_id 
   WHERE w.id IS NULL) as profiles_without_wallet;

-- profiles_without_wallet should be 0

-- ============================================
-- 6. Success Message
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '==========================================================';
  RAISE NOTICE '✅ WALLET CREATION COMPLETE';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'All existing users now have wallets with 18,450 FP!';
  RAISE NOTICE '==========================================================';
END $$;

-- ============================================
-- END
-- ============================================
