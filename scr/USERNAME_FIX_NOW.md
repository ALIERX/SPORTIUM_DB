# 🚀 Fix Username VELOCE - 30 Secondi

## ❌ Problema
**Tutti gli utenti hanno username "CalcioFan2024" invece del loro vero username.**

---

## ✅ Soluzione Veloce

### **1. Apri Supabase Dashboard**
https://supabase.com/dashboard → Tuo Progetto → **SQL Editor**

---

### **2. Copia Questo SQL**

Apri il file **`/FIX_USERNAME_UPDATE.sql`** da questo progetto.

```sql
-- Oppure copia direttamente questo:

UPDATE profiles p
SET 
  username = COALESCE(
    u.raw_user_meta_data->>'username',
    split_part(u.email, '@', 1)
  ),
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id;
```

---

### **3. Incolla e RUN**

1. Click **+ New Query** in Supabase SQL Editor
2. **Incolla** il codice SQL
3. Click **RUN** (o Ctrl+Enter)

---

### **4. Verifica**

```sql
-- Controlla username aggiornati
SELECT email, username FROM profiles;
```

Dovresti vedere username diversi invece di "CalcioFan2024"!

---

### **5. Reload App**

1. Vai alla tua app SPORTIUM
2. **Refresh** (Ctrl+R o Cmd+R)
3. **Profile** → Username dovrebbe essere corretto! ✅

---

## 🎯 Quick Check

**Prima:**
```
Email: test@sportium.app
Username: CalcioFan2024 ❌
```

**Dopo:**
```
Email: test@sportium.app
Username: test ✅
```

(Oppure l'username scelto durante signup se salvato nel metadata)

---

## 🔧 Se Non Funziona

### **Scenario 1: Username ancora "CalcioFan2024"**

➡️ **Apri il file completo:** `/FIX_USERNAME_UPDATE.sql`

Copia TUTTO il file (non solo l'UPDATE) e eseguilo. Include diagnostica e verifica.

---

### **Scenario 2: Nuovi utenti hanno ancora username sbagliato**

➡️ **Il trigger non funziona!**

**Fix:**
1. Esegui `/SIGNUP_FIX_COMPLETE.sql` (ricrea trigger)
2. Test signup nuovo utente
3. Dovrebbe funzionare!

---

### **Scenario 3: Frontend mostra sempre "CalcioFan"**

➡️ **Frontend già fixato!**

Ho aggiornato `/components/ProfilePage.tsx` per usare 3 fallback:
1. `profile.username`
2. `user.user_metadata.username`
3. Email prefix

Se continua a non funzionare → **Check DevTools Console** per errori.

---

## 📂 File Disponibili

| File | Scopo | Quando Usarlo |
|------|-------|---------------|
| **FIX_USERNAME_UPDATE.sql** | ⭐ Fix veloce | Sempre (30 sec) |
| DEBUG_USERNAME.sql | Diagnosi | Se vuoi capire il problema |
| FIX_USERNAME_GUIDE.md | Guida completa | Se FIX_USERNAME_UPDATE non basta |

---

## ✅ Done!

```
□ Eseguito FIX_USERNAME_UPDATE.sql
□ Verificato con SELECT email, username FROM profiles
□ Reloaded app
□ Profile mostra username corretto
□ ✅ FUNZIONA!
```

---

**Start HERE:** `/FIX_USERNAME_UPDATE.sql` 

Copia → Incolla in Supabase → RUN → Done! 🎉
