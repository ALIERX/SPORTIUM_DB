# ⚡ SPORTIUM - Quick Reference Card

## 🎯 Setup in 3 Step

```
1. Database → Esegui migrations in Supabase Dashboard (10 min)
2. Server   → Sostituisci con versione SQL (3 min)
3. Test     → Signup + Auction test (2 min)
```

**Total: 15 minuti** → [`FINAL_INTEGRATION_GUIDE.md`](/FINAL_INTEGRATION_GUIDE.md)

---

## 📊 Database Schema Quick Ref

### **17 Tabelle:**
```
profiles              - Profili utente
wallets               - Balance Fans Points
transactions          - Storico completo
auctions              - Aste live
bids                  - Offerte
notifications         - Sistema notifiche
quiz_questions        - Domande quiz
quiz_attempts         - Tentativi
achievements          - Achievement disponibili
user_achievements     - Sbloccati
leaderboard_entries   - Classifiche
daily_challenges      - Sfide giornaliere
challenge_completions - Progress
referrals             - Referral system
rewards               - Premi riscattabili
reward_redemptions    - Riscatti
predictions           - Pronostici
```

### **4 Storage Buckets:**
```
auction-images   (5MB)
user-avatars     (2MB)
reward-images    (5MB)
quiz-images      (3MB)
```

---

## 🔧 Server Endpoints Quick Ref

### **Auth:**
```
POST /auth/check-email
POST /auth/signup
```

### **Profile:**
```
GET  /profile/:userId
PUT  /profile/:userId
```

### **Wallet:**
```
GET  /wallet/:userId
POST /wallet/:userId/add
```

### **Auctions:**
```
GET  /auctions
GET  /auctions/:id
POST /auctions/create
POST /auctions/:id/bid
```

### **Notifications:**
```
GET /notifications/:userId
PUT /notifications/:id/read
```

### **Transactions:**
```
GET /transactions/:userId
```

### **Quiz (Optional):**
```
GET  /quiz/questions
POST /quiz/submit
GET  /quiz/stats/:userId
```

### **Leaderboard (Optional):**
```
GET /leaderboard/:category/:period
```

### **Rewards (Optional):**
```
GET  /rewards
POST /rewards/:id/redeem
GET  /rewards/redemptions/:userId
```

### **Challenges (Optional):**
```
GET  /challenges/today
GET  /challenges/progress/:userId
POST /challenges/:id/complete
```

---

## 🔄 Real-time Subscriptions

```typescript
import subscriptions from './utils/supabase/subscriptions';

// Auction bids
const ch1 = subscriptions.subscribeToAuctionBids(auctionId, callback);

// Wallet updates
const ch2 = subscriptions.subscribeToWallet(userId, callback);

// Notifications
const ch3 = subscriptions.subscribeToNotifications(userId, callback);

// Leaderboard
const ch4 = subscriptions.subscribeToLeaderboard(category, period, callback);

// Cleanup
subscriptions.unsubscribe(channel);
subscriptions.unsubscribeAll();
```

---

## 📤 Storage Upload

```typescript
import storage from './utils/supabase/storage';

// Upload auction image
const { url } = await storage.uploadAuctionImage(file, auctionId);

// Upload avatar
const { url } = await storage.uploadUserAvatar(file, userId);

// Validate
const { valid, error } = storage.validateFile(file, 5, ['image/jpeg']);

// Compress
const compressed = await storage.compressImage(file, 1200, 0.8);

// Delete
await storage.deleteAuctionImage(imageUrl);
```

---

## 🗄️ SQL Query Examples

### **Get profile with wallet:**
```sql
SELECT 
  p.*,
  w.balance_points,
  w.total_earned,
  w.total_spent
FROM profiles p
JOIN wallets w ON w.user_id = p.id
WHERE p.id = 'USER_ID';
```

### **Get active auctions:**
```sql
SELECT 
  a.*,
  COUNT(b.id) as bid_count,
  p.username as creator_name
FROM auctions a
LEFT JOIN bids b ON b.auction_id = a.id
JOIN profiles p ON p.id = a.created_by
WHERE a.status = 'active'
GROUP BY a.id, p.username
ORDER BY a.end_time ASC;
```

### **Get user transactions:**
```sql
SELECT *
FROM transactions
WHERE user_id = 'USER_ID'
ORDER BY created_at DESC
LIMIT 100;
```

