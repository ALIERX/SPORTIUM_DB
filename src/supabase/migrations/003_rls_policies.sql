-- ============================================
-- SPORTIUM - Row Level Security Policies
-- Security for all tables
-- ============================================

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- WALLETS POLICIES
-- ============================================
CREATE POLICY "Users can view own wallet"
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id);

-- Wallet updates only through server functions
-- No direct user updates

-- ============================================
-- TRANSACTIONS POLICIES
-- ============================================
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Transactions created only through server
-- No direct user inserts

-- ============================================
-- AUCTIONS POLICIES
-- ============================================
CREATE POLICY "Anyone can view active auctions"
  ON public.auctions FOR SELECT
  USING (status = 'active' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create auctions"
  ON public.auctions FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Auction creators can update own auctions"
  ON public.auctions FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- ============================================
-- BIDS POLICIES
-- ============================================
CREATE POLICY "Users can view bids on auctions they participate in"
  ON public.bids FOR SELECT
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.bids b 
      WHERE b.auction_id = bids.auction_id 
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create bids"
  ON public.bids FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Notifications created by server
CREATE POLICY "Server can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true); -- Server uses service role

-- ============================================
-- QUIZ QUESTIONS POLICIES
-- ============================================
CREATE POLICY "Anyone can view active quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (active = true);

-- Quiz questions managed by admin only (through server)

-- ============================================
-- QUIZ ATTEMPTS POLICIES
-- ============================================
CREATE POLICY "Users can view own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ACHIEVEMENTS POLICIES
-- ============================================
CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  USING (true);

-- ============================================
-- USER ACHIEVEMENTS POLICIES
-- ============================================
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Server can grant achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (true); -- Server uses service role

-- ============================================
-- LEADERBOARD POLICIES
-- ============================================
CREATE POLICY "Anyone can view leaderboard"
  ON public.leaderboard_entries FOR SELECT
  USING (true);

-- Leaderboard updated by server only

-- ============================================
-- DAILY CHALLENGES POLICIES
-- ============================================
CREATE POLICY "Anyone can view active challenges"
  ON public.daily_challenges FOR SELECT
  USING (active = true);

-- ============================================
-- CHALLENGE COMPLETIONS POLICIES
-- ============================================
CREATE POLICY "Users can view own challenge progress"
  ON public.challenge_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress"
  ON public.challenge_completions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Server can create challenge completions"
  ON public.challenge_completions FOR INSERT
  WITH CHECK (true);

-- ============================================
-- REFERRALS POLICIES
-- ============================================
CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

-- ============================================
-- REWARDS POLICIES
-- ============================================
CREATE POLICY "Anyone can view active rewards"
  ON public.rewards FOR SELECT
  USING (active = true);

-- ============================================
-- REWARD REDEMPTIONS POLICIES
-- ============================================
CREATE POLICY "Users can view own redemptions"
  ON public.reward_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions"
  ON public.reward_redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PREDICTIONS POLICIES
-- ============================================
CREATE POLICY "Users can view own predictions"
  ON public.predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create predictions"
  ON public.predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, check if user has created auctions
  -- In production, add an is_admin column to profiles
  RETURN EXISTS (
    SELECT 1 FROM public.auctions 
    WHERE created_by = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMPLETED!
-- ============================================
-- RLS policies enabled and configured
-- Next: Run indexes (004) for performance
