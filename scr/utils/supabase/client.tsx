import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Types
export type AuctionStatus = 'active' | 'ended' | 'scheduled';
export type BidStatus = 'active' | 'outbid' | 'won' | 'lost';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  user_id: string;
  balance_points: number;
  total_earned: number;
  total_spent: number;
  updated_at: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image_url?: string;
  starting_bid: number;
  current_bid: number;
  reserve_price?: number;
  buy_now_price?: number;
  min_increment: number;
  start_time: string;
  end_time: string;
  status: AuctionStatus;
  seller_id?: string;
  winner_id?: string;
  total_bids: number;
  watchers: number;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  auction_id: string;
  user_id: string;
  amount: number;
  auto_bid_max?: number;
  status: BidStatus;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'purchase' | 'bid' | 'win' | 'refund' | 'reward' | 'spend';
  amount: number;
  description: string;
  reference_id?: string;
  created_at: string;
}
