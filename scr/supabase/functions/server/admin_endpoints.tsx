/**
 * SPORTIUM - Admin Endpoints
 * 
 * AGGIUNGI QUESTI ENDPOINT al tuo index.tsx per funzionalità admin
 * 
 * Copia e incolla alla fine del tuo index.tsx (prima di Deno.serve)
 */

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * Get admin stats overview
 */
app.get("/make-server-81e425c4/admin/stats", async (c) => {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get total auctions
    const { count: totalAuctions } = await supabase
      .from('auctions')
      .select('*', { count: 'exact', head: true });

    // Get active auctions
    const { count: activeAuctions } = await supabase
      .from('auctions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get total transactions
    const { count: totalTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    // Get wallet stats
    const { data: walletStats } = await supabase
      .from('wallets')
      .select('balance_points, total_earned, total_spent');

    const totalPointsCirculating = walletStats?.reduce((sum, w) => sum + (w.balance_points || 0), 0) || 0;
    const totalPointsEarned = walletStats?.reduce((sum, w) => sum + (w.total_earned || 0), 0) || 0;
    const totalPointsSpent = walletStats?.reduce((sum, w) => sum + (w.total_spent || 0), 0) || 0;

    return c.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalAuctions: totalAuctions || 0,
        activeAuctions: activeAuctions || 0,
        totalTransactions: totalTransactions || 0,
        totalPointsCirculating,
        totalPointsEarned,
        totalPointsSpent,
      }
    });
  } catch (error: any) {
    console.error('Get admin stats error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get all users with wallet info
 */
app.get("/make-server-81e425c4/admin/users", async (c) => {
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select(`
        *,
        wallets (balance_points, total_earned, total_spent)
      `)
      .order('created_at', { ascending: false });

    // Flatten the structure
    const users = profiles?.map(p => ({
      id: p.id,
      email: p.email,
      username: p.username,
      created_at: p.created_at,
      level: p.level,
      xp: p.xp,
      streak_days: p.streak_days,
      balance_points: p.wallets?.[0]?.balance_points || 0,
      total_earned: p.wallets?.[0]?.total_earned || 0,
      total_spent: p.wallets?.[0]?.total_spent || 0,
    })) || [];

    return c.json({ users });
  } catch (error: any) {
    console.error('Get admin users error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get all auctions with bid count
 */
app.get("/make-server-81e425c4/admin/auctions", async (c) => {
  try {
    const { data: auctions } = await supabase
      .from('auctions')
      .select(`
        *,
        bids (count)
      `)
      .order('created_at', { ascending: false });

    // Format data
    const formattedAuctions = auctions?.map(a => ({
      ...a,
      bid_count: a.bids?.[0]?.count || 0,
    })) || [];

    return c.json({ auctions: formattedAuctions });
  } catch (error: any) {
    console.error('Get admin auctions error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get all transactions
 */
app.get("/make-server-81e425c4/admin/transactions", async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '100');

    const { data: transactions } = await supabase
      .from('transactions')
      .select(`
        *,
        profiles (username)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Flatten structure
    const formattedTransactions = transactions?.map(t => ({
      ...t,
      username: t.profiles?.username,
    })) || [];

    return c.json({ transactions: formattedTransactions });
  } catch (error: any) {
    console.error('Get admin transactions error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Adjust user balance (add or subtract points)
 */
app.post("/make-server-81e425c4/admin/users/:userId/adjust-balance", async (c) => {
  try {
    const userId = c.req.param('userId');
    const { amount } = await c.req.json();

    // Get current wallet
    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!wallet) {
      return c.json({ error: 'Wallet not found' }, 404);
    }

    // Calculate new balance
    const newBalance = wallet.balance_points + amount;

    if (newBalance < 0) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    // Update wallet
    await supabase
      .from('wallets')
      .update({
        balance_points: newBalance,
        total_earned: amount > 0 ? wallet.total_earned + amount : wallet.total_earned,
        total_spent: amount < 0 ? wallet.total_spent + Math.abs(amount) : wallet.total_spent,
      })
      .eq('user_id', userId);

    // Create transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: amount > 0 ? 'reward' : 'spend',
        amount: amount,
        description: `Admin adjustment: ${amount > 0 ? '+' : ''}${amount} FP`,
      });

    // Create notification
    await createNotification(
      userId,
      'system',
      amount > 0 ? '💰 Credito Ricevuto!' : '📤 Addebito Applicato',
      `Il tuo balance è stato ${amount > 0 ? 'incrementato' : 'decrementato'} di ${Math.abs(amount).toLocaleString()} FP dall'admin.`
    );

    return c.json({ success: true, newBalance });
  } catch (error: any) {
    console.error('Adjust balance error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * End auction manually
 */
app.post("/make-server-81e425c4/admin/auctions/:auctionId/end", async (c) => {
  try {
    const auctionId = c.req.param('auctionId');

    // Get auction
    const { data: auction } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();

    if (!auction) {
      return c.json({ error: 'Auction not found' }, 404);
    }

    if (auction.status !== 'active') {
      return c.json({ error: 'Auction already ended' }, 400);
    }

    // Get winning bid
    const { data: winningBid } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .eq('status', 'active')
      .order('amount', { ascending: false })
      .limit(1)
      .single();

    // Update auction status
    await supabase
      .from('auctions')
      .update({
        status: 'completed',
        winner_id: winningBid?.user_id || null,
      })
      .eq('id', auctionId);

    // Mark winning bid
    if (winningBid) {
      await supabase
        .from('bids')
        .update({ status: 'won' })
        .eq('id', winningBid.id);

      // Notify winner
      await createNotification(
        winningBid.user_id,
        'auction_won',
        '🎉 Hai Vinto l\'Asta!',
        `Congratulazioni! Hai vinto "${auction.title}" con un'offerta di ${winningBid.amount.toLocaleString()} FP!`,
        auctionId,
        'auction'
      );
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('End auction error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Delete auction
 */
app.delete("/make-server-81e425c4/admin/auctions/:auctionId", async (c) => {
  try {
    const auctionId = c.req.param('auctionId');

    // Get auction
    const { data: auction } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();

    if (!auction) {
      return c.json({ error: 'Auction not found' }, 404);
    }

    // Get all active bids to refund
    const { data: activeBids } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .eq('status', 'active');

    // Refund all active bids
    if (activeBids && activeBids.length > 0) {
      for (const bid of activeBids) {
        // Get wallet
        const { data: wallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', bid.user_id)
          .single();

        if (wallet) {
          // Refund
          await supabase
            .from('wallets')
            .update({
              balance_points: wallet.balance_points + bid.amount,
            })
            .eq('user_id', bid.user_id);

          // Create transaction
          await supabase
            .from('transactions')
            .insert({
              user_id: bid.user_id,
              type: 'refund',
              amount: bid.amount,
              description: `Refund: Auction "${auction.title}" deleted by admin`,
              reference_id: auctionId,
              reference_type: 'auction',
            });

          // Notify
          await createNotification(
            bid.user_id,
            'system',
            '💰 Rimborso Ricevuto',
            `L'asta "${auction.title}" è stata cancellata. Hai ricevuto un rimborso di ${bid.amount.toLocaleString()} FP.`,
            auctionId,
            'auction'
          );
        }
      }
    }

    // Mark bids as refunded
    await supabase
      .from('bids')
      .update({ status: 'refunded' })
      .eq('auction_id', auctionId);

    // Delete auction
    await supabase
      .from('auctions')
      .delete()
      .eq('id', auctionId);

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Delete auction error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Ban/Unban user
 */
app.post("/make-server-81e425c4/admin/users/:userId/ban", async (c) => {
  try {
    const userId = c.req.param('userId');
    const { banned } = await c.req.json();

    // Update profile
    await supabase
      .from('profiles')
      .update({ banned: banned })
      .eq('id', userId);

    // Notify user
    if (banned) {
      await createNotification(
        userId,
        'system',
        '🚫 Account Sospeso',
        'Il tuo account è stato sospeso dagli amministratori. Contatta il supporto per maggiori informazioni.'
      );
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Ban user error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get system logs (last 100 transactions)
 */
app.get("/make-server-81e425c4/admin/logs", async (c) => {
  try {
    const { data: logs } = await supabase
      .from('transactions')
      .select(`
        *,
        profiles (username)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    return c.json({ logs: logs || [] });
  } catch (error: any) {
    console.error('Get logs error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// FINE - Copia tutto sopra nel tuo index.tsx
// ============================================
