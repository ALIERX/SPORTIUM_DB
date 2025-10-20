-- ============================================
-- ADD MISSING FOREIGN KEYS
-- ============================================
-- Aggiunge foreign keys mancanti per migliorare
-- l'integrità del database e permettere join automatici
-- ============================================

-- ============================================
-- 1. Add Foreign Key: transactions -> profiles
-- ============================================

-- Check if foreign key already exists
DO $$ 
BEGIN
  -- Add foreign key if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'transactions_user_id_fkey'
    AND table_name = 'transactions'
  ) THEN
    -- Add foreign key
    ALTER TABLE transactions
    ADD CONSTRAINT transactions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Added foreign key: transactions.user_id -> profiles.id';
  ELSE
    RAISE NOTICE 'Foreign key transactions.user_id -> profiles.id already exists';
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- ============================================
-- 2. Verify Other Important Foreign Keys
-- ============================================

-- Wallets -> Profiles (should already exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'wallets_user_id_fkey'
    AND table_name = 'wallets'
  ) THEN
    ALTER TABLE wallets
    ADD CONSTRAINT wallets_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Added foreign key: wallets.user_id -> profiles.id';
  END IF;
END $$;

-- Bids -> Profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'bids_user_id_fkey'
    AND table_name = 'bids'
  ) THEN
    ALTER TABLE bids
    ADD CONSTRAINT bids_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Added foreign key: bids.user_id -> profiles.id';
  END IF;
END $$;

-- Bids -> Auctions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'bids_auction_id_fkey'
    AND table_name = 'bids'
  ) THEN
    ALTER TABLE bids
    ADD CONSTRAINT bids_auction_id_fkey
    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Added foreign key: bids.auction_id -> auctions.id';
  END IF;
END $$;

-- ============================================
-- 3. Add Indexes for Foreign Keys (if missing)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_user_id ON bids(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_auctions_created_by ON auctions(created_by);

-- ============================================
-- 4. Verify All Foreign Keys
-- ============================================

DO $$ 
DECLARE
  fk_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO fk_count
  FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY'
  AND table_schema = 'public'
  AND table_name IN ('transactions', 'wallets', 'bids', 'auctions', 'quizzes', 'rewards');
  
  RAISE NOTICE 'Total foreign keys in main tables: %', fk_count;
END $$;

-- ============================================
-- Success Message
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Foreign Keys Migration Complete!';
  RAISE NOTICE '';
  RAISE NOTICE 'Added/Verified:';
  RAISE NOTICE '- transactions.user_id -> profiles.id';
  RAISE NOTICE '- wallets.user_id -> profiles.id';
  RAISE NOTICE '- bids.user_id -> profiles.id';
  RAISE NOTICE '- bids.auction_id -> auctions.id';
  RAISE NOTICE '';
  RAISE NOTICE 'Indexes created for better performance';
  RAISE NOTICE '';
  RAISE NOTICE 'Admin transactions endpoint should now work!';
END $$;
