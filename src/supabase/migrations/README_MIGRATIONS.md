# 🚀 SPORTIUM - Database Migrations Guide

## 📋 Overview

Questi file SQL creano il database completo production-grade per SPORTIUM con:
- ✅ 17+ tabelle SQL ottimizzate
- ✅ 4 Storage buckets per immagini
- ✅ Row Level Security (RLS)
- ✅ Performance indexes
- ✅ Auto-triggers
- ✅ Real-time ready

---

## 🎯 Come Applicare le Migrations

### **Metodo 1: SQL Editor (Raccomandato)** ⭐

1. **Vai su Supabase Dashboard**
   - https://supabase.com/dashboard
   - Seleziona progetto SPORTIUM

2. **SQL Editor**
   - Click su "SQL Editor" nella sidebar
   - Click "New Query"

3. **Esegui in ORDINE:**

#### **Step 1: Schema Database**
```sql
-- Copia e incolla TUTTO il contenuto di:
-- 001_complete_schema.sql
```
- Click **"Run"** (o Ctrl+Enter)
- Aspetta completamento (~30 sec)
- ✅ Dovrebbe creare 17 tabelle + trigger

#### **Step 2: Storage Buckets**
```sql
-- Copia e incolla TUTTO il contenuto di:
-- 002_storage_setup.sql
```
- Click **"Run"**
- Aspetta completamento (~10 sec)
- ✅ Crea 4 buckets per immagini

#### **Step 3: Security Policies**
```sql
-- Copia e incolla TUTTO il contenuto di:
-- 003_rls_policies.sql
```
- Click **"Run"**
- Aspetta completamento (~20 sec)
- ✅ Abilita RLS e crea policies

#### **Step 4: Performance Indexes**
```sql
-- Copia e incolla TUTTO il contenuto di:
-- 004_indexes.sql
```
- Click **"Run"**
- Aspetta completamento (~30 sec)
- ✅ Crea 50+ indexes per performance

---

### **Metodo 2: Supabase CLI** (Avanzato)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link progetto
supabase link --project-ref YOUR_PROJECT_ID

# Applica migrations
supabase db push
```

---

## ✅ Verifica Setup

Dopo aver eseguito tutte le migrations:

### **1. Verifica Tabelle**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Dovresti vedere:**
- achievements
- auctions
- bids
- challenge_completions
- daily_challenges
- kv_store_81e425c4 (esistente)
- leaderboard_entries
- notifications
- predictions
- profiles
- quiz_attempts
- quiz_questions
- referrals
- reward_redemptions
- rewards
- transactions
- user_achievements
- wallets

### **2. Verifica Storage Buckets**
```sql
SELECT id, name, public 
FROM storage.buckets 
ORDER BY name;
```

**Dovresti vedere:**
- auction-images
- quiz-images
- reward-images
- user-avatars

### **3. Verifica RLS**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT LIKE 'kv_%';
```

**Tutte le tabelle dovrebbero avere `rowsecurity = true`**

### **4. Verifica Indexes**
```sql
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

**Dovresti vedere 50+ indexes**

---

## 🔄 Migration dal KV Store

Il sistema precedente usava **solo KV Store** per tutto. Ora abbiamo:

### **Cosa è Migrato a SQL:**
✅ `profiles` - Da KV a SQL table  
✅ `wallets` - Da KV a SQL table  
✅ `auctions` - Da KV a SQL table  
✅ `bids` - Da KV a SQL table  
✅ `notifications` - Da KV a SQL table  
✅ `transactions` - NUOVO (tracking completo)  

### **Cosa Rimane in KV Store:**
🔶 `kv_store_81e425c4` - Dati temporanei, cache, sessions

### **Compatibilità:**
- ✅ Il vecchio codice con KV Store continua a funzionare
- ✅ Puoi migrare gradualmente
- ✅ KV Store non viene toccato
- ✅ Zero downtime

---

## 🎯 Cosa Cambia nel Codice

### **PRIMA (KV Store):**
```typescript
// Server code
await kv.set(`profile:${userId}`, profileData);
const profile = await kv.get(`profile:${userId}`);
```

### **DOPO (SQL):**
```typescript
// Server code con Supabase client
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

