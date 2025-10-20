# 🔧 SPORTIUM - Common Fixes Index

**Quick reference per risolvere i problemi più comuni.**

---

## 🚨 Problem #1: Signup Non Funziona

**Sintomo:**
```
Error: column "total_earned" does not exist
```

Gli utenti non riescono a registrarsi.

### 📂 Files:

| File | Tipo | Scopo |
|------|------|-------|
| **[FIX_SIGNUP_NOW.md](/FIX_SIGNUP_NOW.md)** | Guide | Guida completa |
| **[SIGNUP_FIX_COMPLETE.sql](/SIGNUP_FIX_COMPLETE.sql)** | ⭐ SQL | Fix principale (2 min) |
| [VERIFY_FIX.sql](/VERIFY_FIX.sql) | SQL | Verifica fix |
| [CREATE_MISSING_WALLETS.sql](/CREATE_MISSING_WALLETS.sql) | SQL | Fix utenti esistenti |
| [SIGNUP_FIX_VISUAL.md](/SIGNUP_FIX_VISUAL.md) | Guide | Visual step-by-step |

### ⚡ Quick Fix:
```
1. Apri Supabase SQL Editor
2. Copia /SIGNUP_FIX_COMPLETE.sql
3. Incolla e RUN
4. Test signup → ✅
```

---

## 🚨 Problem #2: Username Sbagliato

**Sintomo:**
```
Tutti gli utenti hanno username "CalcioFan2024"
```

Il profilo mostra lo stesso username per tutti invece di quello scelto.

### 📂 Files:

| File | Tipo | Scopo |
|------|------|-------|
| **[USERNAME_FIX_NOW.md](/USERNAME_FIX_NOW.md)** | Guide | Guida veloce |
| **[FIX_USERNAME_UPDATE.sql](/FIX_USERNAME_UPDATE.sql)** | ⭐ SQL | Fix principale (30 sec) |
| [DEBUG_USERNAME.sql](/DEBUG_USERNAME.sql) | SQL | Diagnosi problema |
| [TEST_USERNAME_FIX.sql](/TEST_USERNAME_FIX.sql) | SQL | Test e verifica |
| [FIX_USERNAME_GUIDE.md](/FIX_USERNAME_GUIDE.md) | Guide | Guida completa |
| [USERNAME_FIX_VISUAL.md](/USERNAME_FIX_VISUAL.md) | Guide | Visual step-by-step |

### ⚡ Quick Fix:
```
1. Apri Supabase SQL Editor
2. Copia /FIX_USERNAME_UPDATE.sql
3. Incolla e RUN
4. Reload app → ✅
```

---

## 🛠️ Other Common Issues

### **Issue: Admin Panel Non Accessibile**

**Soluzione:**
- Double-click logo header → Shield icon
- Password: `Forzabari!`
- Vedi: [ADMIN_QUICK_START.md](/ADMIN_QUICK_START.md)

---

### **Issue: Aste Non Funzionano**

**Soluzione:**
- Check server running: `/health` endpoint
- Verifica tabelle SQL create (migrations 001-005)
- Vedi: [FINAL_INTEGRATION_GUIDE.md](/FINAL_INTEGRATION_GUIDE.md)

---

### **Issue: Wallet Balance Non Aggiornato**

**Soluzione:**
- Refresh wallet: logout + login
- Check `/wallet/:userId` endpoint
- Verifica `wallets` table esiste

---

### **Issue: Real-time Non Funziona**

**Soluzione:**
- Check Supabase Realtime enabled
- Verifica subscriptions in `utils/supabase/subscriptions.tsx`
- Check browser console per errori WebSocket

---

## 📊 File Organization

