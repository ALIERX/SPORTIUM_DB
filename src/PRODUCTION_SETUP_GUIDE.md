# 🚀 SPORTIUM - Production Setup Guide

## 📋 Overview

Questa guida ti porta dal database attuale (KV Store) a un **setup production-grade completo** con:
- ✅ SQL Database con 17+ tabelle
- ✅ Storage Buckets per immagini
- ✅ Row Level Security
- ✅ Real-time subscriptions
- ✅ Performance indexes
- ✅ Seed data per testing

**Tempo totale:** ~10-15 minuti

---

## 🎯 Step 1: Backup Dati Esistenti (Opzionale ma Raccomandato)

Prima di iniziare, fai backup dei dati nel KV Store:

```sql
-- Esporta tutti i dati KV
SELECT * FROM public.kv_store_81e425c4;
```

**Nota:** Il KV Store NON verrà toccato. Continuerà a funzionare insieme al nuovo schema SQL.

---

## 🎯 Step 2: Applica Database Migrations

### **Vai su Supabase Dashboard**
1. https://supabase.com/dashboard
2. Seleziona progetto SPORTIUM
3. Click **"SQL Editor"**

### **Esegui le Migration in ORDINE:**

#### ✅ Migration 1: Complete Schema (001)

**File:** `/supabase/migrations/001_complete_schema.sql`

1. Apri il file
2. Copia **TUTTO** il contenuto
3. Incolla nel SQL Editor → New Query
4. Click **"Run"**
5. Aspetta ~30 secondi

**Cosa fa:**
- Crea 17 tabelle SQL
- Setup auto-triggers per timestamps
- Crea trigger per auto-create profile/wallet su signup
- Foreign keys e constraints

**Output atteso:**
```
✅ CREATE TABLE (x17)
✅ CREATE FUNCTION
✅ CREATE TRIGGER
```

---

#### ✅ Migration 2: Storage Setup (002)

**File:** `/supabase/migrations/002_storage_setup.sql`

1. Copia **TUTTO** il contenuto
2. Incolla nel SQL Editor → New Query
3. Click **"Run"**
4. Aspetta ~10 secondi

**Cosa fa:**
- Crea 4 storage buckets
- Setup policies per upload
- Helper functions per URLs

**Output atteso:**
```
✅ INSERT INTO storage.buckets (x4)
✅ CREATE POLICY (x16)
```

---

#### ✅ Migration 3: RLS Policies (003)

**File:** `/supabase/migrations/003_rls_policies.sql`

1. Copia **TUTTO** il contenuto
2. Incolla nel SQL Editor → New Query
3. Click **"Run"**
4. Aspetta ~20 secondi

**Cosa fa:**
- Abilita Row Level Security su tutte le tabelle
- Crea policies granulari (user vs admin)
- Protegge dati sensibili

**Output atteso:**
```
✅ ALTER TABLE ... ENABLE ROW LEVEL SECURITY (x17)
✅ CREATE POLICY (x30+)
```

---

#### ✅ Migration 4: Performance Indexes (004)

**File:** `/supabase/migrations/004_indexes.sql`

1. Copia **TUTTO** il contenuto
2. Incolla nel SQL Editor → New Query
3. Click **"Run"**
4. Aspetta ~30 secondi

**Cosa fa:**
- Crea 50+ indexes per performance
- Composite indexes per query complesse
- ANALYZE tables per query optimizer

**Output atteso:**
```
✅ CREATE INDEX (x50+)
✅ ANALYZE (x17)
```

---

#### ✅ Migration 5: Seed Data (005) - OPZIONALE

**File:** `/supabase/migrations/005_seed_data.sql`

1. Copia **TUTTO** il contenuto
2. Incolla nel SQL Editor → New Query
3. Click **"Run"**
4. Aspetta ~10 secondi

**Cosa fa:**
- Popola achievements
- Popola quiz questions
- Popola daily challenges
- Popola rewards catalog

**Output atteso:**
```
✅ INSERT INTO achievements (x8)
✅ INSERT INTO quiz_questions (x11)
✅ INSERT INTO daily_challenges (x4)
✅ INSERT INTO rewards (x6)
```

---

## ✅ Step 3: Verifica Setup

### **1. Verifica Tabelle**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name NOT LIKE 'kv_%'
ORDER BY table_name;
```

**Dovresti vedere 17 tabelle:**
- achievements
- auctions
- bids
- challenge_completions
- daily_challenges
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

---

### **2. Verifica Storage Buckets**

```sql
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
ORDER BY name;
```

**Dovresti vedere:**
- auction-images (5MB, public)
- quiz-images (3MB, public)
- reward-images (5MB, public)
- user-avatars (2MB, public)

---

### **3. Verifica RLS Abilitato**

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT LIKE 'kv_%'
ORDER BY tablename;
```

**Tutte le tabelle devono avere `rowsecurity = t` (true)**

---

### **4. Test Trigger Auto-Create**

Prova a creare un nuovo utente tramite signup:
- Profile → Sign Up
- Crea un account di test

Poi verifica nel SQL Editor:

```sql
SELECT 
  p.username,
  w.balance_points,
  t.amount as welcome_bonus
FROM profiles p
JOIN wallets w ON w.user_id = p.id
JOIN transactions t ON t.user_id = p.id AND t.type = 'reward'
WHERE p.email = 'TUA_EMAIL_TEST@example.com';
```

**Dovresti vedere:**
- Username creato
- Wallet con 18,450 FP
- Transaction di welcome bonus

---

## 🎯 Step 4: Cleanup Debug Files

Ora che hai il database production-ready, rimuovi file di debug:

### **Rimuovi Debug Panel:**

<function_calls>
<invoke name="view_tool">
<parameter name="path">/App.tsx