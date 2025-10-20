-- ============================================
-- PARTNER SYSTEM - Squadre che Creano Contenuti
-- ============================================
-- Permette alle squadre di registrarsi come partner
-- e creare quiz, aste, e premi per i loro fans
-- ============================================

-- ============================================
-- 1. Add Role Column to Profiles
-- ============================================

-- Add role column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'partner', 'admin'));

-- Add partner info columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS partner_name text,
ADD COLUMN IF NOT EXISTS partner_description text,
ADD COLUMN IF NOT EXISTS partner_logo_url text,
ADD COLUMN IF NOT EXISTS partner_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS partner_request_status text CHECK (partner_request_status IN ('pending', 'approved', 'rejected', NULL)),
ADD COLUMN IF NOT EXISTS partner_requested_at timestamptz;

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_partner_status ON profiles(partner_request_status) WHERE partner_request_status IS NOT NULL;

-- ============================================
-- 2. Add Created By to Existing Tables
-- ============================================

-- Auctions - track who created it
ALTER TABLE auctions
ADD COLUMN IF NOT EXISTS created_by_partner_id uuid REFERENCES profiles(id);

-- Add index
CREATE INDEX IF NOT EXISTS idx_auctions_partner ON auctions(created_by_partner_id) WHERE created_by_partner_id IS NOT NULL;

-- ============================================
-- 3. Create Quiz System for Partners
-- ============================================

CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text DEFAULT 'general',
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  points_reward integer DEFAULT 100,
  time_limit_seconds integer DEFAULT 300,
  status text CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  max_attempts integer DEFAULT 1,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text text NOT NULL,
  question_type text CHECK (question_type IN ('multiple_choice', 'true_false', 'text')) DEFAULT 'multiple_choice',
  correct_answer text NOT NULL,
  options jsonb, -- Array of options for multiple choice
  points integer DEFAULT 10,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Quiz attempts (user submissions)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score integer DEFAULT 0,
  max_score integer NOT NULL,
  answers jsonb, -- User's answers
  completed_at timestamptz DEFAULT now(),
  time_taken_seconds integer,
  points_earned integer DEFAULT 0,
  UNIQUE(quiz_id, user_id) -- One attempt per user per quiz (if max_attempts = 1)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quizzes(created_by);
CREATE INDEX IF NOT EXISTS idx_quizzes_status ON quizzes(status);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- ============================================
-- 4. Create Rewards System for Partners
-- ============================================

CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text DEFAULT 'merchandise',
  points_cost integer NOT NULL,
  quantity_available integer DEFAULT 1,
  quantity_claimed integer DEFAULT 0,
  status text CHECK (status IN ('active', 'inactive', 'sold_out')) DEFAULT 'active',
  image_url text,
  terms_conditions text,
  expiry_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reward claims (users redeeming rewards)
CREATE TABLE IF NOT EXISTS reward_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id uuid REFERENCES rewards(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  claimed_at timestamptz DEFAULT now(),
  status text CHECK (status IN ('pending', 'approved', 'delivered', 'cancelled')) DEFAULT 'pending',
  delivery_info jsonb,
  notes text
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rewards_created_by ON rewards(created_by);
CREATE INDEX IF NOT EXISTS idx_rewards_status ON rewards(status);
CREATE INDEX IF NOT EXISTS idx_reward_claims_user ON reward_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_claims_reward ON reward_claims(reward_id);

-- ============================================
-- 5. RLS Policies for Partner System
-- ============================================

-- Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;

-- Quizzes Policies
CREATE POLICY "Public can view published quizzes"
  ON quizzes FOR SELECT
  USING (status = 'published');

CREATE POLICY "Partners can manage their quizzes"
  ON quizzes FOR ALL
  USING (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('partner', 'admin')
    )
  );

CREATE POLICY "Admins can manage all quizzes"
  ON quizzes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Quiz Questions Policies
CREATE POLICY "Public can view questions of published quizzes"
  ON quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE id = quiz_questions.quiz_id
      AND status = 'published'
    )
  );

CREATE POLICY "Partners can manage their quiz questions"
  ON quiz_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE id = quiz_questions.quiz_id
      AND created_by = auth.uid()
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('partner', 'admin')
      )
    )
  );

-- Quiz Attempts Policies
CREATE POLICY "Users can view their own attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Partners can view attempts on their quizzes"
  ON quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE id = quiz_attempts.quiz_id
      AND created_by = auth.uid()
    )
  );

