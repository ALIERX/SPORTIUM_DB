# 🔄 SPORTIUM - Code Migration Guide: KV Store → SQL

## 📋 Overview

Questa guida ti mostra come **migrare il codice** dal KV Store alle nuove tabelle SQL.

**Nota:** Non serve migrare tutto subito! Puoi farlo **gradualmente**. KV Store e SQL coesistono.

---

## 🎯 Strategy: Gradual Migration

### **Fase 1: Mantieni KV, Aggiungi SQL** (Ora)
- ✅ Database SQL setup completo
- ✅ KV Store continua a funzionare
- ✅ Nuovo codice usa SQL
- ✅ Vecchio codice usa KV

### **Fase 2: Migra Endpoint Critical** (1-2 giorni)
- ✅ Signup/Profile → SQL
- ✅ Wallet → SQL
- ✅ Auctions/Bids → SQL
- ✅ Transactions → SQL

### **Fase 3: Migra Features** (1 settimana)
- ✅ Quiz → SQL
- ✅ Notifications → SQL
- ✅ Rewards → SQL
- ✅ Challenges → SQL

### **Fase 4: Deprecate KV** (1-2 settimane)
- ✅ KV solo per cache/sessions
- ✅ Tutto il resto in SQL

---

## 📝 Pattern: KV vs SQL

### **PRIMA (KV Store):**
```typescript
// Server code
import * as kv from './kv_store.tsx';

// Set
await kv.set(`profile:${userId}`, {
  id: userId,
  username: 'User123',
  email: 'user@example.com'
});

// Get
const profile = await kv.get(`profile:${userId}`);

// Get multiple
const profiles = await kv.mget([
  `profile:${user1}`,
  `profile:${user2}`
]);

// Delete
await kv.del(`profile:${userId}`);
```

### **DOPO (SQL):**
```typescript
// Server code
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Insert
const { data, error } = await supabase
  .from('profiles')
  .insert({
    id: userId,
    username: 'User123',
    email: 'user@example.com'
  })
  .select()
  .single();

// Select single
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Select multiple
const { data: profiles } = await supabase
  .from('profiles')
  .select('*')
  .in('id', [user1, user2]);

// Update
await supabase
  .from('profiles')
  .update({ username: 'NewName' })
  .eq('id', userId);

// Delete
await supabase
  .from('profiles')
  .delete()
  .eq('id', userId);
```

---

## 🔄 Migration Examples

### **1. Signup Endpoint**

#### **PRIMA (KV):**
```typescript
app.post("/make-server-81e425c4/auth/signup", async (c) => {
  const { email, password, username } = await c.req.json();

  // Create auth user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  });

  if (error) return c.json({ error: error.message }, 400);

  // Create profile in KV
  await kv.set(`profile:${data.user.id}`, {
    id: data.user.id,
    email,
    username,
    created_at: new Date().toISOString(),
  });

  // Create wallet in KV
  await kv.set(`wallet:${data.user.id}`, {
    user_id: data.user.id,
    balance_points: 18450,
    total_earned: 18450,
    total_spent: 0,
  });

  return c.json({ success: true, user: data.user });
});
```

#### **DOPO (SQL - con Trigger Auto):**
```typescript
app.post("/make-server-81e425c4/auth/signup", async (c) => {
  const { email, password, username } = await c.req.json();

  // Create auth user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  });

  if (error) return c.json({ error: error.message }, 400);

  // Profile e Wallet vengono creati AUTOMATICAMENTE dal trigger!
  // Vedi: 001_complete_schema.sql → handle_new_user() function

  return c.json({ success: true, user: data.user });
});
```

**Vantaggio:** Meno codice! Il trigger gestisce tutto.

---

### **2. Get Profile**

#### **PRIMA (KV):**
```typescript
app.get("/make-server-81e425c4/profile", async (c) => {
  const userId = c.req.header('user-id');
  
  const profile = await kv.get(`profile:${userId}`);
  
  if (!profile) {
    return c.json({ error: 'Profile not found' }, 404);
  }

  return c.json(profile);
});
```

