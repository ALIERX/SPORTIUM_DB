# 🎯 SPORTIUM - Final Integration Guide

## 📋 Overview

Hai tutto pronto! Ora serve **connettere** il database SQL al codice esistente. Questa guida ti mostra esattamente cosa fare.

---

## ✅ STEP 1: Verifica Database Setup

Prima di tutto, assicurati di aver eseguito le migrations:

```sql
-- In Supabase Dashboard → SQL Editor, verifica:

-- 1. Conta tabelle
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name NOT LIKE 'kv_%';
-- Deve mostrare: 17

-- 2. Conta buckets
SELECT COUNT(*) FROM storage.buckets;
-- Deve mostrare: 4

-- 3. Verifica RLS
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename NOT LIKE 'kv_%';
-- Tutte devono avere rowsecurity = t
```

**Se manca qualcosa**, torna a [`QUICK_START_PRODUCTION.md`](/QUICK_START_PRODUCTION.md) e esegui le migrations.

---

## ✅ STEP 2: Aggiorna Server

### **Opzione A: Sostituisci Completamente (Raccomandato)**

Ho creato un server completo con SQL. Sostituiscilo:

1. **Backup vecchio server:**
   ```
   Rinomina: /supabase/functions/server/index.tsx
   →         /supabase/functions/server/index_BACKUP_KV.tsx
   ```

2. **Usa nuovo server:**
   ```
   Rinomina: /supabase/functions/server/index_NEW_SQL.tsx
   →         /supabase/functions/server/index.tsx
   ```

3. **Aggiungi endpoint completi (opzionale):**
   - Apri `/supabase/functions/server/COMPLETE_ENDPOINTS.tsx`
   - Copia TUTTO il contenuto
   - Incolla alla fine di `/supabase/functions/server/index.tsx` (prima di `Deno.serve`)

### **Opzione B: Merge Manuale**

Se hai customizzato il server:

1. Apri `/supabase/functions/server/index_NEW_SQL.tsx`
2. Copia gli endpoint che ti servono
3. Incollali nel tuo `index.tsx`
4. Sostituisci le chiamate `kv.get/set` con query SQL

---

## ✅ STEP 3: Test Setup

Dopo aver sostituito il server:

### **1. Test Health Check:**

```bash
# In terminale o browser
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-81e425c4/health
```

**Risposta attesa:**
```json
{
  "status": "ok",
  "sql": "connected",
  "kv": "available",
  "timestamp": "2025-01-15T..."
}
```

---

### **2. Test Signup:**

1. Apri la tua app SPORTIUM
2. Profile → Sign Up
3. Crea nuovo account:
   - Email: test@example.com
   - Password: Test123!
   - Username: TestUser

**Cosa deve succedere:**
- ✅ Account creato senza errori
- ✅ Auto-login dopo signup
- ✅ Profile visibile in Header
- ✅ Wallet mostra 18,450 FP

---

### **3. Verifica Database:**

Torna in Supabase Dashboard → SQL Editor:

```sql
-- 1. Verifica profile creato
SELECT * FROM profiles WHERE email = 'test@example.com';
-- Deve mostrare: id, username, email, created_at

-- 2. Verifica wallet creato
SELECT * FROM wallets WHERE user_id = (
  SELECT id FROM profiles WHERE email = 'test@example.com'
);
-- Deve mostrare: balance_points = 18450

-- 3. Verifica transaction welcome
SELECT * FROM transactions WHERE user_id = (
  SELECT id FROM profiles WHERE email = 'test@example.com'
);
-- Deve mostrare: type = 'reward', amount = 18450
```

**Se vedi i dati → Setup OK! ✅**

---

## ✅ STEP 4: Test Features

### **Test Auctions:**

1. Vai a Auctions page
2. Click "Create Auction"
3. Compila form:
   - Title: "Maglia Autografata Ronaldo"
   - Starting Bid: 5000 FP
   - End Time: Tomorrow
   - Click "Create"

**Verifica:**
```sql
SELECT * FROM auctions;
-- Deve mostrare la tua asta
```

4. Piazza un'offerta:
   - Click sull'asta
   - Bid: 5500 FP
   - Conferma

**Verifica:**
```sql
-- 1. Bid creata
SELECT * FROM bids;

-- 2. Wallet decrementato
SELECT balance_points FROM wallets WHERE user_id = 'YOUR_USER_ID';
-- Deve mostrare: 18450 - 5500 = 12950

-- 3. Transaction creata
SELECT * FROM transactions WHERE type = 'spend';
-- Deve mostrare: amount = -5500

-- 4. Notification creata
SELECT * FROM notifications;
-- Deve mostrare: "Offerta Piazzata!"
```