-- Rewards Policies
CREATE POLICY "Public can view active rewards"
  ON rewards FOR SELECT
  USING (status = 'active');

CREATE POLICY "Partners can manage their rewards"
  ON rewards FOR ALL
  USING (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('partner', 'admin')
    )
  );

-- Reward Claims Policies
CREATE POLICY "Users can view their own claims"
  ON reward_claims FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim rewards"
  ON reward_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Partners can view claims on their rewards"
  ON reward_claims FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rewards
      WHERE id = reward_claims.reward_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Partners can update claims on their rewards"
  ON reward_claims FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM rewards
      WHERE id = reward_claims.reward_id
      AND created_by = auth.uid()
    )
  );

-- ============================================
-- 6. Functions
-- ============================================

-- Function to request partner status
CREATE OR REPLACE FUNCTION request_partner_status(
  p_partner_name text,
  p_partner_description text,
  p_partner_logo_url text DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Update profile with partner request
  UPDATE profiles
  SET 
    partner_name = p_partner_name,
    partner_description = p_partner_description,
    partner_logo_url = p_partner_logo_url,
    partner_request_status = 'pending',
    partner_requested_at = now(),
    updated_at = now()
  WHERE id = v_user_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Partner request submitted successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve/reject partner request (admin only)
CREATE OR REPLACE FUNCTION update_partner_status(
  p_user_id uuid,
  p_approved boolean
) RETURNS jsonb AS $$
DECLARE
  v_admin_id uuid;
  v_new_status text;
  v_new_role text;
BEGIN
  v_admin_id := auth.uid();
  
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = v_admin_id
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can approve partner requests';
  END IF;
  
  -- Set new status and role
  IF p_approved THEN
    v_new_status := 'approved';
    v_new_role := 'partner';
  ELSE
    v_new_status := 'rejected';
    v_new_role := 'user';
  END IF;
  
  -- Update user profile
  UPDATE profiles
  SET 
    role = v_new_role,
    partner_request_status = v_new_status,
    partner_verified = p_approved,
    updated_at = now()
  WHERE id = p_user_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', CASE 
      WHEN p_approved THEN 'Partner approved successfully'
      ELSE 'Partner request rejected'
    END,
    'new_role', v_new_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. Triggers
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update reward quantity when claimed
CREATE OR REPLACE FUNCTION update_reward_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE rewards
    SET 
      quantity_claimed = quantity_claimed + 1,
      status = CASE 
        WHEN quantity_claimed + 1 >= quantity_available THEN 'sold_out'
        ELSE status
      END
    WHERE id = NEW.reward_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reward_claim
  AFTER INSERT ON reward_claims
  FOR EACH ROW
  EXECUTE FUNCTION update_reward_quantity();

-- ============================================
-- 8. Comments
-- ============================================

COMMENT ON TABLE quizzes IS 'Partner-created quizzes for fan engagement';
COMMENT ON TABLE quiz_questions IS 'Questions for quizzes';
COMMENT ON TABLE quiz_attempts IS 'User attempts/submissions for quizzes';
COMMENT ON TABLE rewards IS 'Partner-created rewards that users can claim';
COMMENT ON TABLE reward_claims IS 'User claims for rewards';

COMMENT ON COLUMN profiles.role IS 'User role: user (fan), partner (team), or admin';
COMMENT ON COLUMN profiles.partner_request_status IS 'Status of partner request: pending, approved, or rejected';

-- ============================================
-- Success Message
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Partner System Migration Complete!';
  RAISE NOTICE '';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '- Role system (user, partner, admin)';
  RAISE NOTICE '- Quizzes system with questions & attempts';
  RAISE NOTICE '- Rewards system with claims';
  RAISE NOTICE '- RLS policies for partners';
  RAISE NOTICE '- Functions for partner requests';
  RAISE NOTICE '';
  RAISE NOTICE 'Partners can now:';
  RAISE NOTICE '1. Request partner status';
  RAISE NOTICE '2. Create quizzes';
  RAISE NOTICE '3. Create rewards';
  RAISE NOTICE '4. Manage their content';
  RAISE NOTICE '';
  RAISE NOTICE 'Admins can:';
  RAISE NOTICE '1. Approve/reject partner requests';
  RAISE NOTICE '2. Manage all content';
  RAISE NOTICE '';
END $$;
