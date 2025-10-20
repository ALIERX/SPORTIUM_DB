# 🔄 SPORTIUM - Server Upgrade Instructions

## ✅ Cosa Fare (Manuale - 2 minuti)

**IMPORTANTE:** Siccome non posso rinominare file direttamente, segui questi step:

---

## 📋 Step-by-Step

### **Step 1: Backup Vecchio Server**

1. Trova il file: `/supabase/functions/server/index.tsx`
2. **Rinominalo in:** `/supabase/functions/server/index_BACKUP_KV.tsx`
   
**Come:**
- Se usi VS Code: Click destro → Rename
- Se usi terminale: `mv index.tsx index_BACKUP_KV.tsx`

---

### **Step 2: Crea Nuovo Server SQL**

1. Trova il file: `/supabase/functions/server/index_NEW_SQL.tsx`
2. **Rinominalo in:** `/supabase/functions/server/index.tsx`

**Come:**
- Se usi VS Code: Click destro → Rename
- Se usi terminale: `mv index_NEW_SQL.tsx index.tsx`

---

### **Step 3: Aggiungi Admin Endpoints**

1. Apri: `/supabase/functions/server/admin_endpoints.tsx`
2. **Copia TUTTO** il contenuto (Ctrl+A, Ctrl+C)
3. Apri: `/supabase/functions/server/index.tsx`
4. Vai alla **FINE** del file (prima di `Deno.serve(app.fetch)`)
5. **Incolla** il contenuto copiato
6. Salva

**Il tuo index.tsx alla fine dovrebbe avere:**
```typescript
// ... tutto il codice normale ...

// ============================================
// ADMIN ROUTES (appena incollati)
// ============================================

app.get("/make-server-81e425c4/admin/stats", async (c) => {
  // ... codice admin stats ...
});

// ... altri endpoint admin ...

// ============================================
// START SERVER
// ============================================

console.log('🚀 SPORTIUM Server starting with SQL...');
Deno.serve(app.fetch);
```

---

### **Step 4 (Opzionale): Aggiungi Endpoint Completi**

Se vuoi Quiz, Leaderboard, Rewards funzionanti:

1. Apri: `/supabase/functions/server/COMPLETE_ENDPOINTS.tsx`
2. **Copia TUTTO** il contenuto
3. Apri: `/supabase/functions/server/index.tsx`
4. Vai alla **FINE** (dopo gli admin endpoints, prima di `Deno.serve`)
5. **Incolla**
6. Salva

---

## ✅ Verifica

Dopo aver fatto gli step, il tuo `/supabase/functions/server/index.tsx` dovrebbe avere:

```typescript
/**
 * SPORTIUM - Server con SQL Database
 * ... commenti iniziali ...
 */

import { Hono } from "npm:hono";
// ... imports ...

const app = new Hono();

// Helper functions
async function getAuthUser(authHeader: string | null) {
  // ...
}

async function createNotification(...) {
  // ...
}

// ============================================
// HEALTH CHECK
// ============================================

app.get("/make-server-81e425c4/health", async (c) => {
  // ... SQL health check ...
});

// ============================================
// AUTH ROUTES
// ============================================

app.post("/make-server-81e425c4/auth/signup", async (c) => {
  // ... SQL signup (auto-create profile/wallet via trigger) ...
});

// ============================================
// PROFILE ROUTES
// ============================================

app.get("/make-server-81e425c4/profile/:userId", async (c) => {
  // ... SQL query profiles table ...
});

// ============================================
// WALLET ROUTES
// ============================================

app.get("/make-server-81e425c4/wallet/:userId", async (c) => {
  // ... SQL query wallets table ...
});

// ============================================
// AUCTION ROUTES
// ============================================

app.get("/make-server-81e425c4/auctions", async (c) => {
  // ... SQL query auctions with JOIN bids ...
});

app.post("/make-server-81e425c4/auctions/:id/bid", async (c) => {
  // ... SQL bid + auto-refund previous bidder ...
});

// ============================================
// NOTIFICATION ROUTES
// ============================================

app.get("/make-server-81e425c4/notifications/:userId", async (c) => {
  // ... SQL query notifications ...
});

// ============================================
// ADMIN ROUTES (aggiunti da admin_endpoints.tsx)
// ============================================

app.get("/make-server-81e425c4/admin/stats", async (c) => {
  // ... admin stats ...
});

app.get("/make-server-81e425c4/admin/users", async (c) => {
  // ... admin users list ...
});

app.post("/make-server-81e425c4/admin/users/:userId/adjust-balance", async (c) => {
  // ... admin adjust FP ...
});

app.get("/make-server-81e425c4/admin/auctions", async (c) => {
  // ... admin auctions list ...
});

app.post("/make-server-81e425c4/admin/auctions/:auctionId/end", async (c) => {
  // ... admin close auction ...
});

app.delete("/make-server-81e425c4/admin/auctions/:auctionId", async (c) => {
  // ... admin delete auction + refund ...
});

app.get("/make-server-81e425c4/admin/transactions", async (c) => {
  // ... admin transactions ...
});

// ============================================
// QUIZ ROUTES (opzionale - da COMPLETE_ENDPOINTS.tsx)
// ============================================

app.get("/make-server-81e425c4/quiz/questions", async (c) => {
  // ... quiz questions ...
});

// ... altri quiz endpoints ...

// ============================================
// LEADERBOARD ROUTES (opzionale)
// ============================================

app.get("/make-server-81e425c4/leaderboard/:category/:period", async (c) => {
  // ... leaderboard ...
});

// ... altri leaderboard endpoints ...

// ============================================
// REWARDS ROUTES (opzionale)
// ============================================

app.get("/make-server-81e425c4/rewards", async (c) => {
  // ... rewards list ...
});

// ... altri rewards endpoints ...

// ============================================
// START SERVER
// ============================================

console.log('🚀 SPORTIUM Server starting with SQL...');
Deno.serve(app.fetch);
```

