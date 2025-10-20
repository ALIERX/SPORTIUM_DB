/**
 * SPORTIUM - Complete Server Endpoints
 * 
 * AGGIUNGI QUESTI ENDPOINT al tuo index.tsx per funzionalità complete:
 * - Quiz
 * - Leaderboard
 * - Rewards
 * - Daily Challenges
 * - Achievements
 * - Referrals
 * 
 * Copia e incolla alla fine del tuo index.tsx (prima di Deno.serve)
 */

// ============================================
// QUIZ ROUTES
// ============================================

/**
 * Get random quiz questions
 */
app.get("/make-server-81e425c4/quiz/questions", async (c) => {
  try {
    const category = c.req.query('category') || 'serie_a';
    const difficulty = c.req.query('difficulty');
    const limit = parseInt(c.req.query('limit') || '10');

    let query = supabase
      .from('quiz_questions')
      .select('*')
      .eq('category', category)
      .eq('active', true);

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data: questions, error } = await query
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    // Randomize order
    const shuffled = (questions || []).sort(() => Math.random() - 0.5);

    return c.json({ questions: shuffled });
  } catch (error: any) {
    console.error('Get quiz questions error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Submit quiz answer
 */
app.post("/make-server-81e425c4/quiz/submit", async (c) => {
  try {
    const { question_id, selected_answer, time_taken } = await c.req.json();
    
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get question
    const { data: question } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('id', question_id)
      .single();

    if (!question) {
      return c.json({ error: 'Question not found' }, 404);
    }

    const isCorrect = selected_answer === question.correct_answer;
    const pointsEarned = isCorrect ? question.points_reward : 0;

    // Create attempt
    await supabase
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        question_id,
        selected_answer,
        is_correct: isCorrect,
        points_earned: pointsEarned,
        time_taken,
      });

    // Update wallet if correct
    if (isCorrect && pointsEarned > 0) {
      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (wallet) {
        await supabase
          .from('wallets')
          .update({
            balance_points: wallet.balance_points + pointsEarned,
            total_earned: wallet.total_earned + pointsEarned,
          })
          .eq('user_id', user.id);

        // Create transaction
        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            type: 'reward',
            amount: pointsEarned,
            description: `Quiz reward: ${question.question.substring(0, 50)}...`,
            reference_id: question_id,
            reference_type: 'quiz',
          });
      }

      // Notification
      await createNotification(
        user.id,
        'reward',
        '✅ Risposta Corretta!',
        `Hai guadagnato ${pointsEarned} FP!`,
        question_id,
        'quiz'
      );
    }

    // Update leaderboard
    await updateLeaderboard(user.id, 'quiz', pointsEarned);

    return c.json({ 
      correct: isCorrect, 
      points_earned: pointsEarned,
      correct_answer: question.correct_answer,
    });
  } catch (error: any) {
    console.error('Submit quiz error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get user quiz stats
 */
app.get("/make-server-81e425c4/quiz/stats/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');

    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId);

    const total = attempts?.length || 0;
    const correct = attempts?.filter(a => a.is_correct).length || 0;
    const totalPoints = attempts?.reduce((sum, a) => sum + (a.points_earned || 0), 0) || 0;

    return c.json({
      total_attempts: total,
      correct_answers: correct,
      accuracy: total > 0 ? (correct / total * 100).toFixed(1) : 0,
      total_points: totalPoints,
    });
  } catch (error: any) {
    console.error('Get quiz stats error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// LEADERBOARD ROUTES
// ============================================

/**
 * Get leaderboard
 */
app.get("/make-server-81e425c4/leaderboard/:category/:period", async (c) => {
  try {
    const category = c.req.param('category'); // 'quiz', 'overall', 'auctions', etc.
    const period = c.req.param('period'); // 'daily', 'weekly', 'monthly', 'all_time'
    const limit = parseInt(c.req.query('limit') || '100');

    const { data: entries, error } = await supabase
      .from('leaderboard_entries')
      .select(`
        *,
        profiles (username, avatar_url, level)
      `)
      .eq('category', category)
      .eq('period', period)
      .order('rank', { ascending: true })
      .limit(limit);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ leaderboard: entries || [] });
  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Update leaderboard (helper function)
 */
async function updateLeaderboard(userId: string, category: string, scoreToAdd: number) {
  try {
    const periods = ['daily', 'weekly', 'monthly', 'all_time'];

    for (const period of periods) {
      // Get or create entry
      const { data: entry } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .eq('period', period)
        .single();

      if (entry) {
        // Update existing
        await supabase
          .from('leaderboard_entries')
          .update({ score: entry.score + scoreToAdd })
          .eq('id', entry.id);
      } else {
        // Create new
        await supabase
          .from('leaderboard_entries')
          .insert({
            user_id: userId,
            category,
            period,
            score: scoreToAdd,
          });
      }
    }

    // Recalculate ranks for all periods
    for (const period of periods) {
      const { data: allEntries } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .eq('category', category)
        .eq('period', period)
        .order('score', { ascending: false });

      if (allEntries) {
        for (let i = 0; i < allEntries.length; i++) {
          await supabase
            .from('leaderboard_entries')
            .update({ rank: i + 1 })
            .eq('id', allEntries[i].id);
        }
      }
    }
  } catch (error) {
    console.error('Update leaderboard error:', error);
  }
}

// ============================================
// REWARDS ROUTES
// ============================================

/**
 * Get all rewards
 */
app.get("/make-server-81e425c4/rewards", async (c) => {
  try {
    const category = c.req.query('category');

    let query = supabase
      .from('rewards')
      .select('*')
      .eq('active', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: rewards, error } = await query
      .order('cost_points', { ascending: true });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ rewards: rewards || [] });
  } catch (error: any) {
    console.error('Get rewards error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Redeem reward
 */
app.post("/make-server-81e425c4/rewards/:id/redeem", async (c) => {
  try {
    const rewardId = c.req.param('id');
    const { delivery_info } = await c.req.json();
    
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get reward
    const { data: reward } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .eq('active', true)
      .single();

    if (!reward) {
      return c.json({ error: 'Reward not found or inactive' }, 404);
    }

    // Check stock
    if (reward.stock_remaining !== null && reward.stock_remaining <= 0) {
      return c.json({ error: 'Out of stock' }, 400);
    }

    // Check wallet
    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!wallet || wallet.balance_points < reward.cost_points) {
      return c.json({ error: 'Insufficient Fans Points' }, 400);
    }

    // Create redemption
    const { data: redemption, error: redemptionError } = await supabase
      .from('reward_redemptions')
      .insert({
        user_id: user.id,
        reward_id: rewardId,
        points_spent: reward.cost_points,
        delivery_info,
        status: 'pending',
      })
      .select()
      .single();

    if (redemptionError) {
      return c.json({ error: redemptionError.message }, 400);
    }

    // Deduct from wallet
    await supabase
      .from('wallets')
      .update({
        balance_points: wallet.balance_points - reward.cost_points,
        total_spent: wallet.total_spent + reward.cost_points,
      })
      .eq('user_id', user.id);

    // Create transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'spend',
        amount: -reward.cost_points,
        description: `Redeemed: ${reward.title}`,
        reference_id: rewardId,
        reference_type: 'reward',
      });

    // Update stock
    if (reward.stock_remaining !== null) {
      await supabase
        .from('rewards')
        .update({ stock_remaining: reward.stock_remaining - 1 })
        .eq('id', rewardId);
    }

    // Notification
    await createNotification(
      user.id,
      'reward',
      '🎁 Premio Riscattato!',
      `Hai riscattato: ${reward.title}`,
      rewardId,
      'reward'
    );

    return c.json({ success: true, redemption });
  } catch (error: any) {
    console.error('Redeem reward error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get user redemptions
 */
app.get("/make-server-81e425c4/rewards/redemptions/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');

    const { data: redemptions, error } = await supabase
      .from('reward_redemptions')
      .select(`
        *,
        rewards (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ redemptions: redemptions || [] });
  } catch (error: any) {
    console.error('Get redemptions error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// DAILY CHALLENGES ROUTES
// ============================================

/**
 * Get today's challenges
 */
app.get("/make-server-81e425c4/challenges/today", async (c) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: challenges, error } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('active_date', today)
      .eq('active', true);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ challenges: challenges || [] });
  } catch (error: any) {
    console.error('Get today challenges error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get user challenge progress
 */
app.get("/make-server-81e425c4/challenges/progress/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');

    const { data: completions, error } = await supabase
      .from('challenge_completions')
      .select(`
        *,
        daily_challenges (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ completions: completions || [] });
  } catch (error: any) {
    console.error('Get challenge progress error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Complete challenge
 */
app.post("/make-server-81e425c4/challenges/:id/complete", async (c) => {
  try {
    const challengeId = c.req.param('id');
    
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get challenge
    const { data: challenge } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('id', challengeId)
      .eq('active', true)
      .single();

    if (!challenge) {
      return c.json({ error: 'Challenge not found' }, 404);
    }

    // Check if already completed
    const { data: existing } = await supabase
      .from('challenge_completions')
      .select('*')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .eq('completed', true)
      .single();

    if (existing) {
      return c.json({ error: 'Challenge already completed' }, 400);
    }

    // Mark as completed
    const { data: completion, error: completionError } = await supabase
      .from('challenge_completions')
      .upsert({
        user_id: user.id,
        challenge_id: challengeId,
        progress: 100,
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (completionError) {
      return c.json({ error: completionError.message }, 400);
    }

    // Reward points
    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (wallet) {
      await supabase
        .from('wallets')
        .update({
          balance_points: wallet.balance_points + challenge.points_reward,
          total_earned: wallet.total_earned + challenge.points_reward,
        })
        .eq('user_id', user.id);

      // Transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'reward',
          amount: challenge.points_reward,
          description: `Challenge completed: ${challenge.title}`,
          reference_id: challengeId,
          reference_type: 'challenge',
        });
    }

    // Notification
    await createNotification(
      user.id,
      'achievement',
      '✅ Sfida Completata!',
      `Hai completato "${challenge.title}" e guadagnato ${challenge.points_reward} FP!`,
      challengeId,
      'challenge'
    );

    return c.json({ success: true, completion, points_earned: challenge.points_reward });
  } catch (error: any) {
    console.error('Complete challenge error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// ACHIEVEMENTS ROUTES
// ============================================

/**
 * Get all achievements
 */
app.get("/make-server-81e425c4/achievements", async (c) => {
  try {
    const { data: achievements, error } = await supabase
      .from('achievements')
      .select('*')
      .order('requirement_value', { ascending: true });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ achievements: achievements || [] });
  } catch (error: any) {
    console.error('Get achievements error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get user achievements
 */
app.get("/make-server-81e425c4/achievements/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');

    const { data: userAchievements, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ achievements: userAchievements || [] });
  } catch (error: any) {
    console.error('Get user achievements error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// REFERRAL ROUTES
// ============================================

/**
 * Get user referrals
 */
app.get("/make-server-81e425c4/referrals/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');

    const { data: referrals, error } = await supabase
      .from('referrals')
      .select(`
        *,
        profiles!referred_id (username, avatar_url)
      `)
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    const total = referrals?.length || 0;
    const completed = referrals?.filter(r => r.status === 'completed').length || 0;
    const totalEarned = referrals?.reduce((sum, r) => sum + (r.points_awarded || 0), 0) || 0;

    return c.json({ 
      referrals: referrals || [],
      stats: {
        total,
        completed,
        total_earned: totalEarned,
      }
    });
  } catch (error: any) {
    console.error('Get referrals error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Create referral
 */
app.post("/make-server-81e425c4/referrals/create", async (c) => {
  try {
    const { referred_email } = await c.req.json();
    
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if referred user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const referredUser = existingUsers?.users?.find(u => u.email === referred_email);

    if (!referredUser) {
      return c.json({ error: 'Referred user not found' }, 404);
    }

    // Create referral
    const { data: referral, error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: user.id,
        referred_id: referredUser.id,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, referral });
  } catch (error: any) {
    console.error('Create referral error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// FINE - Copia tutto sopra nel tuo index.tsx
// ============================================
