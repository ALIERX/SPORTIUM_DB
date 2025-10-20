# ✅ SPORTIUM - Checklist per Fix Signup

---

## 🎯 Obiettivo
Risolvere l'errore: **"Database error creating new user"**

---

## 📋 Pre-Fix Checklist

Prima di iniziare il fix:

- [ ] Ho identificato l'errore: "Database error creating new user"
- [ ] Ho accesso al Supabase Dashboard
- [ ] Conosco quale progetto Supabase è SPORTIUM
- [ ] Ho letto almeno una delle guide ([QUICK_FIX.md](/QUICK_FIX.md) consigliata)

---

## 🔧 Fix Steps Checklist

### Step 1: Accedi a Supabase
- [ ] Aperto https://supabase.com/dashboard
- [ ] Fatto login
- [ ] Selezionato progetto SPORTIUM corretto

### Step 2: Apri SQL Editor
- [ ] Trovato "SQL Editor" nella sidebar sinistra
- [ ] Cliccato su "SQL Editor"
- [ ] Cliccato su "New Query"

### Step 3: Prepara SQL
- [ ] Copiato SQL da una delle guide
- [ ] OPPURE: copiato SQL dal Debug Panel (Help → Copy SQL)
- [ ] OPPURE: copiato da `/FIX_TRIGGER.sql`