---

### **Test Wallet:**

1. Vai a Shop page
2. Compra un pacchetto:
   - Click "5,000 FP - €4.99"
   - Click "Conferma Acquisto"

**Verifica:**
```sql
-- Wallet incrementato
SELECT * FROM wallets WHERE user_id = 'YOUR_USER_ID';
-- balance_points deve essere aumentato di 5000

-- Transaction purchase creata
SELECT * FROM transactions WHERE type = 'purchase';
```

---

## ✅ STEP 5: Frontend - NO CHANGES NEEDED! 🎉

**Ottima notizia:** Il frontend funziona già!

Perché?
- AuthContext chiama gli endpoint server
- Gli URL degli endpoint sono uguali
- Le response JSON sono compatibili
- Solo la logica interna del server è cambiata (KV → SQL)

**Quindi NON serve modificare:**
- ✅ `AuthContext.tsx` - OK così com'è
- ✅ `App.tsx` - OK così com'è
- ✅ Header, Navigation - OK così com'è
- ✅ Tutte le pagine - OK così com'è

---

## ✅ STEP 6: Aggiungi Real-time (Opzionale ma Raccomandato)

Per aggiornamenti live (bids, wallet, notifiche):

### **1. Auction Detail - Live Bids:**

Apri `/components/AuctionDetailPage.tsx` e aggiungi:

```typescript
import subscriptions from '../utils/supabase/subscriptions';

// Nel componente, dopo gli useState
useEffect(() => {
  if (!auctionId) return;

  // Subscribe to new bids
  const channel = subscriptions.subscribeToAuctionBids(
    auctionId,
    (newBid) => {
      console.log('New bid received!', newBid);
      // Re-fetch auction data
      fetchAuction();
    }
  );

  return () => {
    subscriptions.unsubscribe(channel);
  };
}, [auctionId]);
```

### **2. Header - Live Wallet:**

Apri `/components/Header.tsx` e aggiungi:

```typescript
import { useAuth } from '../utils/supabase/AuthContext';
import subscriptions from '../utils/supabase/subscriptions';

// Nel componente
const { user, wallet, refreshWallet } = useAuth();

useEffect(() => {
  if (!user?.id) return;

  // Subscribe to wallet changes
  const channel = subscriptions.subscribeToWallet(
    user.id,
    (updatedWallet) => {
      console.log('Wallet updated!', updatedWallet);
      refreshWallet(); // Refresh from AuthContext
    }
  );

  return () => {
    subscriptions.unsubscribe(channel);
  };
}, [user?.id]);
```

### **3. Notifications - Live Updates:**

Se hai un NotificationsPanel, aggiungi:

```typescript
import subscriptions from '../utils/supabase/subscriptions';
import { toast } from 'sonner';

useEffect(() => {
  if (!user?.id) return;

  const channel = subscriptions.subscribeToNotifications(
    user.id,
    (notification) => {
      console.log('New notification!', notification);
      toast(notification.title, {
        description: notification.message,
      });
      // Add to notifications list
    }
  );

  return () => {
    subscriptions.unsubscribe(channel);
  };
}, [user?.id]);
```

---

## ✅ STEP 7: Cleanup

Rimuovi file non più necessari:

### **1. Rimuovi DebugPanel:**

Apri `/App.tsx` e rimuovi:

```typescript
import { DebugPanel } from "./components/DebugPanel";

// ...

// Rimuovi questa riga (circa linea 119):
<DebugPanel />
```

Poi elimina il file:
```
/components/DebugPanel.tsx
```

### **2. Rimuovi file di Fix (opzionali):**

Se tutto funziona, puoi rimuovere i file di troubleshooting signup:
- `START_HERE.md`
- `QUICK_FIX.md`
- `STEP_BY_STEP_FIX.md`
- `README_FIX_SIGNUP.md`
- `SIGNUP_FIX_SUMMARY.md`
- `FIX_INDEX.md`
- `FIX_TRIGGER.sql`
- `CHECKLIST_FIX.md`

---

## ✅ STEP 8: Aggiungi Features Complete (Opzionale)

Vuoi Quiz, Leaderboard, Rewards funzionanti?

### **Hai già gli endpoint server!**

Sono in `/supabase/functions/server/COMPLETE_ENDPOINTS.tsx`. Basta:

1. Copiarli nel tuo `index.tsx`
2. Aggiornare le pagine per chiamarli

### **Quiz Page:**

```typescript
// /components/QuizPage.tsx

const fetchQuestions = async () => {
  const response = await fetch(
    `${serverUrl}/quiz/questions?category=serie_a&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );
  const { questions } = await response.json();
  setQuestions(questions);
};

