-- ============================================
-- SPORTIUM - Complete Signup Fix
-- ============================================
-- Questo script risolve il problema:
-- "column total_earned of relation wallets does not exist"
--
-- ISTRUZIONI:
-- 1. Apri Supabase Dashboard
-- 2. Vai su SQL Editor
-- 3. Copia TUTTO questo file
-- 4. Incolla nell'editor
-- 5. Click RUN
-- 6. Test signup!
-- ============================================

-- ============================================
-- STEP 1: Verifica Schema Wallets
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '=== Checking wallets table schema ===';
END $$;

-- Check if columns exist
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'wallets'
ORDER BY ordinal_position;

-- ============================================
-- STEP 2: Add Missing Columns
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '=== Adding missing columns if needed ===';
END $$;

-- Add total_earned if missing
ALTER TABLE wallets
ADD COLUMN IF NOT EXISTS total_earned integer DEFAULT 0 NOT NULL;

-- Add total_spent if missing
ALTER TABLE wallets
ADD COLUMN IF NOT EXISTS total_spent integer DEFAULT 0 NOT NULL;

-- Ensure balance_points has correct default
ALTER TABLE wallets
ALTER COLUMN balance_points SET DEFAULT 0,
ALTER COLUMN balance_points SET NOT NULL;

-- ============================================
-- STEP 3: Drop Old Trigger (if exists)
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '=== Dropping old trigger ===';
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================
-- STEP 4: Create New Trigger Function
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '=== Creating new trigger function ===';
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_username text;
BEGIN
  -- Log start
  RAISE NOTICE 'Creating user profile for: %', NEW.email;

  -- Extract username from metadata or use email prefix
  new_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );

  RAISE NOTICE 'Using username: %', new_username;

  -- Create profile
  BEGIN
    INSERT INTO public.profiles (id, email, username)
    VALUES (NEW.id, NEW.email, new_username);
    
    RAISE NOTICE 'Profile created successfully';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating profile: %', SQLERRM;
    RAISE;
  END;

  -- Create wallet with starting balance
  BEGIN
    INSERT INTO public.wallets (
      user_id,
      balance_points,
      total_earned,
      total_spent
    )
    VALUES (
      NEW.id,
      18450,  -- Starting FP (Welcome Bonus)
      18450,  -- Total earned = welcome bonus
      0       -- Total spent = 0
    );
    
    RAISE NOTICE 'Wallet created with 18,450 FP';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating wallet: %', SQLERRM;
    RAISE;
  END;

  -- Create welcome transaction
  BEGIN
    INSERT INTO public.transactions (
      user_id,
      type,
      amount,
      description
    )
    VALUES (
      NEW.id,
      'reward',
      18450,
      '🎉 Welcome Bonus! Inizia la tua avventura su SPORTIUM!'
    );
    
    RAISE NOTICE 'Welcome transaction created';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating transaction: %', SQLERRM;
    -- Non-critical, continue
  END;

  -- Create welcome notification
  BEGIN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message
    )
    VALUES (
      NEW.id,
      'welcome',
      '🎉 Benvenuto su SPORTIUM!',
      'Hai ricevuto 18,450 Fans Points di benvenuto! Inizia a competere e vinci premi esclusivi!'
    );
    
    RAISE NOTICE 'Welcome notification created';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating notification: %', SQLERRM;
    -- Non-critical, continue
  END;

  RAISE NOTICE 'User setup completed successfully for: %', NEW.email;

  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and re-raise
    RAISE NOTICE 'FATAL ERROR in handle_new_user for %: %', NEW.email, SQLERRM;
    RAISE;
END;
$$;

-- ============================================
-- STEP 5: Create Trigger
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '=== Creating trigger ===';
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 6: Verification Queries
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '=== Verification ===';
END $$;

-- Check trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check wallets schema (final)
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'wallets'
ORDER BY ordinal_position;

-- ============================================
-- STEP 7: Success Message
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '==========================================================';
  RAISE NOTICE '✅ SIGNUP FIX COMPLETED SUCCESSFULLY!';
  RAISE NOTICE '==========================================================';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Check the output above for any errors';
  RAISE NOTICE '2. Test signup in your app';
  RAISE NOTICE '3. Check Postgres Logs for trigger execution';
  RAISE NOTICE '==========================================================';
END $$;

-- ============================================
-- BONUS: Test Queries (Run these AFTER signup)
-- ============================================

-- Uncomment and run these AFTER you test signup:

/*
-- Check if profile was created
SELECT * FROM profiles 
WHERE email = 'YOUR_TEST_EMAIL@example.com';

-- Check if wallet was created
SELECT w.* 
FROM wallets w
JOIN profiles p ON w.user_id = p.id
WHERE p.email = 'YOUR_TEST_EMAIL@example.com';

-- Check if transaction was created
SELECT t.* 
FROM transactions t
JOIN profiles p ON t.user_id = p.id
WHERE p.email = 'YOUR_TEST_EMAIL@example.com';

-- Check if notification was created
SELECT n.* 
FROM notifications n
JOIN profiles p ON n.user_id = p.id
WHERE p.email = 'YOUR_TEST_EMAIL@example.com';
*/

-- ============================================
-- END OF SCRIPT
-- ============================================
