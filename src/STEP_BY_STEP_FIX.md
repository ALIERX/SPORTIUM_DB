# 🔧 Fix Signup Error - Guida Passo-Passo con Screenshot

## 🎯 Obiettivo
Risolvere l'errore: **"Database error creating new user"**

## 📋 Tempo Necessario
⏱️ **2-3 minuti**

---

## 📸 Step 1: Apri Supabase Dashboard

1. Vai su: **https://supabase.com/dashboard**
2. Fai login se necessario
3. Seleziona il tuo **progetto SPORTIUM** dalla lista

```
┌─────────────────────────────────────┐
│  🏠 My Projects                     │
├─────────────────────────────────────┤
│  📁 SPORTIUM ← Click qui           │
│  📁 Other Project                   │
│  📁 Test Project                    │
└─────────────────────────────────────┘
```

---

## 📸 Step 2: Apri SQL Editor

1. Guarda la **sidebar a sinistra**
2. Cerca l'icona **"SQL Editor"** 
3. Click su **"SQL Editor"**

```
┌─────────────────────┐
│ SPORTIUM           │
├─────────────────────┤
│ 🏠 Home            │
│ 📊 Table Editor    │
│ 📝 SQL Editor ← Qui│  
│ 🔐 Auth            │
│ 📦 Storage         │
│ ⚙️  Settings       │
└─────────────────────┘
```

---

## 📸 Step 3: Crea Nuova Query

1. Nel SQL Editor, cerca il bottone **"New Query"** in alto
2. Click su **"New Query"**
3. Si aprirà un editor di testo vuoto

```
┌────────────────────────────────────────┐
│ SQL Editor        [+ New Query] ← Qui │
├────────────────────────────────────────┤
│                                        │
│  (Editor vuoto)                        │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

---

## 📸 Step 4: Copia e Incolla questo SQL

**Copia TUTTO questo blocco:**

```sql
-- ============================================
-- SPORTIUM FIX: Rimuovi trigger interferenti
-- ============================================

-- Rimuovi tutti i trigger che causano problemi
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS create_user_wallet ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile ON auth.users;
DROP TRIGGER IF EXISTS insert_user_wallet ON auth.users;
DROP TRIGGER IF EXISTS insert_user_profile ON auth.users;

-- Rimuovi le funzioni associate
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_wallet() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS public.insert_user_wallet() CASCADE;
DROP FUNCTION IF EXISTS public.insert_user_profile() CASCADE;

-- Verifica che tutto sia stato rimosso
SELECT 
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth';

