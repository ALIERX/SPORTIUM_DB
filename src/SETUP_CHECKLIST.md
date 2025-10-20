# ✅ SPORTIUM - Setup Checklist

## 🎯 Quick Checklist Visuale

Usa questa checklist per verificare che tutto sia setup correttamente.

---

## 📊 PHASE 1: Database Setup

### **1. Migrations Eseguite:**
```
□ 001_complete_schema.sql      (17 tabelle)
□ 002_storage_setup.sql         (4 buckets)
□ 003_rls_policies.sql          (30+ policies)
□ 004_indexes.sql               (50+ indexes)
□ 005_seed_data.sql             (dati di test) - OPZIONALE
```

### **2. Verifica Database:**
```sql
-- In Supabase Dashboard → SQL Editor:

-- ✓ Conta tabelle
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name NOT LIKE 'kv_%';
-- Risultato atteso: 17

-- ✓ Conta buckets
SELECT COUNT(*) FROM storage.buckets;
-- Risultato atteso: 4

-- ✓ Verifica RLS
SELECT COUNT(*) FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT LIKE 'kv_%'
AND rowsecurity = true;
-- Risultato atteso: 17
```

---

## 🔧 PHASE 2: Server Update

### **3. Server Aggiornato:**
```
□ Backup vecchio server → index_BACKUP_KV.tsx
□ Nuovo server SQL → index.tsx
□ (Opzionale) Endpoint completi aggiunti
□ Health check testato
```

### **4. Test Health Check:**
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-81e425c4/health
```

**Risposta attesa:**
```json
{
  "status": "ok",
  "sql": "connected",
  "kv": "available"
}
```

```
□ Status = "ok"
□ SQL = "connected"
□ KV = "available"
```

---

## 🎮 PHASE 3: Test Features

### **5. Test Signup:**
```
□ Profile → Sign Up
□ Email: test@sportium.com
□ Password: Test123!
□ Username: TestUser
□ No errori durante signup
□ Auto-login dopo signup
□ Profile visibile in header
□ Wallet mostra 18,450 FP
```

### **6. Verifica Database dopo Signup:**
```sql
-- ✓ Profile creato
SELECT * FROM profiles WHERE email = 'test@sportium.com';
-- Deve mostrare: id, username, email

-- ✓ Wallet creato
SELECT * FROM wallets WHERE user_id = (
  SELECT id FROM profiles WHERE email = 'test@sportium.com'
);
-- Deve mostrare: balance_points = 18450

-- ✓ Transaction welcome
SELECT * FROM transactions WHERE user_id = (
  SELECT id FROM profiles WHERE email = 'test@sportium.com'
) AND type = 'reward';
-- Deve mostrare: amount = 18450, description = 'Welcome bonus'
```

```
□ Profile in SQL ✓
□ Wallet = 18,450 FP ✓
□ Transaction welcome ✓
```

---

### **7. Test Auctions:**
```
□ Vai a Auctions page
□ Click "Create Auction"
□ Compila form e crea asta
□ Asta visibile nella lista
□ Click su asta creata
□ Piazza offerta (es. 5,000 FP)
□ Offerta confermata
□ Wallet decrementato (18,450 - 5,000 = 13,450)
□ Notifica "Offerta Piazzata!" ricevuta
```

### **8. Verifica Auction in Database:**
```sql
-- ✓ Auction creata
SELECT * FROM auctions;

-- ✓ Bid creata
SELECT * FROM bids;

-- ✓ Wallet aggiornato
SELECT balance_points FROM wallets 
WHERE user_id = 'YOUR_USER_ID';
-- Deve essere decrementato

-- ✓ Transaction spend
SELECT * FROM transactions 
WHERE type = 'spend';
-- Deve mostrare: amount negativo

-- ✓ Notification creata
SELECT * FROM notifications;
```

```
□ Auction in SQL ✓
□ Bid in SQL ✓
□ Wallet decrementato ✓
□ Transaction creata ✓
□ Notification creata ✓
```

---

### **9. Test Wallet (Shop):**
```
□ Vai a Shop page
□ Click pacchetto (es. "5,000 FP")
□ Conferma acquisto
□ Wallet incrementato
□ Transaction "purchase" creata
□ Notifica ricevuta
```

---

## 🔄 PHASE 4: Real-time (Opzionale)

### **10. Real-time Subscriptions:**
```
□ Auction bids - Live updates quando qualcuno fa offerta
□ Wallet - Balance aggiornato in tempo reale
□ Notifications - Toast quando arriva notifica
```

**Test:**
- Apri 2 browser/tab
- Tab 1: Piazza offerta su asta
- Tab 2: Dovrebbe vedere offerta istantaneamente

```
□ Real-time auction bids ✓
□ Real-time wallet ✓
□ Real-time notifications ✓
```

---

## 🧹 PHASE 5: Cleanup

### **11. Rimuovi File Debug:**
```
□ Rimosso <DebugPanel /> da App.tsx
□ Eliminato /components/DebugPanel.tsx
□ (Opzionale) Rimossi file fix signup
□ (Opzionale) Rimosso index_BACKUP_KV.tsx
```

---

## 🎯 PHASE 6: Advanced Features (Opzionale)

### **12. Quiz:**
```
□ Endpoint /quiz/questions funzionante
□ Endpoint /quiz/submit funzionante
□ QuizPage fetcha domande da SQL
□ Risposta corretta → FP aggiunti
□ Leaderboard aggiornata
```

### **13. Leaderboard:**
```
□ Endpoint /leaderboard/:category/:period funzionante
□ LeaderboardPage fetcha da SQL
□ Ranking aggiornato dopo quiz/challenge
```

### **14. Rewards:**
```
□ Endpoint /rewards funzionante
□ Endpoint /rewards/:id/redeem funzionante
□ RewardsPage fetcha premi da SQL
□ Redemption decrementa wallet
□ Stock aggiornato
```

### **15. Challenges:**
```
□ Endpoint /challenges/today funzionante
□ Endpoint /challenges/:id/complete funzionante
□ ChallengesPage fetcha da SQL
□ Completamento → FP reward
```

---

## 📊 Final Status

### **Minimo (Production-Ready):**
```
✅ Database SQL completo
✅ Server SQL funzionante
✅ Signup/Login OK
✅ Wallet tracking OK
✅ Auctions/Bidding OK
✅ Notifications OK
```

### **Raccomandato:**
```
✅ Tutto quanto sopra
✅ Real-time subscriptions
✅ Quiz funzionante
✅ Leaderboard funzionante
✅ Rewards funzionanti
✅ Cleanup completato
```

### **Complete:**
```
✅ Tutto quanto sopra
✅ Challenges funzionanti
✅ Achievements funzionanti
✅ Referrals funzionanti
✅ File upload attivo
✅ Analytics setup
```

---

## 🎉 Congratulazioni!

Se hai checkato tutti i box "Minimo", **SPORTIUM è production-ready!**

### **Prossimi Step:**

1. **Deploy:** Publica su dominio custom
2. **Monitoring:** Setup error tracking
3. **Analytics:** Aggiungi Google Analytics
4. **Performance:** Test con 100+ utenti
5. **Marketing:** Lancia beta!

---

## 🆘 Problemi?

Se qualcosa non funziona:

1. Controlla questa checklist
2. Leggi [`TROUBLESHOOTING.md`](/TROUBLESHOOTING.md)
3. Verifica [`FINAL_INTEGRATION_GUIDE.md`](/FINAL_INTEGRATION_GUIDE.md)
4. Controlla console per errori dettagliati

---

**SPORTIUM - Ready to Scale! 🚀⚽🏆**
