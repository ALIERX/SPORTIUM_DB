/**
 * SPORTIUM - Real-time Subscriptions
 * 
 * Gestisce le subscriptions real-time di Supabase per:
 * - Auctions (nuove bid, chiusura aste)
 * - Notifications (nuove notifiche)
 * - Leaderboard (aggiornamenti posizioni)
 * - Wallets (cambio balance)
 */

import { createClient } from './client';
import { RealtimeChannel } from '@supabase/supabase-js';

const supabase = createClient();

// ============================================
// AUCTION SUBSCRIPTIONS
// ============================================

/**
 * Subscribe to bids on a specific auction
 */
export function subscribeToAuctionBids(
  auctionId: string,
  onNewBid: (bid: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`auction-bids-${auctionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'bids',
        filter: `auction_id=eq.${auctionId}`,
      },
      (payload) => {
        console.log('[RT] New bid:', payload.new);
        onNewBid(payload.new);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to auction status changes
 */
export function subscribeToAuctionStatus(
  auctionId: string,
  onStatusChange: (auction: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`auction-status-${auctionId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'auctions',
        filter: `id=eq.${auctionId}`,
      },
      (payload) => {
        console.log('[RT] Auction updated:', payload.new);
        onStatusChange(payload.new);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to all active auctions
 */
export function subscribeToActiveAuctions(
  onAuctionChange: (auction: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel('active-auctions')
    .on(
      'postgres_changes',
      {
        event: '*', // INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'auctions',
        filter: 'status=eq.active',
      },
      (payload) => {
        console.log('[RT] Auction change:', payload);
        onAuctionChange(payload.new || payload.old);
      }
    )
    .subscribe();

  return channel;
}

// ============================================
// NOTIFICATION SUBSCRIPTIONS
// ============================================

/**
 * Subscribe to user notifications
 */
export function subscribeToNotifications(
  userId: string,
  onNewNotification: (notification: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`user-notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('[RT] New notification:', payload.new);
        onNewNotification(payload.new);
      }
    )
    .subscribe();

  return channel;
}

// ============================================
// WALLET SUBSCRIPTIONS
// ============================================

/**
 * Subscribe to wallet balance changes
 */
export function subscribeToWallet(
  userId: string,
  onBalanceChange: (wallet: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`user-wallet-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'wallets',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('[RT] Wallet updated:', payload.new);
        onBalanceChange(payload.new);
      }
    )
    .subscribe();

  return channel;
}

// ============================================
// LEADERBOARD SUBSCRIPTIONS
// ============================================

/**
 * Subscribe to leaderboard changes
 */
export function subscribeToLeaderboard(
  category: string,
  period: string,
  onLeaderboardChange: (entries: any[]) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`leaderboard-${category}-${period}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leaderboard_entries',
        filter: `category=eq.${category}`,
      },
      async () => {
        // Fetch updated leaderboard
        const { data } = await supabase
          .from('leaderboard_entries')
          .select('*, profiles(username, avatar_url)')
          .eq('category', category)
          .eq('period', period)
          .order('rank', { ascending: true })
          .limit(100);

        if (data) {
          console.log('[RT] Leaderboard updated');
          onLeaderboardChange(data);
        }
      }
    )
    .subscribe();

  return channel;
}

// ============================================
// CHALLENGE SUBSCRIPTIONS
// ============================================

/**
 * Subscribe to challenge completions
 */
export function subscribeToChallengeProgress(
  userId: string,
  onProgressChange: (completion: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`challenge-progress-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'challenge_completions',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('[RT] Challenge progress:', payload.new);
        onProgressChange(payload.new);
      }
    )
    .subscribe();

  return channel;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Unsubscribe from a channel
 */
export function unsubscribe(channel: RealtimeChannel) {
  if (channel) {
    supabase.removeChannel(channel);
  }
}

/**
 * Unsubscribe from all channels
 */
export function unsubscribeAll() {
  supabase.removeAllChannels();
}

/**
 * Get channel status
 */
export function getChannelStatus(channel: RealtimeChannel): string {
  return channel.state;
}

// ============================================
// BROADCAST (Cross-tab communication)
// ============================================

/**
 * Broadcast an event to other tabs
 */
export function broadcast(channel: string, event: string, payload: any) {
  const broadcastChannel = supabase.channel(channel);
  broadcastChannel.send({
    type: 'broadcast',
    event,
    payload,
  });
}

/**
 * Listen to broadcast events
 */
export function listenToBroadcast(
  channel: string,
  event: string,
  callback: (payload: any) => void
): RealtimeChannel {
  const broadcastChannel = supabase
    .channel(channel)
    .on('broadcast', { event }, ({ payload }) => {
      console.log('[BROADCAST]', event, payload);
      callback(payload);
    })
    .subscribe();

  return broadcastChannel;
}

// ============================================
// PRESENCE (Online users)
// ============================================

/**
 * Track user presence in a room
 */
export function trackPresence(
  room: string,
  userId: string,
  userData: any
): RealtimeChannel {
  const channel = supabase.channel(room, {
    config: {
      presence: {
        key: userId,
      },
    },
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      console.log('[PRESENCE] Sync:', state);
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('[PRESENCE] Join:', key, newPresences);
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('[PRESENCE] Leave:', key, leftPresences);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track(userData);
      }
    });

  return channel;
}

/**
 * Get online users in a room
 */
export function getPresenceState(channel: RealtimeChannel) {
  return channel.presenceState();
}

// ============================================
// EXPORTS
// ============================================

export default {
  // Auctions
  subscribeToAuctionBids,
  subscribeToAuctionStatus,
  subscribeToActiveAuctions,
  
  // Notifications
  subscribeToNotifications,
  
  // Wallet
  subscribeToWallet,
  
  // Leaderboard
  subscribeToLeaderboard,
  
  // Challenges
  subscribeToChallengeProgress,
  
  // Utilities
  unsubscribe,
  unsubscribeAll,
  getChannelStatus,
  
  // Broadcast
  broadcast,
  listenToBroadcast,
  
  // Presence
  trackPresence,
  getPresenceState,
};
