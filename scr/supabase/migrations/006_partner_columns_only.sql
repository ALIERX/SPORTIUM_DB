-- ============================================
-- PARTNER SYSTEM - Columns Only (Quick Fix)
-- ============================================
-- Aggiunge solo le colonne necessarie per il partner system
-- senza functions SQL complesse
-- ============================================

-- ============================================
-- 1. Add Partner Columns to Profiles
-- ============================================

DO $$ 
BEGIN
  -- Add role column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'partner', 'admin'));
    CREATE INDEX idx_profiles_role ON profiles(role);
    RAISE NOTICE 'Added column: role';
  ELSE
    RAISE NOTICE 'Column role already exists';
  END IF;

  -- Add partner_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'partner_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN partner_name text;
    RAISE NOTICE 'Added column: partner_name';
  ELSE
    RAISE NOTICE 'Column partner_name already exists';
  END IF;

  -- Add partner_description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'partner_description'
  ) THEN
    ALTER TABLE profiles ADD COLUMN partner_description text;
    RAISE NOTICE 'Added column: partner_description';
  ELSE
    RAISE NOTICE 'Column partner_description already exists';
  END IF;

  -- Add partner_logo_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'partner_logo_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN partner_logo_url text;
    RAISE NOTICE 'Added column: partner_logo_url';
  ELSE
    RAISE NOTICE 'Column partner_logo_url already exists';
  END IF;

  -- Add partner_verified column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'partner_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN partner_verified boolean DEFAULT false;
    RAISE NOTICE 'Added column: partner_verified';
  ELSE
    RAISE NOTICE 'Column partner_verified already exists';
  END IF;

  -- Add partner_request_status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'partner_request_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN partner_request_status text CHECK (partner_request_status IN ('pending', 'approved', 'rejected', NULL));
    CREATE INDEX idx_profiles_partner_status ON profiles(partner_request_status) WHERE partner_request_status IS NOT NULL;
    RAISE NOTICE 'Added column: partner_request_status';
  ELSE
    RAISE NOTICE 'Column partner_request_status already exists';
  END IF;

  -- Add partner_requested_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'partner_requested_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN partner_requested_at timestamptz;
    RAISE NOTICE 'Added column: partner_requested_at';
  ELSE
    RAISE NOTICE 'Column partner_requested_at already exists';
  END IF;
END $$;

-- ============================================
-- 2. Add created_by_partner_id to Auctions (Optional)
-- ============================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'auctions' AND column_name = 'created_by_partner_id'
  ) THEN
    ALTER TABLE auctions ADD COLUMN created_by_partner_id uuid REFERENCES profiles(id);
    CREATE INDEX idx_auctions_partner ON auctions(created_by_partner_id) WHERE created_by_partner_id IS NOT NULL;
    RAISE NOTICE 'Added column: created_by_partner_id to auctions';
  ELSE
    RAISE NOTICE 'Column created_by_partner_id already exists in auctions';
  END IF;
END $$;

-- ============================================
-- Success Message
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Partner Columns Migration Complete!';
  RAISE NOTICE '';
  RAISE NOTICE 'Added columns to profiles:';
  RAISE NOTICE '- role (user, partner, admin)';
  RAISE NOTICE '- partner_name';
  RAISE NOTICE '- partner_description';
  RAISE NOTICE '- partner_logo_url';
  RAISE NOTICE '- partner_verified';
  RAISE NOTICE '- partner_request_status';
  RAISE NOTICE '- partner_requested_at';
  RAISE NOTICE '';
  RAISE NOTICE 'Partner request modal should now work!';
  RAISE NOTICE '';
  RAISE NOTICE 'To enable full partner system features (quizzes, rewards):';
  RAISE NOTICE 'Run migration: 006_partner_system.sql';
END $$;