-- Se l'ultima query ritorna 0 righe = SUCCESS! ✅
```

**Incolla nell'editor SQL**

```
┌────────────────────────────────────────┐
│ SQL Editor              [Run] [Format] │
├────────────────────────────────────────┤
│ 1  DROP TRIGGER IF EXISTS...           │
│ 2  DROP TRIGGER IF EXISTS...           │
│ 3  DROP FUNCTION IF EXISTS...          │
│ 4  ...                                 │
└────────────────────────────────────────┘
```

---

## 📸 Step 5: Esegui la Query

1. Click sul bottone verde **"Run"** in alto a destra
2. Oppure premi **Ctrl+Enter** (Windows/Linux) o **Cmd+Enter** (Mac)

```
┌────────────────────────────────────────┐
│ SQL Editor        [▶ Run] ← Click qui │
├────────────────────────────────────────┤
│ (Query SQL)                            │
└────────────────────────────────────────┘
```

---

## 📸 Step 6: Verifica il Risultato

Vedrai messaggi tipo:

```
✅ NOTICE: trigger "on_auth_user_created" does not exist, skipping
✅ NOTICE: trigger "handle_new_user" does not exist, skipping
✅ DROP TRIGGER
✅ DROP FUNCTION
```

**Tutti questi messaggi sono OK!** Anche se dice "does not exist" va bene.

L'ultima query dovrebbe mostrare:

```
┌─────────────────┬────────────────────┐
│ trigger_name    │ event_object_table │
├─────────────────┼────────────────────┤
│ (No rows)       │                    │
└─────────────────┴────────────────────┘
```

**0 righe = Perfetto! ✅**

---

## 📸 Step 7: Testa il Signup

1. **Torna alla tua app SPORTIUM**
2. Apri il **Debug Panel** (card gialla in basso a destra)
3. Click **"Test Signup"**

Dovresti vedere:

```json
{
  "email": "test-1234567890@sportium.test",
  "status": 200,
  "ok": true,
  "data": {
    "success": true,
    "user": { ... }
  }
}
```

**status: 200 e ok: true = FUNZIONA! 🎉**

---

## 📸 Step 8: Crea Account Reale

1. Vai su **Profile** nella tua app
2. Tab **"Registrati"**
3. Compila:
   - Username: `TuoNome`
   - Email: `tuo@email.com` (o usa `tuonome+test@gmail.com` per testare)
   - Password: almeno 6 caratteri
4. Click **"Crea Account"**

Dovresti vedere:

```
🎉 Account created! Welcome to SPORTIUM!
```

E il tuo wallet avrà: **18,450 FP**

---

## ✅ Checklist Completa

- [ ] Ho aperto Supabase Dashboard
- [ ] Ho aperto SQL Editor
- [ ] Ho creato una nuova query
- [ ] Ho copiato e incollato il SQL
- [ ] Ho eseguito la query (Run)
- [ ] Ho visto messaggi di successo
- [ ] Ho testato con Debug Panel
- [ ] Ho visto status: 200
- [ ] Ho creato un account reale
- [ ] Ho ricevuto 18,450 FP
- [ ] Signup funziona! 🎉

---

## ❓ Troubleshooting

### "Non vedo SQL Editor nella sidebar"
→ Controlla di aver selezionato il progetto SPORTIUM giusto

### "Permission denied"
→ Assicurati di essere il proprietario del progetto

### "Ancora ricevo errore dopo il fix"
→ Apri Debug Panel → Click "Check Server Health"
→ Verifica che `kv: "connected"`
→ Se `kv` è disconnected, c'è un altro problema

### "Non vedo il Debug Panel"
→ Guarda in basso a destra, card gialla con "🔧"
→ Se non c'è, verifica che `/components/DebugPanel.tsx` esista

---

## 🎯 Cosa Abbiamo Fatto?

**PRIMA:**
```
Utente fa signup
  ↓
Supabase Auth crea user
  ↓
❌ Trigger cerca di inserire in tabella "wallets"
  ↓
❌ Tabella non esiste
  ↓
❌ Transazione fallisce
  ↓
❌ "Database error creating new user"
```

**DOPO:**
```
Utente fa signup
  ↓
Supabase Auth crea user ✅
  ↓
(Nessun trigger interferisce)
  ↓
Server SPORTIUM crea wallet nel KV Store ✅
  ↓
Server SPORTIUM crea profile nel KV Store ✅
  ↓
✅ "Account created! Welcome to SPORTIUM!"
  ↓
✅ Wallet ha 18,450 FP
```

---

## 🚀 Prossimi Passi

Ora che signup funziona:

1. ✅ Crea alcuni account di test
2. ✅ Verifica che ogni account riceva 18,450 FP
3. ✅ Testa il sistema di aste con il nuovo wallet
4. ✅ Testa le altre features (quiz, spin wheel, etc.)
5. 🗑️ Quando tutto funziona, rimuovi il Debug Panel dalla produzione

---

## 📚 Files di Riferimento

- `/FIX_TRIGGER.sql` - SQL completo con commenti
- `/QUICK_FIX.md` - Guida rapida
- `/TROUBLESHOOTING.md` - Guida completa problemi
- `/components/DebugPanel.tsx` - Tool di debugging

---

## 🎉 Complimenti!

Hai fixato il signup error! 🏆

Il tuo sistema SPORTIUM è ora pronto per:
- ✅ Registrazione utenti
- ✅ Creazione wallet con 18,450 FP
- ✅ Sistema aste live
- ✅ Tutte le altre features

**Buon divertimento con SPORTIUM! ⚽🎮**

---

_Ultima revisione: Ottobre 2025_
