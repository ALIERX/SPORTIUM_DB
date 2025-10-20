# 🔄 SPORTIUM - Piano Aggiornamento Codice per SQL

## 📋 Overview

Dopo aver applicato le migrations SQL, ecco cosa serve aggiornare nel codice per usare il database SQL invece del KV Store.

---

## ✅ STEP 1: Backup Server Attuale

**Prima di fare qualsiasi cosa:**

```bash
# Il tuo server attuale è: /supabase/functions/server/index.tsx
# Ho creato la versione SQL in: /supabase/functions/server/index_NEW_SQL.tsx
```

**Non sostituire subito!** Prima leggi questa guida.

---

## 🎯 STEP 2: Sostituisci Server

### **Opzione A: Rename (Raccomandato)**

1. Rinomina il vecchio:
   - `/supabase/functions/server/index.tsx` → `/supabase/functions/server/index_OLD_KV.tsx`

2. Rinomina il nuovo:
   - `/supabase/functions/server/index_NEW_SQL.tsx` → `/supabase/functions/server/index.tsx`

### **Opzione B: Copy-Paste**

1. Apri `/supabase/functions/server/index.tsx`
2. Fai backup del contenuto
3. Copia TUTTO da `/supabase/functions/server/index_NEW_SQL.tsx`
4. Sostituisci il contenuto

---

## ✅ STEP 3: Cosa Cambia

### **Prima (KV Store):**
```typescript
// Get profile
const profile = await kv.get(`profile:${userId}`);

// Update wallet
wallet.balance_points += amount;
await kv.set(`wallet:${userId}`, wallet);
```

### **Dopo (SQL):**
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

## ✅ STEP 4: Endpoints Aggiornati

### **Nel nuovo server SQL hai:**

#### **Auth:**
- `POST /auth/check-email` - ✅ Unchanged
- `POST /auth/signup` - ✅ Usa trigger auto per profile/wallet

#### **Profile:**
- `GET /profile/:userId` - ✅ SQL con JOIN wallet
- `PUT /profile/:userId` - ✅ SQL update

#### **Wallet:**
- `GET /wallet/:userId` - ✅ SQL query
- `POST /wallet/:userId/add` - ✅ SQL + transactions table

#### **Auctions:**
- `GET /auctions` - ✅ SQL con JOIN bids count
- `GET /auctions/:id` - ✅ SQL con tutte le bids
- `POST /auctions/create` - ✅ SQL insert
- `POST /auctions/:id/bid` - ✅ SQL transaction completa (bid + refund + notifications)

#### **Notifications:**
- `GET /notifications/:userId` - ✅ SQL query
- `PUT /notifications/:id/read` - ✅ SQL update

#### **Transactions:**
- `GET /transactions/:userId` - ✅ SQL query (storico completo)

---

## ✅ STEP 5: Cosa Aggiungere (Opzionale)

Ho creato solo gli endpoint CRITICI. Per funzionalità complete, aggiungi:

### **Quiz Endpoints** (da aggiungere):
```typescript
// GET /quiz/questions - Get random questions
// POST /quiz/submit - Submit answer & update leaderboard
```

### **Leaderboard Endpoints**:
```typescript
// GET /leaderboard/:category/:period - Get rankings
```

### **Rewards Endpoints**:
```typescript
// GET /rewards - Get available rewards
// POST /rewards/:id/redeem - Redeem reward
```

### **Challenges Endpoints**:
```typescript
// GET /challenges/today - Get today's challenges
// POST /challenges/:id/complete - Mark as completed
```

Vuoi che li creo tutti? O preferisci farlo gradualmente?

---

## ✅ STEP 6: Test del Nuovo Server

Dopo aver sostituito il server:

### **1. Test Health Check:**
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-81e425c4/health
```

**Aspetta:**
```json
{
  "status": "ok",
  "sql": "connected",
  "kv": "available"
}
```

### **2. Test Signup:**
- Profile → Sign Up
- Crea nuovo account
- Verifica:
  - ✅ No errori
  - ✅ Profile creato in SQL
  - ✅ Wallet creato in SQL
  - ✅ Welcome transaction in SQL

### **3. Test Auction:**
- Vai a Auctions
- Crea un'asta
- Verifica:
  - ✅ Asta visibile
  - ✅ Piazza offerta
  - ✅ Wallet decrementato
  - ✅ Notifica ricevuta

---

## ✅ STEP 7: Verifica Database

Dopo i test, controlla in Supabase Dashboard:

```sql
-- Check profiles
SELECT * FROM profiles;

-- Check wallets
SELECT * FROM wallets;

-- Check transactions
SELECT * FROM transactions;

-- Check auctions
SELECT * FROM auctions;

-- Check bids
SELECT * FROM bids;