---

## 🎯 Cosa Cambia

### **PRIMA (KV Store):**
```typescript
// Get profile
const profile = await kv.get(`profile:${userId}`);

// Update wallet
wallet.balance_points += amount;
await kv.set(`wallet:${userId}`, wallet);
```

### **DOPO (SQL):**
```typescript
// Get profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Update wallet
await supabase
  .from('wallets')
  .update({ balance_points: wallet.balance_points + amount })
  .eq('user_id', userId);
```

---

## ✅ Test Dopo l'Upgrade

### **1. Test Health Check:**
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-81e425c4/health
```

**Aspettati:**
```json
{
  "status": "ok",
  "sql": "connected",
  "kv": "available"
}
```

### **2. Test Admin Stats:**
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-81e425c4/admin/stats \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Aspettati:**
```json
{
  "stats": {
    "totalUsers": 0,
    "totalAuctions": 0,
    "activeAuctions": 0,
    ...
  }
}
```

### **3. Test Signup:**
1. Apri app SPORTIUM
2. Profile → Sign Up
3. Crea account
4. ✅ Dovrebbe funzionare senza errori

### **4. Verifica Database:**
```sql
-- In Supabase Dashboard → SQL Editor
SELECT * FROM profiles;
SELECT * FROM wallets;
SELECT * FROM transactions;
```

---

## 🚨 Troubleshooting

### **"Cannot find module"**
➡️ Hai copiato tutto il contenuto da admin_endpoints.tsx? Verifica che la funzione `createNotification` sia presente.

### **"Deno.serve is not defined"**
➡️ Hai lasciato il vecchio `Deno.serve` e ne hai aggiunto un altro? Deve esserci UNO solo alla fine.

### **"Table does not exist"**
➡️ Non hai eseguito le migrations SQL. Vai su Supabase Dashboard e esegui 001-004.

---

## 📊 File Structure Finale

```
/supabase/functions/server/
├── index.tsx                    ← NUOVO (SQL + Admin)
├── index_BACKUP_KV.tsx          ← Backup vecchio
├── index_NEW_SQL.tsx            ← Può essere eliminato dopo
├── COMPLETE_ENDPOINTS.tsx       ← Reference (opzionale)
├── admin_endpoints.tsx          ← Reference
└── kv_store.tsx                 ← Mantieni (usato per cache)
```

---

## ✅ Checklist

- [ ] Step 1: Rinominato index.tsx → index_BACKUP_KV.tsx
- [ ] Step 2: Rinominato index_NEW_SQL.tsx → index.tsx
- [ ] Step 3: Copiato admin_endpoints.tsx in index.tsx
- [ ] Step 4 (opzionale): Copiato COMPLETE_ENDPOINTS.tsx in index.tsx
- [ ] Test health check OK
- [ ] Test admin stats OK
- [ ] Test signup OK
- [ ] Verifica database OK

---

## 🎉 Done!

Ora hai un **server SQL production-ready** con:

✅ Database SQL invece di KV Store
✅ Auto-create profile/wallet via trigger
✅ Admin panel endpoints
✅ Quiz/Leaderboard/Rewards (opzionale)
✅ Transaction tracking completo
✅ Notifications funzionanti

**Next:** Esegui le migrations SQL su Supabase Dashboard!

👉 [`FINAL_INTEGRATION_GUIDE.md`](/FINAL_INTEGRATION_GUIDE.md)

---

**SPORTIUM Server - Ready to Scale! 🚀⚽**
