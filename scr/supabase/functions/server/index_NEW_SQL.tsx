/**
 * SPORTIUM - Server con SQL Database
 * 
 * AGGIORNATO per usare SQL invece di KV Store per:
 * - Profiles
 * - Wallets
 * - Transactions
 * - Auctions
 * - Bids
 * - Notifications
 * 
 * KV Store usato solo per cache/sessions temporanee
 */

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase Admin Client (SERVICE_ROLE_KEY per bypass RLS)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get authenticated user from Authorization header
 */
async function getAuthUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

/**
 * Create notification for user
 */
async function createNotification(
  userId: string, 
  type: string, 
  title: string, 
  message: string,
  referenceId?: string,
  referenceType?: string
) {
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        reference_id: referenceId,
        reference_type: referenceType,
      });
  } catch (error) {
    console.error('Create notification error:', error);
  }
}

// ============================================
// HEALTH CHECK
// ============================================

app.get("/make-server-81e425c4/health", async (c) => {
  try {
    // Test SQL connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    return c.json({ 
      status: "ok", 
      sql: error ? "error" : "connected",
      kv: "available",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return c.json({ 
      status: "error", 
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// ============================================
// AUTH ROUTES
// ============================================

/**
 * Check if email exists
 */
app.post("/make-server-81e425c4/auth/check-email", async (c) => {
  try {
    const { email } = await c.req.json();
    
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const exists = existingUsers?.users?.some(u => u.email === email) || false;
    
    return c.json({ exists });
  } catch (error: any) {
    console.error('Check email error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Sign up - Creates user + auto-creates profile & wallet via trigger
 */
app.post("/make-server-81e425c4/auth/signup", async (c) => {
  try {
    const { email, password, username } = await c.req.json();

    console.log('[SIGNUP] Starting signup for:', email);

    // Check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(u => u.email === email);
    
    if (userExists) {
      return c.json({ error: 'Email already registered. Please sign in instead.' }, 400);
    }

    // Create user - Profile & Wallet created automatically via trigger!
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    });

    if (error) {
      console.error('[SIGNUP] Auth error:', error.message);
      return c.json({ error: `Signup failed: ${error.message}` }, 400);
    }

    if (!data?.user) {
      return c.json({ error: 'Failed to create user' }, 500);
    }

    console.log('[SIGNUP] ✅ User created:', data.user.id);
    console.log('[SIGNUP] ✅ Profile & Wallet auto-created by trigger');

    return c.json({ success: true, user: data.user });
    
  } catch (error: any) {
    console.error('[SIGNUP] Error:', error);
    return c.json({ error: `Signup error: ${error.message}` }, 500);
  }
});

// ============================================
// PROFILE ROUTES
// ============================================

/**
 * Get user profile with wallet
 */
app.get("/make-server-81e425c4/profile/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        wallets (*)
      `)
      .eq('id', userId)
      .single();
    
    if (error || !profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Update profile
 */
app.put("/make-server-81e425c4/profile/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const updates = await c.req.json();
    
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user || user.id !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ profile: data });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// WALLET ROUTES
// ============================================

/**
 * Get wallet
 */
app.get("/make-server-81e425c4/wallet/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !wallet) {
      return c.json({ error: 'Wallet not found' }, 404);
    }

    return c.json({ wallet });
  } catch (error: any) {
    console.error('Get wallet error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Add funds to wallet (purchases)
 */
app.post("/make-server-81e425c4/wallet/:userId/add", async (c) => {
  try {
    const userId = c.req.param('userId');
    const { amount, transaction_type, payment_method, price } = await c.req.json();
    
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user || user.id !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get current wallet
    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!wallet) {
      return c.json({ error: 'Wallet not found' }, 404);
    }

    // Update wallet
    const { data: updatedWallet, error: walletError } = await supabase
      .from('wallets')
      .update({
        balance_points: wallet.balance_points + amount,
        total_earned: wallet.total_earned + amount,
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (walletError) {
      return c.json({ error: walletError.message }, 400);
    }

    // Create transaction record
    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: transaction_type || 'purchase',
        amount: amount,
        description: `Purchased ${amount.toLocaleString()} FP via ${payment_method}`,
      });

    // Create notification
    await createNotification(
      userId,
      'reward',
      '💰 Fans Points Ricevuti!',
      `Hai ricevuto ${amount.toLocaleString()} Fans Points!`
    );

    return c.json({ success: true, wallet: updatedWallet });
  } catch (error: any) {
    console.error('Add funds error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// AUCTION ROUTES
// ============================================

/**
 * Get all active auctions
 */
app.get("/make-server-81e425c4/auctions", async (c) => {
  try {
    const { data: auctions, error } = await supabase
      .from('auctions')
      .select(`
        *,
        bids (count),
        profiles!created_by (username, avatar_url)
      `)
      .eq('status', 'active')
      .order('end_time', { ascending: true });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ auctions: auctions || [] });
  } catch (error: any) {
    console.error('Get auctions error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get single auction with all bids
 */
app.get("/make-server-81e425c4/auctions/:id", async (c) => {
  try {
    const auctionId = c.req.param('id');
    
    const { data: auction, error } = await supabase
      .from('auctions')
      .select(`
        *,
        bids (*),
        profiles!created_by (username, avatar_url)
      `)
      .eq('id', auctionId)
      .single();

    if (error || !auction) {
      return c.json({ error: 'Auction not found' }, 404);
    }

    return c.json({ auction });
  } catch (error: any) {
    console.error('Get auction error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Create auction
 */
app.post("/make-server-81e425c4/auctions/create", async (c) => {
  try {
    const { title, description, starting_bid, end_time, image_url, category } = await c.req.json();
    
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: auction, error } = await supabase
      .from('auctions')
      .insert({
        title,
        description,
        starting_bid,
        end_time,
        image_url,
        category,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ auction });
  } catch (error: any) {
    console.error('Create auction error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Place bid on auction
 */
app.post("/make-server-81e425c4/auctions/:id/bid", async (c) => {
  try {
    const auctionId = c.req.param('id');
    const { amount } = await c.req.json();
    
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get auction
    const { data: auction } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .eq('status', 'active')
      .single();

    if (!auction) {
      return c.json({ error: 'Auction not found or ended' }, 404);
    }

    // Check if auction ended
    if (new Date(auction.end_time) < new Date()) {
      return c.json({ error: 'Auction has ended' }, 400);
    }

    // Validate bid amount
    const minBid = auction.current_bid 
      ? auction.current_bid + (auction.bid_increment || 100)
      : auction.starting_bid;
    
    if (amount < minBid) {
      return c.json({ error: `Minimum bid is ${minBid.toLocaleString()} FP` }, 400);
    }

    // Check wallet balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance_points')
      .eq('user_id', user.id)
      .single();

    if (!wallet || wallet.balance_points < amount) {
      return c.json({ error: 'Insufficient Fans Points' }, 400);
    }

    // Get previous highest bidder
    const { data: previousBids } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .eq('status', 'active')
      .order('amount', { ascending: false })
      .limit(1);

    const previousBidder = previousBids?.[0];

    // Create new bid
    const { data: newBid, error: bidError } = await supabase
      .from('bids')
      .insert({
        auction_id: auctionId,
        user_id: user.id,
        amount,
        status: 'active',
      })
      .select()
      .single();

    if (bidError) {
      return c.json({ error: bidError.message }, 400);
    }

    // Update auction current_bid
    await supabase
      .from('auctions')
      .update({ current_bid: amount })
      .eq('id', auctionId);

    // Deduct from wallet
    await supabase
      .from('wallets')
      .update({ 
        balance_points: wallet.balance_points - amount,
        total_spent: (wallet.total_spent || 0) + amount,
      })
      .eq('user_id', user.id);

    // Create transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'spend',
        amount: -amount,
        description: `Bid placed on: ${auction.title}`,
        reference_id: auctionId,
        reference_type: 'auction',
      });

    // Mark previous bid as outbid & refund
    if (previousBidder && previousBidder.user_id !== user.id) {
      await supabase
        .from('bids')
        .update({ status: 'outbid' })
        .eq('id', previousBidder.id);

      // Refund previous bidder
      const { data: previousWallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', previousBidder.user_id)
        .single();

      if (previousWallet) {
        await supabase
          .from('wallets')
          .update({ 
            balance_points: previousWallet.balance_points + previousBidder.amount 
          })
          .eq('user_id', previousBidder.user_id);

        // Create refund transaction
        await supabase
          .from('transactions')
          .insert({
            user_id: previousBidder.user_id,
            type: 'refund',
            amount: previousBidder.amount,
            description: `Bid refund: ${auction.title}`,
            reference_id: auctionId,
            reference_type: 'auction',
          });

        // Notify previous bidder
        await createNotification(
          previousBidder.user_id,
          'bid_outbid',
          '😔 Sei stato superato!',
          `La tua offerta di ${previousBidder.amount.toLocaleString()} FP su "${auction.title}" è stata superata. ${previousBidder.amount.toLocaleString()} FP rimborsati.`,
          auctionId,
          'auction'
        );
      }
    }

    // Notify bidder
    await createNotification(
      user.id,
      'reward',
      '✅ Offerta Piazzata!',
      `Hai offerto ${amount.toLocaleString()} FP su "${auction.title}"`,
      auctionId,
      'auction'
    );

    return c.json({ success: true, bid: newBid });
  } catch (error: any) {
    console.error('Place bid error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// NOTIFICATION ROUTES
// ============================================

/**
 * Get user notifications
 */
app.get("/make-server-81e425c4/notifications/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ notifications: notifications || [] });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Mark notification as read
 */
app.put("/make-server-81e425c4/notifications/:id/read", async (c) => {
  try {
    const notificationId = c.req.param('id');
    
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Mark read error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// TRANSACTIONS ROUTE
// ============================================

/**
 * Get user transactions
 */
app.get("/make-server-81e425c4/transactions/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ transactions: transactions || [] });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// START SERVER
// ============================================

console.log('🚀 SPORTIUM Server starting with SQL...');
Deno.serve(app.fetch);