#### **DOPO (SQL):**
```typescript
app.get("/make-server-81e425c4/profile", async (c) => {
  const userId = c.req.header('user-id');
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      wallets (balance_points, total_earned, total_spent)
    `)
    .eq('id', userId)
    .single();
  
  if (error || !profile) {
    return c.json({ error: 'Profile not found' }, 404);
  }

  return c.json(profile);
});
```

**Vantaggio:** JOIN automatico con wallet!

---

### **3. Create Auction**

#### **PRIMA (KV):**
```typescript
app.post("/make-server-81e425c4/auctions/create", async (c) => {
  const { title, description, starting_bid, end_time } = await c.req.json();
  const userId = c.req.header('user-id');
  
  const auctionId = crypto.randomUUID();
  const auction = {
    id: auctionId,
    title,
    description,
    starting_bid,
    current_bid: null,
    end_time,
    status: 'active',
    created_by: userId,
    created_at: new Date().toISOString(),
  };

  await kv.set(`auction:${auctionId}`, auction);
  
  // Add to active auctions list
  const activeAuctions = await kv.get('auctions:active') || [];
  activeAuctions.push(auctionId);
  await kv.set('auctions:active', activeAuctions);

  return c.json(auction);
});
```

#### **DOPO (SQL):**
```typescript
app.post("/make-server-81e425c4/auctions/create", async (c) => {
  const { title, description, starting_bid, end_time, image_url } = await c.req.json();
  const userId = c.req.header('user-id');
  
  const { data: auction, error } = await supabase
    .from('auctions')
    .insert({
      title,
      description,
      starting_bid,
      end_time,
      image_url,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  return c.json(auction);
});
```

**Vantaggio:** No need to manage active list manually!

---

### **4. Place Bid**

#### **PRIMA (KV):**
```typescript
app.post("/make-server-81e425c4/auctions/:id/bid", async (c) => {
  const auctionId = c.req.param('id');
  const { amount } = await c.req.json();
  const userId = c.req.header('user-id');

  // Get auction
  const auction = await kv.get(`auction:${auctionId}`);
  if (!auction) return c.json({ error: 'Auction not found' }, 404);

  // Validate bid
  const minBid = auction.current_bid 
    ? auction.current_bid + auction.bid_increment 
    : auction.starting_bid;
  
  if (amount < minBid) {
    return c.json({ error: 'Bid too low' }, 400);
  }

  // Check wallet
  const wallet = await kv.get(`wallet:${userId}`);
  if (wallet.balance_points < amount) {
    return c.json({ error: 'Insufficient balance' }, 400);
  }

  // Create bid
  const bidId = crypto.randomUUID();
  const bid = {
    id: bidId,
    auction_id: auctionId,
    user_id: userId,
    amount,
    status: 'active',
    created_at: new Date().toISOString(),
  };

  await kv.set(`bid:${bidId}`, bid);

  // Update auction
  auction.current_bid = amount;
  await kv.set(`auction:${auctionId}`, auction);

  // Update wallet
  wallet.balance_points -= amount;
  await kv.set(`wallet:${userId}`, wallet);

  // Mark previous bids as outbid
  // ... complex logic ...

  return c.json(bid);
});
```

#### **DOPO (SQL con Transaction):**
```typescript
app.post("/make-server-81e425c4/auctions/:id/bid", async (c) => {
  const auctionId = c.req.param('id');
  const { amount } = await c.req.json();
  const userId = c.req.header('user-id');

  // Get auction
  const { data: auction } = await supabase
    .from('auctions')
    .select('*')
    .eq('id', auctionId)
    .eq('status', 'active')
    .single();

  if (!auction) return c.json({ error: 'Auction not found' }, 404);

  // Validate bid
  const minBid = auction.current_bid 
    ? auction.current_bid + auction.bid_increment 
    : auction.starting_bid;
  
  if (amount < minBid) {
    return c.json({ error: 'Bid too low' }, 400);
  }

  // Check wallet
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance_points')
    .eq('user_id', userId)
    .single();

  if (!wallet || wallet.balance_points < amount) {
    return c.json({ error: 'Insufficient balance' }, 400);
  }

  // Create bid (all in one transaction!)
  const { data: bid, error } = await supabase.rpc('place_bid', {
    p_auction_id: auctionId,
    p_user_id: userId,
    p_amount: amount,
  });

  if (error) return c.json({ error: error.message }, 400);

  return c.json(bid);
});
```

**Vantaggio:** Transaction atomica! Tutto succede o niente.

---

### **5. Get Auctions with Bids**

#### **PRIMA (KV - Complex):**
```typescript
app.get("/make-server-81e425c4/auctions", async (c) => {
  const activeIds = await kv.get('auctions:active') || [];
  
  const auctions = await kv.mget(
    activeIds.map(id => `auction:${id}`)
  );

  // For each auction, get bid count
  for (const auction of auctions) {
    const allBids = await kv.getByPrefix(`bid:`);
    const auctionBids = allBids.filter(
      bid => bid.auction_id === auction.id
    );
    auction.bid_count = auctionBids.length;
  }

  return c.json(auctions);
});
```

#### **DOPO (SQL - Simple JOIN):**
```typescript
app.get("/make-server-81e425c4/auctions", async (c) => {
  const { data: auctions, error } = await supabase
    .from('auctions')
    .select(`
      *,
      bids (count),
      profiles!created_by (username, avatar_url)
    `)
    .eq('status', 'active')
    .order('end_time', { ascending: true });

  if (error) return c.json({ error: error.message }, 500);

  return c.json(auctions);
});
```

**Vantaggio:** JOIN potente! Una query, tutti i dati.

---

## 🎯 Priority Migration Order

### **High Priority (Fai Subito):**
1. ✅ **Signup** - Usa trigger auto per profile/wallet
2. ✅ **Profile** - Query SQL invece di KV
3. ✅ **Wallet** - Transactions tracking in SQL
4. ✅ **Auctions** - Real-time bidding con SQL

### **Medium Priority (1 settimana):**
5. ✅ **Notifications** - Real-time subscriptions
6. ✅ **Quiz** - Leaderboard SQL
7. ✅ **Rewards** - Stock management SQL

### **Low Priority (Quando hai tempo):**
8. ✅ **Challenges** - Progress tracking
9. ✅ **Achievements** - Unlock tracking
10. ✅ **Predictions** - Future feature

---

## 📦 Helper: SQL Query Builder

Creiamo un helper per semplificare le query:

```typescript
// /utils/supabase/queries.tsx

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export const queries = {
  // Profiles
  async getProfile(userId: string) {
    return await supabase
      .from('profiles')
      .select('*, wallets(*)')
      .eq('id', userId)
      .single();
  },

  async updateProfile(userId: string, updates: any) {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
  },

  // Auctions
  async getActiveAuctions() {
    return await supabase
      .from('auctions')
      .select(`
        *,
        bids (count),
        profiles!created_by (username, avatar_url)
      `)
      .eq('status', 'active')
      .order('end_time', { ascending: true });
  },

  async getAuction(auctionId: string) {
    return await supabase
      .from('auctions')
      .select(`
        *,
        bids (*),
        profiles!created_by (username, avatar_url)
      `)
      .eq('id', auctionId)
      .single();
  },

  // Wallet
  async getWallet(userId: string) {
    return await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();
  },

  async updateWalletBalance(userId: string, amount: number, type: 'add' | 'subtract') {
    const { data: wallet } = await this.getWallet(userId);
    
    const newBalance = type === 'add' 
      ? wallet.balance_points + amount
      : wallet.balance_points - amount;

    return await supabase
      .from('wallets')
      .update({ balance_points: newBalance })
      .eq('user_id', userId)
      .select()
      .single();
  },

  // Notifications
  async createNotification(notification: any) {
    return await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
  },

  async getUserNotifications(userId: string) {
    return await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
  },

  // Transactions
  async createTransaction(transaction: any) {
    return await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
  },

  async getUserTransactions(userId: string) {
    return await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);
  },
};

export default queries;
```

**Uso:**
```typescript
import queries from './utils/supabase/queries';

// Nel tuo endpoint
const { data: profile } = await queries.getProfile(userId);
const { data: auctions } = await queries.getActiveAuctions();
```

---

## ✅ Checklist Migration

### **Server Endpoints:**
- [ ] `/auth/signup` → SQL (con trigger)
- [ ] `/auth/signin` → No changes needed
- [ ] `/profile` → Query SQL
- [ ] `/wallet` → Query SQL
- [ ] `/auctions` → Query SQL
- [ ] `/auctions/:id` → Query SQL
- [ ] `/auctions/:id/bid` → SQL transaction
- [ ] `/notifications` → Query SQL
- [ ] `/transactions` → Query SQL (nuovo!)

### **Frontend:**
- [ ] AuthContext → Usa SQL profile/wallet
- [ ] AuctionsPage → Fetch da SQL
- [ ] AuctionDetailPage → Real-time subscription
- [ ] ProfilePage → Update profile in SQL
- [ ] NotificationsPanel → Real-time subscription

### **Testing:**
- [ ] Signup → Verifica profile+wallet creati
- [ ] Bidding → Verifica wallet decrement
- [ ] Notifications → Verifica real-time
- [ ] Transactions → Verifica storico completo

---

## 🎉 Done!

Ora hai tutti gli strumenti per migrare da KV Store a SQL!

**Ricorda:**
- ✅ Fallo **gradualmente**
- ✅ Testa ogni endpoint dopo migration
- ✅ KV Store può rimanere per cache/sessions
- ✅ SQL è molto più potente per query complesse

**SPORTIUM è pronto per scalare! 🚀**