### **Vantaggi:**
✅ Query complesse (JOIN, WHERE, ORDER BY)  
✅ Real-time subscriptions  
✅ Indexes per performance  
✅ Relazioni tra tabelle  
✅ Constraints e validazioni  
✅ Backup automatici  

---

## 🔧 Troubleshooting

### **Errore: "relation already exists"**
➡️ Tabella già creata, skip e continua

### **Errore: "must be owner of table"**
➡️ Usa service_role key, non anon key

### **Errore: "permission denied"**
➡️ Verifica di essere owner del progetto

### **Storage bucket già esiste**
➡️ Normal, il codice usa `ON CONFLICT DO NOTHING`

### **RLS troppo restrittivo**
➡️ Usa service_role nel backend per operazioni admin

---

## 📊 Schema Diagram

```
auth.users (Supabase Auth)
    ↓
    ├─→ profiles (username, avatar, level, xp)
    ├─→ wallets (balance, earned, spent)
    ├─→ transactions (purchase, reward, spend, refund)
    ├─→ auctions (created_by)
    ├─→ bids (user_id)
    ├─→ notifications (user_id)
    ├─→ quiz_attempts (user_id)
    ├─→ user_achievements (user_id)
    ├─→ leaderboard_entries (user_id)
    ├─→ challenge_completions (user_id)
    ├─→ referrals (referrer_id, referred_id)
    ├─→ reward_redemptions (user_id)
    └─→ predictions (user_id)
```

---

## 🚀 Next Steps

Dopo aver applicato le migrations:

1. **Aggiorna Server Code** - Usa SQL invece di KV per profiles/wallets/auctions
2. **Test Real-time** - Setup subscriptions per live updates
3. **Upload Immagini** - Test storage buckets
4. **Performance Test** - Verifica che queries siano veloci
5. **Rimuovi KV Gradualmente** - Mantieni solo per cache/sessions

---

## 📝 Files Overview

| File | Scopo | Tempo | Tabelle/Buckets |
|------|-------|-------|-----------------|
| `001_complete_schema.sql` | Crea tutte le tabelle | ~30s | 17 tabelle |
| `002_storage_setup.sql` | Crea storage buckets | ~10s | 4 buckets |
| `003_rls_policies.sql` | Security policies | ~20s | RLS su tutte |
| `004_indexes.sql` | Performance indexes | ~30s | 50+ indexes |

**Tempo totale:** ~2 minuti

---

## ✨ Features Abilitate

Dopo il setup completo:

### **Sicurezza:**
- ✅ RLS su tutte le tabelle
- ✅ Policies granulari (user/admin)
- ✅ Storage policies per upload sicuri
- ✅ No direct DB access da frontend

### **Performance:**
- ✅ Indexes su query comuni
- ✅ Composite indexes per JOIN
- ✅ Partial indexes per filtri
- ✅ ANALYZE per query planner

### **Scalabilità:**
- ✅ Relational schema pulito
- ✅ Foreign keys per integrità
- ✅ Constraints per validazione
- ✅ Triggers per auto-update

### **Real-time:**
- ✅ Pronto per subscriptions
- ✅ Broadcast per multi-tab
- ✅ Change tracking

---

## 🎉 Production Ready!

Una volta completato:
- ✅ Database schema completo
- ✅ Security configurata
- ✅ Performance ottimizzata
- ✅ Storage funzionante
- ✅ Pronto per migliaia di utenti

**SPORTIUM ha ora un database enterprise-grade! 🏆⚽**

---

_Per domande o problemi, consulta TROUBLESHOOTING.md_
