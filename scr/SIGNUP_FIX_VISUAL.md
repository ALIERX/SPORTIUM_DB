# 🎯 Signup Fix - Visual Guide

## 📊 Il Problema

```
┌─────────────────────────────────────────────────────────┐
│  User fa Signup                                         │
│  ↓                                                      │
│  Supabase Auth crea user in auth.users ✅               │
│  ↓                                                      │
│  Trigger: on_auth_user_created                         │
│  ↓                                                      │
│  Function: handle_new_user()                           │
│  ├─ Crea profile in profiles table ✅                  │
│  └─ Crea wallet in wallets table                       │
│     ├─ INSERT balance_points: 18450 ✅                 │
│     ├─ INSERT total_earned: 18450 ❌ ERRORE!          │
│     └─ Colonna "total_earned" non esiste!              │
│  ↓                                                      │
│  ROLLBACK → Signup fallisce ❌                         │
└─────────────────────────────────────────────────────────┘
```

**Errore Supabase Log:**
```json
{
  "error": "ERROR: column \"total_earned\" of relation \"wallets\" does not exist (SQLSTATE 42703)",
  "path": "/admin/users"
}
```

---

## ✅ La Soluzione

```
┌─────────────────────────────────────────────────────────┐
│  1. Esegui SIGNUP_FIX_COMPLETE.sql                     │
│     ↓                                                   │
│     Verifica schema wallets table                      │
│     ├─ balance_points esiste? ✅                       │
│     ├─ total_earned esiste? ❌                         │
│     └─ total_spent esiste? ❌                          │
│     ↓                                                   │
│     Aggiungi colonne mancanti:                         │
│     ├─ ADD COLUMN total_earned DEFAULT 0 ✅            │
│     └─ ADD COLUMN total_spent DEFAULT 0 ✅             │
│     ↓                                                   │
│     Drop vecchio trigger ✅                            │
│     ↓                                                   │
│     Crea nuovo trigger aggiornato ✅                   │
│     ↓                                                   │
│  2. Verifica con VERIFY_FIX.sql                        │
│     ├─ wallets ha total_earned? ✅                     │
│     ├─ Trigger esiste? ✅                              │
│     └─ Function esiste? ✅                             │
│     ↓                                                   │
│  3. Test Signup                                        │
│     ↓                                                   │
│     User fa Signup                                     │
│     ↓                                                   │
│     Trigger: on_auth_user_created                      │
│     ├─ Crea profile ✅                                 │
│     ├─ Crea wallet con:                                │
│     │  ├─ balance_points: 18,450 ✅                    │
│     │  ├─ total_earned: 18,450 ✅                      │
│     │  └─ total_spent: 0 ✅                            │
│     ├─ Crea transaction "Welcome Bonus" ✅             │
│     └─ Crea notification "Benvenuto" ✅                │
│     ↓                                                   │
│     SUCCESS! Utente registrato! 🎉                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ File Structure

```
/
├── SIGNUP_FIX_COMPLETE.sql        ← ⭐ ESEGUI QUESTO!
│   └── Script completo di fix (add columns + trigger)
│
├── VERIFY_FIX.sql                 ← Verifica che tutto OK
│   └── Check schema + trigger + function
│
├── CREATE_MISSING_WALLETS.sql     ← Solo se hai utenti senza wallet
│   └── Crea wallet per utenti esistenti
│
└── FIX_SIGNUP_NOW.md              ← Istruzioni dettagliate
    └── Step-by-step guide
