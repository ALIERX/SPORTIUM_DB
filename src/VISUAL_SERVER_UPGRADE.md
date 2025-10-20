# 🎯 Visual Server Upgrade Guide

## 📁 File Structure - PRIMA

```
/supabase/functions/server/
├── index.tsx                    ← VECCHIO (KV Store)
├── index_NEW_SQL.tsx            ← NUOVO (SQL pronto)
├── admin_endpoints.tsx          ← Da aggiungere
├── COMPLETE_ENDPOINTS.tsx       ← Opzionale
└── kv_store.tsx                 ← Mantieni
```

---

## 🔄 Operazione 1: Backup Vecchio

### **Action:**
```
Rinomina: index.tsx → index_BACKUP_KV.tsx
```

### **Visual:**
```
/supabase/functions/server/
├── index_BACKUP_KV.tsx          ← BACKUP (era index.tsx)
├── index_NEW_SQL.tsx            
├── admin_endpoints.tsx          
└── kv_store.tsx                 
```

### **Come fare:**
- **VS Code:** Click destro su `index.tsx` → Rename → `index_BACKUP_KV.tsx`
- **Terminal:** `cd supabase/functions/server && mv index.tsx index_BACKUP_KV.tsx`

---

## 🔄 Operazione 2: Attiva Nuovo Server

### **Action:**
```
Rinomina: index_NEW_SQL.tsx → index.tsx
```

### **Visual:**
```
/supabase/functions/server/
├── index.tsx                    ← NUOVO SQL (era index_NEW_SQL.tsx)
├── index_BACKUP_KV.tsx          
├── admin_endpoints.tsx          
└── kv_store.tsx                 
```

### **Come fare:**
- **VS Code:** Click destro su `index_NEW_SQL.tsx` → Rename → `index.tsx`
- **Terminal:** `cd supabase/functions/server && mv index_NEW_SQL.tsx index.tsx`

---

## ✂️ Operazione 3: Aggiungi Admin Endpoints

### **Action:**
```
1. Apri admin_endpoints.tsx
2. Seleziona TUTTO (Ctrl+A)
3. Copia (Ctrl+C)
4. Apri index.tsx
5. Vai alla FINE (prima di Deno.serve)
6. Incolla (Ctrl+V)
7. Salva
```

### **Visual - File admin_endpoints.tsx:**
```typescript
/**
 * SPORTIUM - Admin Endpoints
 * ...
 */

// ============================================
// ADMIN ROUTES
// ============================================

app.get("/make-server-81e425c4/admin/stats", async (c) => {
  // ... admin stats code ...
});

app.get("/make-server-81e425c4/admin/users", async (c) => {
  // ... admin users code ...
});

app.post("/make-server-81e425c4/admin/users/:userId/adjust-balance", async (c) => {
  // ... adjust balance code ...
});

// ... altri admin endpoints ...

// ============================================
// FINE
// ============================================
```

### **Visual - index.tsx PRIMA:**
```typescript
// ... tutto il codice ...

// ============================================
// TRANSACTIONS ROUTE
// ============================================

app.get("/make-server-81e425c4/transactions/:userId", async (c) => {
  // ... transactions code ...
});

// ============================================
// START SERVER
// ============================================

console.log('🚀 SPORTIUM Server starting with SQL...');
Deno.serve(app.fetch);  ← Deno.serve QUI
```

### **Visual - index.tsx DOPO (incollato admin_endpoints):**
```typescript
// ... tutto il codice precedente ...

// ============================================
// TRANSACTIONS ROUTE
// ============================================

app.get("/make-server-81e425c4/transactions/:userId", async (c) => {
  // ... transactions code ...
});

// ============================================
// ADMIN ROUTES (APPENA INCOLLATI!)
// ============================================

app.get("/make-server-81e425c4/admin/stats", async (c) => {
  // ... admin stats code ...
});

app.get("/make-server-81e425c4/admin/users", async (c) => {
  // ... admin users code ...
});

app.post("/make-server-81e425c4/admin/users/:userId/adjust-balance", async (c) => {
  // ... adjust balance code ...
});

// ... altri admin endpoints ...

// ============================================
// START SERVER
// ============================================

console.log('🚀 SPORTIUM Server starting with SQL...');
Deno.serve(app.fetch);  ← Deno.serve SEMPRE ALLA FINE
```

---

## ✅ Operazione 4 (Opzionale): Quiz/Leaderboard/Rewards

### **Action:**
```
1. Apri COMPLETE_ENDPOINTS.tsx
2. Seleziona TUTTO (Ctrl+A)
3. Copia (Ctrl+C)
4. Apri index.tsx
5. Vai alla FINE (dopo admin endpoints, prima di Deno.serve)
6. Incolla (Ctrl+V)
7. Salva
```

### **Visual - index.tsx con COMPLETE_ENDPOINTS:**
```typescript
// ... codice normale ...

// ============================================
// ADMIN ROUTES
// ============================================

app.get("/make-server-81e425c4/admin/stats", async (c) => {
  // ... admin code ...
});

// ============================================
// QUIZ ROUTES (APPENA INCOLLATI!)
// ============================================

app.get("/make-server-81e425c4/quiz/questions", async (c) => {
  // ... quiz code ...
});

app.post("/make-server-81e425c4/quiz/submit", async (c) => {
  // ... quiz submit code ...
});

// ============================================
// LEADERBOARD ROUTES
// ============================================

app.get("/make-server-81e425c4/leaderboard/:category/:period", async (c) => {
  // ... leaderboard code ...
});

// ============================================
// REWARDS ROUTES
// ============================================

app.get("/make-server-81e425c4/rewards", async (c) => {
  // ... rewards code ...
});

// ============================================
// START SERVER
// ============================================

console.log('🚀 SPORTIUM Server starting with SQL...');
Deno.serve(app.fetch);  ← SEMPRE UNO SOLO ALLA FINE
```

