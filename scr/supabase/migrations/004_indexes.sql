-- ============================================
-- SPORTIUM - Performance Indexes
-- Optimize queries for production
-- ============================================

-- ============================================
-- PROFILES INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp DESC);

-- ============================================
-- WALLETS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_balance ON public.wallets(balance_points DESC);

-- ============================================
-- TRANSACTIONS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON public.transactions(reference_id, reference_type);

-- Composite index for user transaction history
CREATE INDEX IF NOT EXISTS idx_transactions_user_date 
  ON public.transactions(user_id, created_at DESC);

-- ============================================
-- AUCTIONS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_auctions_status ON public.auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON public.auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_auctions_category ON public.auctions(category);
CREATE INDEX IF NOT EXISTS idx_auctions_created_by ON public.auctions(created_by);
CREATE INDEX IF NOT EXISTS idx_auctions_winner_id ON public.auctions(winner_id);

-- Composite index for active auctions by end time
CREATE INDEX IF NOT EXISTS idx_auctions_active_ending 
  ON public.auctions(status, end_time) 
  WHERE status = 'active';

-- Composite index for category + status
CREATE INDEX IF NOT EXISTS idx_auctions_category_status 
  ON public.auctions(category, status);

-- ============================================
-- BIDS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON public.bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_user_id ON public.bids(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON public.bids(status);
CREATE INDEX IF NOT EXISTS idx_bids_amount ON public.bids(amount DESC);
CREATE INDEX IF NOT EXISTS idx_bids_created_at ON public.bids(created_at DESC);

-- Composite index for auction bids ordered by amount
CREATE INDEX IF NOT EXISTS idx_bids_auction_amount 
  ON public.bids(auction_id, amount DESC);

-- Composite index for user's active bids
CREATE INDEX IF NOT EXISTS idx_bids_user_status 
  ON public.bids(user_id, status) 
  WHERE status IN ('active', 'won');

-- ============================================
-- NOTIFICATIONS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Composite index for unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications(user_id, created_at DESC) 
  WHERE read = false;

-- ============================================
-- QUIZ QUESTIONS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON public.quiz_questions(category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON public.quiz_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_active ON public.quiz_questions(active);

-- Composite index for active questions by category
CREATE INDEX IF NOT EXISTS idx_quiz_questions_active_category 
  ON public.quiz_questions(category, difficulty) 
  WHERE active = true;

-- ============================================
-- QUIZ ATTEMPTS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_question_id ON public.quiz_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_is_correct ON public.quiz_attempts(is_correct);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at ON public.quiz_attempts(created_at DESC);

-- Composite index for user quiz stats
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_correct 
  ON public.quiz_attempts(user_id, is_correct, created_at DESC);

-- ============================================
-- USER ACHIEVEMENTS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON public.user_achievements(unlocked_at DESC);

-- ============================================
-- LEADERBOARD INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_leaderboard_category ON public.leaderboard_entries(category);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON public.leaderboard_entries(period);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.leaderboard_entries(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON public.leaderboard_entries(rank);

-- Composite index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_category_period_rank 
  ON public.leaderboard_entries(category, period, rank);

-- ============================================
-- DAILY CHALLENGES INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_challenges_active_date ON public.daily_challenges(active_date);
CREATE INDEX IF NOT EXISTS idx_challenges_active ON public.daily_challenges(active);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON public.daily_challenges(type);

-- Composite index for today's active challenges
CREATE INDEX IF NOT EXISTS idx_challenges_today 
  ON public.daily_challenges(active_date, active) 
  WHERE active = true;

-- ============================================
-- CHALLENGE COMPLETIONS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_completions_user_id ON public.challenge_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_challenge_id ON public.challenge_completions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_completions_completed ON public.challenge_completions(completed);

-- Composite index for user's active challenges
CREATE INDEX IF NOT EXISTS idx_completions_user_active 
  ON public.challenge_completions(user_id, completed, created_at DESC);

-- ============================================
-- REFERRALS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);

-- ============================================
-- REWARDS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_rewards_category ON public.rewards(category);
CREATE INDEX IF NOT EXISTS idx_rewards_active ON public.rewards(active);
CREATE INDEX IF NOT EXISTS idx_rewards_cost ON public.rewards(cost_points);

-- Composite index for available rewards
CREATE INDEX IF NOT EXISTS idx_rewards_available 
  ON public.rewards(category, cost_points) 
  WHERE active = true;

-- ============================================
-- REWARD REDEMPTIONS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON public.reward_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_reward_id ON public.reward_redemptions(reward_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON public.reward_redemptions(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_created_at ON public.reward_redemptions(created_at DESC);

-- ============================================
-- PREDICTIONS INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON public.predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON public.predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_predictions_result ON public.predictions(result);
CREATE INDEX IF NOT EXISTS idx_predictions_match_date ON public.predictions(match_date);

-- Composite index for user prediction history
CREATE INDEX IF NOT EXISTS idx_predictions_user_result 
  ON public.predictions(user_id, result, match_date DESC);

-- ============================================
-- ANALYZE TABLES FOR QUERY PLANNER
-- ============================================
ANALYZE public.profiles;
ANALYZE public.wallets;
ANALYZE public.transactions;
ANALYZE public.auctions;
ANALYZE public.bids;
ANALYZE public.notifications;
ANALYZE public.quiz_questions;
ANALYZE public.quiz_attempts;
ANALYZE public.achievements;
ANALYZE public.user_achievements;
ANALYZE public.leaderboard_entries;
ANALYZE public.daily_challenges;
ANALYZE public.challenge_completions;
ANALYZE public.referrals;
ANALYZE public.rewards;
ANALYZE public.reward_redemptions;
ANALYZE public.predictions;

-- ============================================
-- COMPLETED!
-- ============================================
-- All indexes created for optimal performance
-- Database is production-ready!
