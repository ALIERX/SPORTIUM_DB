# 🔧 Fix Username - Guida Completa

## ❌ Problema

**Tutti gli utenti mostrano username "CalcioFan2024" invece del loro vero username.**

### Cause Possibili:

1. **Utenti creati PRIMA del trigger fix** → username non estratto dal metadata
2. **Trigger non funzionante** → username non copiato da auth.users a profiles
3. **Frontend fallback sbagliato** → mostra "CalcioFan2024" quando profile.username è NULL

---

## ✅ Soluzione 3-Step

### **Step 1: Diagnosi (1 minuto)**

Scopri qual è il problema esatto.

1. **Apri Supabase Dashboard** → SQL Editor
2. **Copia tutto** da `/DEBUG_USERNAME.sql`
3. **Incolla e RUN**

**Controlla l'output:**

```sql
-- Se vedi:
metadata_username | profile_username | status
------------------|------------------|----------
TestUser          | CalcioFan2024    | ❌ MISMATCH
```

➡️ **Il metadata ha l'username corretto ma non è stato copiato in profiles**

```sql
-- Se vedi:
metadata_username | profile_username | status
------------------|------------------|----------
NULL              | test             | ✅ OK
```

➡️ **L'username non è mai stato salvato nel metadata** (utenti molto vecchi)

---

### **Step 2: Fix Database (30 secondi)**

Aggiorna tutti gli username nella tabella profiles.

1. **Apri Supabase Dashboard** → SQL Editor
2. **Copia tutto** da `/FIX_USERNAME_UPDATE.sql`
3. **Incolla e RUN**

**Questo script:**
- ✅ Aggiorna `profiles.username` usando `auth.users.raw_user_meta_data->>'username'`
- ✅ Usa email prefix come fallback se metadata è vuoto
- ✅ Mostra before/after comparison

**Output atteso:**

```
Updated 5 profiles
✅ USERNAME UPDATE COMPLETE
```

---

### **Step 3: Verifica App (Test)**

1. **Ricarica l'app** (Ctrl+R o Cmd+R)
2. **Vai su Profile**
3. **Controlla username** → Dovrebbe mostrare quello corretto!

---

## 🎯 Fix Frontend (Già Fatto!)

Ho già aggiornato `/components/ProfilePage.tsx` per usare 3 fallback:

```typescript
// Prima (❌):
username: profile?.username || "CalcioFan2024"

// Ora (✅):
const getUsername = () => {
  // 1. Profile username
  if (profile?.username) return profile.username;
  
  // 2. User metadata (signup)
  if (user?.user_metadata?.username) return user.user_metadata.username;
  
  // 3. Email prefix
  if (user?.email) return user.email.split('@')[0];
  
  // 4. Fallback
  return "CalcioFan";
};
```

Questo garantisce che **anche se il database non ha l'username**, verrà estratto dal metadata dell'utente!

---

## 🧪 Test Completo

### **Test 1: Utenti Esistenti**

1. Login con utente esistente
2. Profile → Username dovrebbe essere corretto
3. Se no → esegui `/FIX_USERNAME_UPDATE.sql`

### **Test 2: Nuovo Utente**

1. Logout
2. Sign Up con:
   - Email: `newtest@sportium.app`
   - Password: `Test123!`
   - Username: `SuperFan99`
3. Signup → Success
4. Profile → Username dovrebbe essere "SuperFan99" ✅

### **Test 3: Verifica Database**

In Supabase SQL Editor:

```sql
-- Check nuovo utente
SELECT 
  p.email,
  p.username,
  u.raw_user_meta_data->>'username' as metadata_username
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'newtest@sportium.app';
```

**Aspettati:**

| email | username | metadata_username |
|-------|----------|-------------------|
| newtest@sportium.app | SuperFan99 | SuperFan99 |

---

## 🔍 Debug Avanzato

### **Se l'username è ancora sbagliato dopo il fix:**

#### **Check 1: Metadata è NULL?**

```sql
SELECT 
  email,
  raw_user_meta_data,
  raw_user_meta_data->>'username' as username
FROM auth.users
WHERE email = 'TUA_EMAIL';
```

Se `username` è NULL → **Il server non sta salvando l'username durante signup**

**Fix:** Controlla `/supabase/functions/server/index.tsx` riga 154:

```typescript
user_metadata: { username },  // ← Deve essere presente!
```

---

#### **Check 2: Profile.username è NULL?**

```sql
SELECT email, username
FROM profiles
WHERE email = 'TUA_EMAIL';
```

Se `username` è NULL → **Il trigger non ha funzionato**

**Fix:** Esegui `/SIGNUP_FIX_COMPLETE.sql` per ricreare il trigger

---

#### **Check 3: Frontend non carica profile?**

Apri **DevTools Console** (F12) e cerca:

```
Error fetching profile: ...
```

Se vedi errori → **Il server non restituisce il profile**

**Fix:** Controlla `/supabase/functions/server/index.tsx` endpoint `/profile/:userId`

---

## 📊 File da Usare in Ordine

```
1. DEBUG_USERNAME.sql         ← Diagnosi problema
   ↓
2. FIX_USERNAME_UPDATE.sql    ← Aggiorna database
   ↓
3. Reload app                 ← Test frontend
   ↓
4. (Se necessario) SIGNUP_FIX_COMPLETE.sql ← Fix trigger
   ↓
5. ✅ DONE!
```

---

## 🎬 Quick Fix (30 secondi)

**Se hai fretta:**

1. Copia `/FIX_USERNAME_UPDATE.sql`
2. Incolla in Supabase SQL Editor
3. RUN
4. Refresh app
5. ✅ Dovrebbe funzionare!

---

## ⚠️ Se Continua a Non Funzionare

### **Scenario A: Nuovi utenti hanno ancora username sbagliato**

➡️ **Il trigger non funziona**

**Fix:**

1. Esegui `/SIGNUP_FIX_COMPLETE.sql`
2. Test signup con nuovo utente
3. Controlla Postgres Logs in Supabase per vedere messaggi del trigger

---

### **Scenario B: Utenti esistenti hanno username sbagliato**

➡️ **Database non aggiornato**

**Fix:**

1. Esegui `/FIX_USERNAME_UPDATE.sql`
2. Verifica con:

```sql
SELECT email, username FROM profiles;
```

---

### **Scenario C: Frontend mostra sempre "CalcioFan"**

➡️ **Profile non viene caricato**

**Fix:**

1. Check DevTools Console per errori
2. Verifica che `/profile/:userId` endpoint funzioni:

```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-81e425c4/profile/USER_ID \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

3. Se fallisce → check server logs in Supabase

---

## ✅ Checklist Finale

```
□ Eseguito DEBUG_USERNAME.sql
□ Identificato il problema
□ Eseguito FIX_USERNAME_UPDATE.sql
□ Verificato database aggiornato
□ Reloaded app
□ Profile mostra username corretto
□ Test signup nuovo utente
□ Nuovo utente ha username corretto
□ ✅ TUTTO FUNZIONA!
```

---

## 🎉 Success!

Dopo il fix:

```
✅ Utenti esistenti → username corretto
✅ Nuovi utenti → username salvato correttamente
✅ Frontend → fallback multipli garantiscono display corretto
✅ Trigger → auto-crea profile con username dal metadata
```

---

**Start HERE:** `/FIX_USERNAME_UPDATE.sql` 

Copia → Incolla in Supabase → RUN → Reload App → Done! 🚀