---

## 📁 File Structure - DOPO

### **Minimo (Admin funzionante):**
```
/supabase/functions/server/
├── index.tsx                    ← SQL + Admin Endpoints ✅
├── index_BACKUP_KV.tsx          ← Backup sicuro
├── admin_endpoints.tsx          ← Reference
└── kv_store.tsx                 ← Mantieni (cache)
```

### **Completo (Quiz/Leaderboard/Rewards):**
```
/supabase/functions/server/
├── index.tsx                    ← SQL + Admin + Quiz + Leaderboard + Rewards ✅
├── index_BACKUP_KV.tsx          ← Backup sicuro
├── admin_endpoints.tsx          ← Reference
├── COMPLETE_ENDPOINTS.tsx       ← Reference
└── kv_store.tsx                 ← Mantieni (cache)
```

---

## 🧪 Test Visuale

### **1. Test Health Check:**

```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-81e425c4/health
```

**✅ Risposta Corretta:**
```json
{
  "status": "ok",
  "sql": "connected",     ← Importante!
  "kv": "available",
  "timestamp": "..."
}
```

**❌ Risposta Errata:**
```json
{
  "status": "ok",
  "kv": "connected",      ← Solo KV = server vecchio!
  "timestamp": "..."
}
```

---

### **2. Test Admin Stats:**

```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-81e425c4/admin/stats \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**✅ Risposta Corretta:**
```json
{
  "stats": {
    "totalUsers": 0,
    "totalAuctions": 0,
    "activeAuctions": 0,
    "totalTransactions": 0,
    "totalPointsCirculating": 0,
    "totalPointsEarned": 0,
    "totalPointsSpent": 0
  }
}
```

**❌ Risposta Errata:**
```json
{
  "error": "Not Found"    ← Admin endpoints non aggiunti!
}
```

---

## 🎯 Cosa Cambia Visivamente

### **PRIMA (KV Store):**

```typescript
// Signup crea profile manualmente
await kv.set(`profile:${userId}`, {
  id: userId,
  email,
  username,
  created_at: new Date().toISOString(),
});

// Wallet creato manualmente
await kv.set(`wallet:${userId}`, {
  user_id: userId,
  balance_points: 18450,
  total_earned: 18450,
  total_spent: 0,
});
```

### **DOPO (SQL con Trigger):**

```typescript
// Signup crea user, profile + wallet AUTO-CREATI!
const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { username },
});
// ✨ Trigger crea automaticamente:
// - Profile in profiles table
// - Wallet in wallets table con 18,450 FP
// - Transaction welcome bonus
```

---

## ✅ Checklist Visuale

```
□ File Trovato: /supabase/functions/server/index.tsx
□ Operazione 1: Rinominato in index_BACKUP_KV.tsx
□ File Trovato: /supabase/functions/server/index_NEW_SQL.tsx
□ Operazione 2: Rinominato in index.tsx
□ File Aperto: admin_endpoints.tsx
□ Operazione 3: Copiato tutto
□ File Aperto: index.tsx (nuovo)
□ Operazione 3: Incollato prima di Deno.serve
□ Salvato index.tsx
□ Test: Health check mostra "sql": "connected"
□ Test: Admin stats funziona
□ DONE! ✅
```

---

## 🎉 Risultato Finale

**Hai ora:**

```
✅ Server SQL production-ready
✅ Profile/Wallet auto-create via trigger
✅ Admin Panel endpoints funzionanti
✅ Transaction tracking SQL
✅ Notifications SQL
✅ Bidding con auto-refund
✅ (Opzionale) Quiz/Leaderboard/Rewards
```

**File backup sicuro:**
```
index_BACKUP_KV.tsx ← Puoi tornare indietro se serve
```

---

## 🔧 Troubleshooting Visuale

### **Problema:** Health check mostra solo "kv": "connected"

**Causa:** Stai ancora usando il vecchio server

**Soluzione:**
```
1. Verifica che index.tsx sia quello da index_NEW_SQL.tsx
2. Controlla primo commento del file:
   ✅ "SPORTIUM - Server con SQL Database"
   ❌ "import * as kv from './kv_store.tsx';" alla riga 5
```

---

### **Problema:** Admin stats dà 404

**Causa:** Admin endpoints non incollati

**Soluzione:**
```
1. Apri index.tsx
2. Cerca: "admin/stats"
3. Non trovato? → Ripeti Operazione 3
```

---

### **Problema:** Deno.serve appears twice

**Causa:** Hai incollato admin_endpoints con un Deno.serve extra

**Soluzione:**
```
1. Apri index.tsx
2. Vai alla fine
3. Cerca "Deno.serve"
4. Devono esserci SOLO QUESTE righe:
   console.log('🚀 SPORTIUM Server starting with SQL...');
   Deno.serve(app.fetch);
5. Elimina altri Deno.serve
```

---

**SPORTIUM Server Upgrade - Complete Guide! 🚀⚽**