```

---

## 🎬 Video Guide (Step-by-Step)

### **Step 1: Apri Supabase Dashboard**

```
┌────────────────────────────────────────┐
│  Browser                               │
│  ┌──────────────────────────────────┐ │
│  │ https://supabase.com/dashboard   │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Projects:                             │
│  ┌──────────────────────────────────┐ │
│  │ ⚽ SPORTIUM                       │←│ Click qui
│  └──────────────────────────────────┘ │
│                                        │
│  Menu:                                 │
│  - Table Editor                        │
│  - SQL Editor          ←───────────────┤ Click qui
│  - Database                            │
└────────────────────────────────────────┘
```

---

### **Step 2: Apri SIGNUP_FIX_COMPLETE.sql**

```
┌────────────────────────────────────────┐
│  VS Code / Editor                      │
│  ┌──────────────────────────────────┐ │
│  │ File Explorer                    │ │
│  │                                  │ │
│  │ ├─ README.md                    │ │
│  │ ├─ SIGNUP_FIX_COMPLETE.sql  ←───┼─┤ Double click
│  │ ├─ VERIFY_FIX.sql               │ │
│  │ └─ ...                          │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Editor:                               │
│  ┌──────────────────────────────────┐ │
│  │ -- SPORTIUM - Complete Signup... │ │
│  │ -- Fix                           │ │
│  │ ...                              │ │
│  │ (tutto il codice SQL)            │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Ctrl+A (select all)                   │
│  Ctrl+C (copy)                         │
└────────────────────────────────────────┘
```

---

### **Step 3: Incolla in Supabase**

```
┌────────────────────────────────────────┐
│  Supabase SQL Editor                   │
│  ┌──────────────────────────────────┐ │
│  │ + New Query          [RUN]       │ │
│  └──────────────────────────────────┘ │
│                                        │
│  SQL Editor:                           │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │ (vuoto)                          │ │
│  │                                  │←│ Click qui
│  │ Ctrl+V (paste)                   │ │
│  │                                  │ │
│  │ -- SPORTIUM - Complete Signup...│ │
│  │ -- Fix                           │ │
│  │ ...                              │ │
│  │ (codice SQL incollato)           │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  [RUN] ←───────────────────────────────┤ Click qui (o Ctrl+Enter)
└────────────────────────────────────────┘
```

---

### **Step 4: Controlla Output**

```
┌────────────────────────────────────────┐
│  Supabase SQL Editor - Results         │
│                                        │
│  ✅ Success                            │
│                                        │
│  Output:                               │
│  ┌──────────────────────────────────┐ │
│  │ NOTICE: === Checking wallets ... │ │
│  │ NOTICE: === Adding missing col...│ │
│  │ NOTICE: === Dropping old trigger │ │
│  │ NOTICE: === Creating new trigger │ │
│  │ NOTICE: ======================== │ │
│  │ NOTICE: ✅ SIGNUP FIX COMPLETED  │ │
│  │ NOTICE: ======================== │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Results (3 tabs):                     │
│  ┌──────────────────────────────────┐ │
│  │ [Schema Check] [Trigger] [Final] │ │
│  │                                  │ │
│  │ column_name | data_type          │ │
│  │ ─────────────────────────────    │ │
│  │ balance_points | integer ✅      │ │
│  │ total_earned   | integer ✅      │ │
│  │ total_spent    | integer ✅      │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

### **Step 5: Test Signup**

```
┌────────────────────────────────────────┐
│  SPORTIUM App                          │
│  ┌──────────────────────────────────┐ │
│  │ Profile                          │ │
│  │                                  │ │
│  │ [Sign Up]  ←─────────────────────┼─┤ Click
│  └──────────────────────────────────┘ │
│                                        │
│  Sign Up Modal:                        │
│  ┌──────────────────────────────────┐ │
│  │ Email:    test@sportium.app      │ │
│  │ Password: TestPass123!           │ │
│  │ Username: TestUser               │ │
│  │                                  │ │
│  │ [Sign Up] ←──────────────────────┼─┤ Click
│  └──────────────────────────────────┘ │
│                                        │
│  ⏳ Loading...                         │
│                                        │
│  ✅ Success!                           │
│  ┌──────────────────────────────────┐ │
│  │ 🎉 Welcome to SPORTIUM!          │ │
│  │                                  │ │
│  │ You received 18,450 Fans Points! │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

### **Step 6: Verifica Database**

```
┌────────────────────────────────────────┐
│  Supabase SQL Editor                   │
│                                        │
│  Query:                                │
│  ┌──────────────────────────────────┐ │
│  │ SELECT * FROM profiles           │ │
│  │ WHERE email = 'test@sportium...' │ │
│  └──────────────────────────────────┘ │
│  [RUN]                                 │
│                                        │
│  Results:                              │
│  ┌──────────────────────────────────┐ │
│  │ id       | email       | username│ │
│  │ ──────────────────────────────── │ │
│  │ abc-123  | test@...    | TestUser│✅│
│  └──────────────────────────────────┘ │
│                                        │
│  Query:                                │
│  ┌──────────────────────────────────┐ │
│  │ SELECT w.* FROM wallets w        │ │
│  │ JOIN profiles p ON ...           │ │
│  └──────────────────────────────────┘ │
│  [RUN]                                 │
│                                        │
│  Results:                              │
│  ┌──────────────────────────────────┐ │
│  │ balance | total_earned | total_..│ │
│  │ ──────────────────────────────── │ │
│  │ 18,450  | 18,450      | 0       │✅│
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