**SQL da eseguire:**
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS create_user_wallet ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_wallet() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile() CASCADE;
```

### Step 4: Esegui SQL
- [ ] Incollato SQL nel query editor
- [ ] Cliccato "Run" (o premuto Ctrl+Enter / Cmd+Enter)
- [ ] Visto messaggi di conferma (anche se dice "does not exist" va bene!)

### Step 5: Verifica Rimozione
- [ ] Eseguito query di verifica:
```sql
SELECT trigger_name FROM information_schema.triggers
WHERE event_object_table = 'users' AND event_object_schema = 'auth';
```
- [ ] Risultato mostra 0 righe ✅

---

## 🧪 Test Checklist

### Test 1: Debug Panel
- [ ] Aperto l'app SPORTIUM
- [ ] Trovato Debug Panel (basso-destra, card gialla)
- [ ] Cliccato "Check Server Health"
- [ ] Visto: `"status": "ok"` e `"kv": "connected"` ✅
- [ ] Inserito email di test nell'input
- [ ] Cliccato "Test Signup"
- [ ] Visto: `"status": 200` e `"ok": true` ✅

### Test 2: Signup Reale
- [ ] Andato su Profile page
- [ ] Cliccato tab "Registrati"
- [ ] Compilato form:
  - [ ] Username (almeno 3 caratteri)
  - [ ] Email (formato valido)
  - [ ] Password (almeno 6 caratteri)
- [ ] Cliccato "Crea Account"
- [ ] Visto toast: "🎉 Account created! Welcome to SPORTIUM!" ✅
- [ ] Verificato auto-login
- [ ] Visto wallet nel header: "18,450 FP" ✅

### Test 3: Features
- [ ] Verificato profile page mostra username corretto
- [ ] Testato navigazione tra pagine
- [ ] Aperto Auctions page
- [ ] Verificato può piazzare bid (se ci sono aste attive)
- [ ] Testato almeno un'altra feature (Quiz, Spin Wheel, etc.)

---

## ✅ Success Criteria

Il fix è completato con successo se:

### ✅ Debug Panel mostra:
```json
{
  "status": "ok",
  "kv": "connected"
}
```

### ✅ Test Signup mostra:
```json
{
  "status": 200,
  "ok": true,
  "data": {
    "success": true
  }
}
```

### ✅ Signup reale:
- Toast di successo appare
- Auto-login funziona
- Wallet mostra 18,450 FP
- Profile page mostra username
- Tutte le features sono accessibili

---

## 🧹 Cleanup Checklist (Opzionale)

Dopo aver verificato che tutto funziona:

### Per Testing/Development
- [ ] Lasciato Debug Panel attivo (utile per debug)
- [ ] Lasciato warning banner nel signup form

### Per Production
- [ ] Rimosso `<DebugPanel />` da `/App.tsx`
- [ ] Rimosso file `/components/DebugPanel.tsx`
- [ ] Rimosso warning banner da `/components/ProfilePage.tsx`
- [ ] Testato signup in produzione
- [ ] Verificato tutto funziona ancora

---

## 🔄 Rollback Checklist (Se Qualcosa Va Male)

Se dopo il fix qualcosa non funziona:

- [ ] NON PANICO! I dati sono al sicuro
- [ ] Aperto Debug Panel → "Check Server Health"
- [ ] Verificato `kv: "connected"`
- [ ] Verificato errore specifico in "Test Signup"
- [ ] Letto [`TROUBLESHOOTING.md`](/TROUBLESHOOTING.md)
- [ ] Verificato di aver eseguito tutto il SQL correttamente

**Nota:** Non c'è bisogno di "rollback" - se hai rimosso i trigger sbagliati, non causa danni. I trigger non funzionavano comunque.

---

## 📊 Troubleshooting Checklist

Se signup continua a fallire:

### Check 1: Server
- [ ] Debug Panel → "Check Server Health"
- [ ] `status: "ok"`? → Server funziona ✅
- [ ] `kv: "connected"`? → Database funziona ✅

### Check 2: Email
- [ ] Debug Panel → inserito email → "Check Email"
- [ ] `exists: true`? → Email già registrata → Usa Sign In
- [ ] `exists: false`? → Email disponibile ✅

### Check 3: Trigger
- [ ] Verificato nel SQL Editor:
```sql
SELECT trigger_name FROM information_schema.triggers
WHERE event_object_table = 'users' AND event_object_schema = 'auth';
```
- [ ] Risultato: 0 righe? → Trigger rimossi ✅
- [ ] Risultato: >0 righe? → Esegui di nuovo SQL DROP

### Check 4: Errore Specifico
- [ ] Debug Panel → "Test Signup"
- [ ] Letto messaggio di errore completo
- [ ] Cercato errore in [`TROUBLESHOOTING.md`](/TROUBLESHOOTING.md)

---

## 📚 Documentation Checklist

Guide lette:

- [ ] [`START_HERE.md`](/START_HERE.md) - Overview
- [ ] [`QUICK_FIX.md`](/QUICK_FIX.md) - Fix rapido
- [ ] [`STEP_BY_STEP_FIX.md`](/STEP_BY_STEP_FIX.md) - Guida dettagliata (opzionale)
- [ ] [`README_FIX_SIGNUP.md`](/README_FIX_SIGNUP.md) - Complete (opzionale)
- [ ] [`TROUBLESHOOTING.md`](/TROUBLESHOOTING.md) - Se problemi persistono

---

## 🎯 Final Checklist

Tutto completato:

- [ ] ✅ Trigger rimossi da database
- [ ] ✅ Debug Panel testa OK
- [ ] ✅ Signup reale funziona
- [ ] ✅ Wallet creato con 18,450 FP
- [ ] ✅ Profile mostra dati corretti
- [ ] ✅ Features accessibili
- [ ] ✅ Nessun errore in console
- [ ] ✅ (Opzionale) Debug Panel rimosso per produzione

---

## 🎉 Congratulazioni!

Se hai completato tutti i check:

```
✅ Fix completato
✅ Sistema operativo
✅ Pronto per utenti
✅ Production ready
```

**SPORTIUM è pronto per il lancio! 🚀⚽🏆**

---

## 📝 Note Aggiuntive

### Tempo Totale Stimato
- **Fix:** 2-3 minuti
- **Test:** 2-3 minuti
- **Verifica:** 1-2 minuti
- **TOTALE:** ~5-8 minuti

### Difficoltà
⭐ Facile - Basta copiare/incollare SQL

### Rischio
🟢 Basso - Stai solo rimuovendo trigger che causavano errori

### Supporto
Tutti i problemi comuni sono documentati in [`TROUBLESHOOTING.md`](/TROUBLESHOOTING.md)

---

## 🔗 Quick Links

| Cosa Serve | Link |
|------------|------|
| Fix Rapido | [`QUICK_FIX.md`](/QUICK_FIX.md) |
| Guida Visuale | [`STEP_BY_STEP_FIX.md`](/STEP_BY_STEP_FIX.md) |
| Troubleshooting | [`TROUBLESHOOTING.md`](/TROUBLESHOOTING.md) |
| SQL File | [`FIX_TRIGGER.sql`](/FIX_TRIGGER.sql) |
| Overview Completa | [`README_FIX_SIGNUP.md`](/README_FIX_SIGNUP.md) |
| Main README | [`README.md`](/README.md) |

---

_Stampa o salva questa checklist per tenere traccia dei progressi!_
