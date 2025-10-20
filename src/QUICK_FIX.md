# 🚨 QUICK FIX - Signup Error

## Il Problema
Quando provi a fare signup, ottieni:
```
"Database error creating new user"
```

## La Causa
Hai un **trigger di database** in Supabase che cerca di inserire automaticamente nella tabella `wallets` quando crei un utente, ma la tabella non esiste → la transazione fallisce → signup non funziona.

## La Soluzione (2 minuti)

### ✅ METODO VELOCE

1. **Apri Supabase Dashboard**
   - Vai su [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Seleziona il tuo progetto SPORTIUM

2. **Apri SQL Editor**
   - Sidebar → **SQL Editor**
   - Click **"New Query"**

3. **Copia e incolla questo SQL:**

```sql
-- Rimuovi trigger che interferiscono con signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS create_user_wallet ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile ON auth.users;
DROP TRIGGER IF EXISTS insert_user_wallet ON auth.users;
DROP TRIGGER IF EXISTS insert_user_profile ON auth.users;

-- Rimuovi funzioni associate
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_wallet() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS public.insert_user_wallet() CASCADE;
DROP FUNCTION IF EXISTS public.insert_user_profile() CASCADE;
```

4. **Esegui la query**
   - Click **"Run"** (o Ctrl+Enter)
   - Dovresti vedere messaggi tipo "NOTICE: trigger does not exist, skipping" (va bene!)

5. **Testa subito!**
   - Torna alla tua app SPORTIUM
   - Vai su Profile → Sign Up
   - Crea un account di test
   - Dovresti vedere: "🎉 Account created! Welcome to SPORTIUM!"

---

## ✅ Test Rapido

Dopo aver eseguito il SQL, usa il **Debug Panel** nella tua app:

1. Guarda in **basso a destra** → Card gialla "🔧 Debug Panel"
2. Click **"Help"** per vedere le istruzioni
3. Click **"Test Signup"**
4. Dovresti vedere: `"status": 200, "ok": true`

---

## 🎯 Cosa Succede Ora

Dopo aver rimosso il trigger:

✅ **Supabase Auth** crea solo l'utente (senza interferenze)  
✅ **Il nostro server** gestisce wallet e profile nel **KV Store**  
✅ **Signup funziona perfettamente!**  

Non stiamo usando tabelle SQL per wallets/profiles → usiamo il **KV Store** che è più flessibile!

---

## 📁 Files di Riferimento

- `/FIX_TRIGGER.sql` → Versione completa con spiegazioni
- `/TROUBLESHOOTING.md` → Guida completa per altri problemi
- `/components/DebugPanel.tsx` → Tool di debugging

---

## ❓ FAQ Veloce

**Q: È sicuro rimuovere questi trigger?**  
A: Sì! Non usiamo tabelle SQL per wallets/profiles. Il nostro sistema usa il KV Store.

**Q: Perderò dati esistenti?**  
A: No! Il KV Store mantiene tutti i dati. Stiamo solo rimuovendo trigger che causano errori.

**Q: E se il trigger non esiste?**  
A: Perfetto! Significa che il problema è altro. Usa il Debug Panel per investigare.

**Q: Devo riavviare qualcosa?**  
A: No! Esegui il SQL e testa immediatamente.

---

## 🚀 Dopo il Fix

Una volta che il signup funziona:

1. ✅ Crea account di test
2. ✅ Verifica wallet ha 18,450 FP
3. ✅ Testa sistema aste
4. ✅ Rimuovi Debug Panel in produzione

---

## 💬 Serve Aiuto?

Se dopo aver eseguito il SQL il problema persiste:

1. Apri **Debug Panel** → Click "Check Server Health"
2. Verifica `kv: "connected"`
3. Prova "Test Signup" e guarda l'errore specifico
4. Controlla `/TROUBLESHOOTING.md` per altri casi

---

**Fix stimato: 2 minuti ⏱️**  
**Difficoltà: Facile ⭐**  

Buona fortuna! 🏆⚽