## 🎯 Checklist Visual

```
□ ┌─────────────────────────────┐
  │ Supabase Dashboard aperto   │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ SQL Editor aperto           │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ SIGNUP_FIX_COMPLETE.sql     │
  │ copiato                     │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ Incollato in SQL Editor     │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ RUN eseguito                │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ Output mostra:              │
  │ "✅ SIGNUP FIX COMPLETED"   │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ VERIFY_FIX.sql eseguito     │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ wallets ha total_earned     │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ Trigger esiste              │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ Test signup                 │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ Profile creato              │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ Wallet creato (18,450 FP)   │ ✅
  └─────────────────────────────┘

□ ┌─────────────────────────────┐
  │ 🎉 TUTTO FUNZIONA!          │ ✅
  └─────────────────────────────┘
```

---

## 🚨 Troubleshooting Visual

### **Problema: "Permission Denied"**

```
❌ ERROR: permission denied for table wallets

┌─────────────────────────────────────┐
│ Soluzione:                          │
│                                     │
│ 1. Sei loggato come owner?          │
│    ├─ Check: Dashboard → Settings  │
│    └─ Deve essere "Owner" role     │
│                                     │
│ 2. Service Role Key configurata?    │
│    ├─ Check: Settings → API        │
│    └─ SUPABASE_SERVICE_ROLE_KEY    │
└─────────────────────────────────────┘
```

---

### **Problema: "Trigger già esiste"**

```
❌ ERROR: trigger "on_auth_user_created" already exists

┌─────────────────────────────────────┐
│ Soluzione:                          │
│                                     │
│ È normale! Lo script lo elimina     │
│ automaticamente e ricrea nuovo.     │
│                                     │
│ Se persiste:                        │
│ DROP TRIGGER IF EXISTS              │
│   on_auth_user_created              │
│   ON auth.users;                    │
│                                     │
│ Poi esegui di nuovo il fix.         │
└─────────────────────────────────────┘
```

---

### **Problema: "Signup ancora fallisce"**

```
❌ Signup fails dopo il fix

┌─────────────────────────────────────┐
│ Debug:                              │
│                                     │
│ 1. Check Postgres Logs:             │
│    Dashboard → Logs → Postgres Logs │
│                                     │
│ 2. Cerca errori del trigger:        │
│    RAISE NOTICE messages            │
│                                     │
│ 3. Verifica schema manualmente:     │
│    \d wallets                       │
│                                     │
│ 4. Se total_earned non c'è:         │
│    ALTER TABLE wallets              │
│    ADD COLUMN total_earned int      │
│      DEFAULT 0;                     │
└─────────────────────────────────────┘
```

---

## 🎉 Success Screen

```
╔═════════════════════════════════════════╗
║                                         ║
║   ✅  SIGNUP FIX COMPLETATO!            ║
║                                         ║
║   Risultati:                            ║
║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║                                         ║
║   ✓ Wallets table aggiornata            ║
║   ✓ Colonne total_earned/spent aggiunte ║
║   ✓ Trigger ricreato                    ║
║   ✓ Function aggiornata                 ║
║   ✓ Test signup: SUCCESS!               ║
║                                         ║
║   Gli utenti ora possono registrarsi!   ║
║                                         ║
║   Welcome Bonus: 18,450 FP 🎉           ║
║                                         ║
╚═════════════════════════════════════════╝
```

---

**Quick Start:** Open `/SIGNUP_FIX_COMPLETE.sql` → Copy → Paste in Supabase → RUN! 🚀
