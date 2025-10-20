# 🚨 FIX SIGNUP - ISTRUZIONI RAPIDE

## ❌ Problema
```
ERROR: column "total_earned" of relation "wallets" does not exist
```

Gli utenti **NON riescono a registrarsi** perché il trigger di auto-creazione wallet fallisce.

---

## ✅ Soluzione (5 minuti)

### **Step 1: Apri Supabase Dashboard**
1. Vai su https://supabase.com/dashboard
2. Seleziona il tuo progetto SPORTIUM
3. Click **SQL Editor** (menu a sinistra)

---

### **Step 2: Esegui il Fix**

1. Click **+ New Query**
2. Apri il file **`/SIGNUP_FIX_COMPLETE.sql`** da questo progetto
3. **Copia TUTTO** il contenuto (Ctrl+A, Ctrl+C)
4. **Incolla** nell'editor SQL di Supabase
5. Click **RUN** (o Ctrl+Enter)

**Tempo:** ~10 secondi

---

### **Step 3: Verifica il Fix**

1. Click **+ New Query** (nuova query)
2. Apri il file **`/VERIFY_FIX.sql`**
3. Copia tutto
4. Incolla nell'editor
5. Click **RUN**

**Controlla i risultati:**
- ✅ wallets table ha: `total_earned`, `total_spent`
- ✅ Trigger `on_auth_user_created` esiste
- ✅ Function `handle_new_user` esiste

---

### **Step 4: Test Signup**

1. Apri la tua app SPORTIUM
2. Profile → Sign Up
3. Inserisci:
   - Email: `test@sportium.app`
   - Password: `TestPass123!`
   - Username: `TestUser`
4. Click **Sign Up**

✅ **Dovrebbe funzionare!**

---

### **Step 5: Verifica Dati Creati**

In Supabase SQL Editor:

```sql
-- Check profile
SELECT * FROM profiles WHERE email = 'test@sportium.app';

-- Check wallet
SELECT w.* 
FROM wallets w
JOIN profiles p ON w.user_id = p.id
WHERE p.email = 'test@sportium.app';
```

**Dovresti vedere:**
- ✅ Profile creato
- ✅ Wallet con 18,450 FP
- ✅ `total_earned = 18450`
- ✅ `total_spent = 0`

---

## 🔧 Se Hai Utenti Esistenti Senza Wallet

Se avevi utenti creati **PRIMA** del fix che non hanno wallet:

1. Apri **`/CREATE_MISSING_WALLETS.sql`**
2. Copia tutto
3. Incolla in SQL Editor
4. RUN

Questo creerà wallet per tutti gli utenti esistenti.

---

## 📊 Cosa Fa il Fix

### **PRIMA (Errore):**
```
User signup → Trigger → Crea wallet
                     ↓
              ERROR: total_earned non esiste ❌
                     ↓
              ROLLBACK → Signup fallisce
```

### **DOPO (Funziona):**
```
User signup → Trigger → Crea wallet
                     ↓
              Wallet creato con:
              - balance_points: 18,450
              - total_earned: 18,450 ✅
              - total_spent: 0 ✅
                     ↓
              Transaction + Notification
                     ↓
              SUCCESS! 🎉
```

---

## 🧪 Debug Avanzato

### **Controlla Log Trigger:**

In Supabase Dashboard → Logs → Postgres Logs

Cerca messaggi tipo:
```
Creating user profile for: test@sportium.app
Using username: TestUser
Profile created successfully
Wallet created with 18,450 FP
Welcome transaction created
Welcome notification created
User setup completed successfully
```

---

### **Se Continua a NON Funzionare:**

1. **Verifica schema manualmente:**

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'wallets'
ORDER BY ordinal_position;
```

**DEVE mostrare:**
- id
- user_id
- balance_points (default 0)
- **total_earned** (default 0) ← IMPORTANTE
- **total_spent** (default 0) ← IMPORTANTE
- created_at
- updated_at

---

2. **Ricrea tabella wallets se necessario:**

```sql
-- ATTENZIONE: Questo elimina tutti i wallet esistenti!
-- Usa solo se la tabella è vuota o per test

DROP TABLE IF EXISTS wallets CASCADE;

CREATE TABLE wallets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance_points integer DEFAULT 0 NOT NULL,
  total_earned integer DEFAULT 0 NOT NULL,
  total_spent integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_balance ON wallets(balance_points);

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON wallets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
```

Poi **esegui di nuovo** `/SIGNUP_FIX_COMPLETE.sql`

---

## ✅ Checklist Finale

```
□ Eseguito SIGNUP_FIX_COMPLETE.sql
□ Eseguito VERIFY_FIX.sql
□ Verificato wallets table ha total_earned e total_spent
□ Verificato trigger on_auth_user_created esiste
□ Testato signup con nuovo utente
□ Verificato profile + wallet creati correttamente
□ Wallet ha 18,450 FP
□ FUNZIONA! 🎉
```

---

## 📂 File da Usare

| File | Quando Usarlo |
|------|---------------|
| **`SIGNUP_FIX_COMPLETE.sql`** | ⭐ Esegui SUBITO - Fix principale |
| **`VERIFY_FIX.sql`** | Dopo il fix - Verifica tutto OK |
| **`CREATE_MISSING_WALLETS.sql`** | Solo se hai utenti senza wallet |

---

## 🎯 Quick Commands

### **Copia da Terminale:**

```bash
# Mac/Linux
cat SIGNUP_FIX_COMPLETE.sql | pbcopy

# Windows (PowerShell)
Get-Content SIGNUP_FIX_COMPLETE.sql | Set-Clipboard
```

Poi incolla in Supabase SQL Editor!

---

## 🎉 Risultato Finale

Dopo il fix, ogni nuovo utente riceverà automaticamente:

```
✅ Profile creato
✅ Wallet con 18,450 FP
✅ Transaction "Welcome Bonus"
✅ Notification "Benvenuto su SPORTIUM!"
```

Tutto automatico via trigger SQL! 🚀⚽

---

**Start HERE:** `/SIGNUP_FIX_COMPLETE.sql` 

Copia → Incolla in Supabase SQL Editor → RUN → Fatto! 💪