```
SPORTIUM/
├── Common Fixes:
│   ├── FIX_SIGNUP_NOW.md              ← Signup issues
│   ├── SIGNUP_FIX_COMPLETE.sql        ← ⭐ Signup SQL fix
│   ├── USERNAME_FIX_NOW.md            ← Username issues
│   ├── FIX_USERNAME_UPDATE.sql        ← ⭐ Username SQL fix
│   └── COMMON_FIXES_INDEX.md          ← This file
│
├── Diagnostics:
│   ├── DEBUG_USERNAME.sql             ← Username debug
│   ├── VERIFY_FIX.sql                 ← Signup verify
│   └── TEST_USERNAME_FIX.sql          ← Username test
│
├── Visual Guides:
│   ├── SIGNUP_FIX_VISUAL.md           ← Signup visual
│   └── USERNAME_FIX_VISUAL.md         ← Username visual
│
├── Complete Guides:
│   ├── FIX_USERNAME_GUIDE.md          ← Username complete
│   ├── ADMIN_QUICK_START.md           ← Admin setup
│   └── FINAL_INTEGRATION_GUIDE.md     ← Full integration
│
└── Production Setup:
    ├── QUICK_START_PRODUCTION.md      ← Database setup
    └── README.md                       ← Main readme
```

---

## 🎯 Quick Decision Tree

```
┌─────────────────────────────────────┐
│  What's the problem?                │
└─────────────────────────────────────┘
           │
           ├─ Users can't sign up?
           │  └─→ Use: SIGNUP_FIX_COMPLETE.sql
           │
           ├─ Wrong username shown?
           │  └─→ Use: FIX_USERNAME_UPDATE.sql
           │
           ├─ Admin panel not working?
           │  └─→ Read: ADMIN_QUICK_START.md
           │
           ├─ Database not setup?
           │  └─→ Read: QUICK_START_PRODUCTION.md
           │
           └─ General issues?
              └─→ Read: FINAL_INTEGRATION_GUIDE.md
```

---

## ⚡ Super Quick Fixes

### **Signup Fix (2 min):**
```bash
# 1. Copy
cat SIGNUP_FIX_COMPLETE.sql | pbcopy  # Mac
# or
Get-Content SIGNUP_FIX_COMPLETE.sql | Set-Clipboard  # Windows

# 2. Paste in Supabase SQL Editor
# 3. RUN
# 4. Done!
```

---

### **Username Fix (30 sec):**
```bash
# 1. Copy
cat FIX_USERNAME_UPDATE.sql | pbcopy  # Mac
# or
Get-Content FIX_USERNAME_UPDATE.sql | Set-Clipboard  # Windows

# 2. Paste in Supabase SQL Editor
# 3. RUN
# 4. Reload app
# 5. Done!
```

---

## 📋 Troubleshooting Checklist

```
Common Issues:
□ Signup fails → SIGNUP_FIX_COMPLETE.sql
□ Username wrong → FIX_USERNAME_UPDATE.sql
□ Admin locked → Double-click logo + password
□ Database empty → Run migrations 001-005
□ Wallet empty → Check CREATE_MISSING_WALLETS.sql
□ Auctions not working → Check server running
□ Real-time not working → Check Supabase Realtime enabled
```

---

## 🎉 All Working?

```
╔═══════════════════════════════════════╗
║                                       ║
║   ✅  ALL SYSTEMS OPERATIONAL         ║
║                                       ║
║   Signup: ✅ Working                  ║
║   Username: ✅ Unique                 ║
║   Admin: ✅ Accessible                ║
║   Database: ✅ Connected              ║
║   Auctions: ✅ Live                   ║
║   Real-time: ✅ Active                ║
║                                       ║
║   SPORTIUM is ready! 🚀⚽             ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## 📞 Need More Help?

1. **Check logs:**
   - Supabase Dashboard → Logs
   - Browser DevTools Console (F12)
   - Server logs in Supabase Edge Functions

2. **Verify setup:**
   - Run `/TEST_USERNAME_FIX.sql`
   - Run `/VERIFY_FIX.sql`
   - Check health endpoint: `/make-server-81e425c4/health`

3. **Read guides:**
   - [FINAL_INTEGRATION_GUIDE.md](/FINAL_INTEGRATION_GUIDE.md)
   - [TROUBLESHOOTING.md](/TROUBLESHOOTING.md)
   - [README.md](/README.md)

---

**Last Updated:** October 15, 2025

**Version:** v0.8 Production SQL Ready