### **Get leaderboard:**
```sql
SELECT 
  l.*,
  p.username,
  p.avatar_url,
  p.level
FROM leaderboard_entries l
JOIN profiles p ON p.id = l.user_id
WHERE l.category = 'quiz'
  AND l.period = 'weekly'
ORDER BY l.rank ASC
LIMIT 100;
```

---

## ✅ Quick Verifications

### **Verify tables:**
```sql
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name NOT LIKE 'kv_%';
-- Expected: 17
```

### **Verify buckets:**
```sql
SELECT COUNT(*) FROM storage.buckets;
-- Expected: 4
```

### **Verify RLS:**
```sql
SELECT COUNT(*) FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT LIKE 'kv_%'
AND rowsecurity = true;
-- Expected: 17
```

### **Test health:**
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-81e425c4/health
```

---

## 🚨 Common Issues

| Error | Fix |
|-------|-----|
| "table does not exist" | Run migrations 001-004 |
| "permission denied" | Use SERVICE_ROLE_KEY in server |
| "Signup failed" | Check trigger in 001_complete_schema.sql |
| "Wallet not found" | Trigger didn't create wallet - check migration |
| Real-time not working | Enable Realtime in Supabase Settings |

---

## 📚 Main Guides

| Guide | When to Use |
|-------|-------------|
| [FINAL_INTEGRATION_GUIDE.md](/FINAL_INTEGRATION_GUIDE.md) | 🎯 **START HERE** - Complete setup |
| [QUICK_START_PRODUCTION.md](/QUICK_START_PRODUCTION.md) | Database setup only |
| [SETUP_CHECKLIST.md](/SETUP_CHECKLIST.md) | Visual checklist |
| [CODE_UPDATE_PLAN.md](/CODE_UPDATE_PLAN.md) | Server update plan |
| [CODE_MIGRATION_GUIDE.md](/CODE_MIGRATION_GUIDE.md) | Code examples |
| [TROUBLESHOOTING.md](/TROUBLESHOOTING.md) | Problems? |
| [DOCUMENTATION_INDEX.md](/DOCUMENTATION_INDEX.md) | All docs map |

---

## 🎯 Priority Order

1. ✅ **CRITICAL:**
   - [ ] Database setup (migrations)
   - [ ] Server update (SQL)
   - [ ] Test signup
   - [ ] Test auctions

2. ⭐ **RECOMMENDED:**
   - [ ] Real-time subscriptions
   - [ ] Quiz endpoints
   - [ ] Leaderboard endpoints
   - [ ] Cleanup DebugPanel

3. 🎁 **OPTIONAL:**
   - [ ] Rewards endpoints
   - [ ] Challenges endpoints
   - [ ] File upload
   - [ ] Achievements

---

## 📊 Files Overview

### **Created (Server):**
```
/supabase/functions/server/
  ├── index.tsx                    (Original - KV Store)
  ├── index_NEW_SQL.tsx            (NEW - SQL version)
  ├── COMPLETE_ENDPOINTS.tsx       (All endpoints)
  └── kv_store.tsx                 (Keep for cache)
```

### **Created (Utils):**
```
/utils/supabase/
  ├── subscriptions.tsx            (NEW - Real-time)
  └── storage.tsx                  (NEW - File upload)
```

### **Created (Migrations):**
```
/supabase/migrations/
  ├── 001_complete_schema.sql      (17 tables)
  ├── 002_storage_setup.sql        (4 buckets)
  ├── 003_rls_policies.sql         (30+ policies)
  ├── 004_indexes.sql              (50+ indexes)
  ├── 005_seed_data.sql            (Test data)
  └── README_MIGRATIONS.md         (Guide)
```

---

## 🎉 Success Criteria

### **Minimum (Production-Ready):**
```
✅ 17 tables created
✅ 4 buckets created
✅ RLS enabled
✅ Server uses SQL
✅ Signup works
✅ Auctions work
✅ Wallet tracking works
```

### **Recommended:**
```
✅ All above
✅ Real-time enabled
✅ Quiz working
✅ Leaderboard working
✅ Notifications working
```

### **Complete:**
```
✅ All above
✅ Rewards working
✅ Challenges working
✅ File upload working
✅ All features tested
```

---

**Quick Setup:** 15 min → [`FINAL_INTEGRATION_GUIDE.md`](/FINAL_INTEGRATION_GUIDE.md)

**SPORTIUM - Production Ready! 🚀⚽**