const submitAnswer = async (questionId, answer) => {
  const response = await fetch(
    `${serverUrl}/quiz/submit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        question_id: questionId,
        selected_answer: answer,
        time_taken: timeElapsed,
      }),
    }
  );
  const { correct, points_earned } = await response.json();
  // Handle result
};
```

### **Leaderboard Page:**

```typescript
const fetchLeaderboard = async () => {
  const response = await fetch(
    `${serverUrl}/leaderboard/quiz/weekly`,
    {
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );
  const { leaderboard } = await response.json();
  setLeaderboard(leaderboard);
};
```

### **Rewards Page:**

```typescript
const fetchRewards = async () => {
  const response = await fetch(
    `${serverUrl}/rewards`,
    {
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );
  const { rewards } = await response.json();
  setRewards(rewards);
};

const redeemReward = async (rewardId) => {
  const response = await fetch(
    `${serverUrl}/rewards/${rewardId}/redeem`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        delivery_info: { address: '...' },
      }),
    }
  );
  const { success } = await response.json();
  // Handle success
};
```

---

## 📊 Checklist Completa

### **Database:**
- [ ] Eseguito migrations 001-005
- [ ] Verificato 17 tabelle
- [ ] Verificato 4 buckets
- [ ] Verificato RLS abilitato

### **Server:**
- [ ] Backup vecchio server
- [ ] Sostituito con nuovo SQL server
- [ ] (Opzionale) Aggiunti endpoint completi
- [ ] Testato health check

### **Test Features:**
- [ ] Signup funziona
- [ ] Profile creato in SQL
- [ ] Wallet creato con 18,450 FP
- [ ] Transaction welcome creata
- [ ] Login funziona
- [ ] Asta creata
- [ ] Bid piazzata
- [ ] Wallet decrementato
- [ ] Notification ricevuta

### **Real-time (Opzionale):**
- [ ] Subscription auction bids
- [ ] Subscription wallet updates
- [ ] Subscription notifications

### **Cleanup:**
- [ ] Rimosso DebugPanel
- [ ] Rimosso file fix
- [ ] Rimosso backup server

### **Advanced (Opzionale):**
- [ ] Quiz funzionante
- [ ] Leaderboard funzionante
- [ ] Rewards funzionanti
- [ ] Challenges funzionanti

---

## 🎉 Risultato Finale

Dopo aver completato tutti gli step:

```
✅ Database SQL production-ready con 17 tabelle
✅ Server usa SQL per profiles/wallets/auctions/bids
✅ Signup crea automaticamente profile+wallet via trigger
✅ Transactions tracked in SQL
✅ Notifications funzionanti
✅ Bidding con auto-refund funzionante
✅ Real-time updates (opzionale)
✅ Frontend funziona senza modifiche
✅ Pronto per migliaia di utenti!
```

---

## 🆘 Troubleshooting

### **"table does not exist"**
➡️ Non hai eseguito le migrations. Vai su Supabase Dashboard → SQL Editor e esegui 001-004.

### **"permission denied for table"**
➡️ Il server usa `SUPABASE_SERVICE_ROLE_KEY` che bypassa RLS. Verifica che sia configurata.

### **"Signup failed"**
➡️ Controlla console del server per errori dettagliati. Il trigger auto-create profile/wallet dovrebbe funzionare.

### **"Wallet not found"**
➡️ Il trigger non ha creato il wallet. Verifica che la migration 001 sia stata eseguita correttamente.

### **Real-time non funziona**
➡️ Verifica che Supabase Realtime sia abilitato nel progetto. Settings → API → Realtime enabled.

---

## 🚀 Next Steps

1. **Completa questo setup** (Step 1-7)
2. **Testa tutto** (Signup, Auctions, Wallet)
3. **Aggiungi Real-time** (Step 6)
4. **Implementa Quiz/Leaderboard/Rewards** (Step 8)
5. **Deploy in produzione** 🎉

---

## 📚 Reference

- **Setup database:** [`QUICK_START_PRODUCTION.md`](/QUICK_START_PRODUCTION.md)
- **Schema completo:** [`COMPLETE_SETUP_SUMMARY.md`](/COMPLETE_SETUP_SUMMARY.md)
- **Code examples:** [`CODE_MIGRATION_GUIDE.md`](/CODE_MIGRATION_GUIDE.md)
- **Troubleshooting:** [`TROUBLESHOOTING.md`](/TROUBLESHOOTING.md)
- **Tutti i docs:** [`DOCUMENTATION_INDEX.md`](/DOCUMENTATION_INDEX.md)

---

**SPORTIUM è pronto per il lancio! 🏆⚽**

_Hai domande? Controlla TROUBLESHOOTING.md o chiedi!_