-- Check notifications
SELECT * FROM notifications;
```

**Dovresti vedere i tuoi dati di test!**

---

## ✅ STEP 8: Frontend - Nessun Cambio Necessario!

**Ottima notizia:** Il frontend (AuthContext, pagine) **non richiede modifiche**!

Perché?
- AuthContext già chiama gli endpoint server
- Gli endpoint server hanno gli stessi URL
- Solo la logica interna del server è cambiata (KV → SQL)
- Le response JSON sono compatibili

**Quindi:**
- ✅ AuthContext continua a funzionare
- ✅ Wallet refresh funziona
- ✅ Profile fetch funziona
- ✅ Tutto come prima, ma con SQL!

---

## ✅ STEP 9: Aggiungi Real-time (Opzionale)

Se vuoi aggiornamenti live (bids, notifiche, wallet):

### **1. In AuctionDetailPage:**
```typescript
import subscriptions from '../utils/supabase/subscriptions';

// Nel componente
useEffect(() => {
  const channel = subscriptions.subscribeToAuctionBids(
    auctionId,
    (bid) => {
      // Update UI con nuova bid
      fetchAuction(); // Re-fetch
    }
  );

  return () => subscriptions.unsubscribe(channel);
}, [auctionId]);
```

### **2. In Header (Wallet updates):**
```typescript
useEffect(() => {
  if (user?.id) {
    const channel = subscriptions.subscribeToWallet(
      user.id,
      (wallet) => {
        // Update wallet state
        setWallet(wallet);
      }
    );

    return () => subscriptions.unsubscribe(channel);
  }
}, [user?.id]);
```

### **3. In NotificationsPanel:**
```typescript
useEffect(() => {
  if (user?.id) {
    const channel = subscriptions.subscribeToNotifications(
      user.id,
      (notification) => {
        // Add to notifications list
        toast(notification.message);
      }
    );

    return () => subscriptions.unsubscribe(channel);
  }
}, [user?.id]);
```

---

## ✅ STEP 10: Cleanup

Dopo che tutto funziona:

### **Rimuovi file vecchi:**
- `/supabase/functions/server/index_OLD_KV.tsx` (se hai rinominato)
- `/components/DebugPanel.tsx` (non serve più)

### **Aggiorna App.tsx:**
```typescript
// Rimuovi questa riga:
<DebugPanel />
```

### **Rimuovi guide fix (opzionale):**
Questi file erano per il bug signup, ora risolto:
- `START_HERE.md`
- `QUICK_FIX.md`
- `STEP_BY_STEP_FIX.md`
- `README_FIX_SIGNUP.md`
- `SIGNUP_FIX_SUMMARY.md`
- `FIX_INDEX.md`
- `FIX_TRIGGER.sql`
- `CHECKLIST_FIX.md`

---

## 📊 Checklist Completa

### **Setup Database:**
- [ ] Eseguito migrations 001-005 in Supabase
- [ ] Verificato 17 tabelle create
- [ ] Verificato 4 buckets creati

### **Update Server:**
- [ ] Backup vecchio server
- [ ] Sostituito con nuovo server SQL
- [ ] Testato health check
- [ ] Testato signup
- [ ] Testato auctions

### **Test Frontend:**
- [ ] Signup funziona
- [ ] Login funziona
- [ ] Profile caricato
- [ ] Wallet visibile (18,450 FP)
- [ ] Aste visibili
- [ ] Bidding funziona
- [ ] Wallet aggiornato dopo bid
- [ ] Notifiche ricevute

### **Real-time (Opzionale):**
- [ ] Subscription auctions
- [ ] Subscription wallet
- [ ] Subscription notifications

### **Cleanup:**
- [ ] Rimosso DebugPanel
- [ ] Rimosso file vecchi
- [ ] Rimosso guide fix

---

## 🎉 Risultato Finale

Dopo aver completato tutti gli step:

```
✅ Database SQL production-ready
✅ Server usa SQL per tutto
✅ Frontend funziona senza modifiche
✅ Signup/Login/Wallet/Auctions OK
✅ Transactions tracked in SQL
✅ Notifications funzionanti
✅ Real-time (opzionale) attivo
✅ Pronto per scalare!
```

---

## 🆘 Troubleshooting

### **Errore "table does not exist"**
➡️ Non hai eseguito le migrations. Vai in Supabase Dashboard → SQL Editor e esegui 001-004.

### **Errore "permission denied"**
➡️ Problema RLS. Il server usa SERVICE_ROLE_KEY che bypassa RLS. Verifica la key in env.

### **Wallet non si aggiorna**
➡️ Chiama `refreshWallet()` dopo operazioni. O aggiungi real-time subscription.

### **Bids non visibili**
➡️ Verifica RLS policies. Le bids dovrebbero essere visibili a tutti per quell'auction.

---

## 🚀 Next Steps

1. **Sostituisci il server** (Step 2)
2. **Testa signup** (Step 6)
3. **Testa auctions** (Step 6)
4. **Aggiungi real-time** (Step 9) - Opzionale
5. **Cleanup** (Step 10)

**Vuoi che creo anche gli endpoint per Quiz, Leaderboard, Rewards?**

Dimmi e li aggiungo! 🎮⚽
