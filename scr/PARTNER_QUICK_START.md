# 🚀 Partner System - Quick Start

## ⚡ Setup in 3 Minuti

### **Step 1: Database (1 min)**
```bash
1. Apri Supabase Dashboard → SQL Editor
2. Apri file /supabase/migrations/006_partner_system.sql
3. Copia TUTTO
4. Incolla in SQL Editor
5. RUN
```

**Aspettati:**
```
✅ Partner System Migration Complete!
```

---

### **Step 2: Verifica (30 sec)**
```sql
-- Check tabelle:
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('quizzes', 'rewards');

-- Check colonna role:
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'role';
```

---

### **Step 3: Test (1 min)**

**Richiesta Partner:**
```
1. Login nell'app
2. Vai su Profile
3. Vedi card "Diventa Partner"
4. Click "Richiedi Accesso"
5. Compila form:
   - Nome Squadra: "Test FC"
   - Descrizione: "Team di test per SPORTIUM"
6. Submit
7. ✅ Vedi "Richiesta in Corso"
```

**Approvazione (SQL manuale per test):**
```sql
-- Prendi user_id dal profilo
SELECT id, email, partner_name, partner_request_status 
FROM profiles 
WHERE partner_request_status = 'pending';

-- Approva partner:
SELECT update_partner_status(
  'USER_ID_QUI',  -- Sostituisci con l'ID
  true           -- true = approve, false = reject
);

-- Verifica:
SELECT email, role, partner_verified 
FROM profiles 
WHERE id = 'USER_ID';
-- Aspettati: role = 'partner', partner_verified = true
```

**Test Partner Dashboard:**
```
1. Reload app (o re-login)
2. Profilo → Vedi card verde "Partner Dashboard"
3. Click "Apri Dashboard"
4. ✅ Partner Dashboard opens!
5. Overview tab → 3 stats cards
6. Click "Crea Quiz"
7. Compila form
8. Submit → ✅ Quiz creato!
```

---

## 🎯 Cosa Hai Ottenuto

```
✅ 3 Ruoli:
   - user (fan normale)
   - partner (squadra)
   - admin (SPORTIUM)

✅ Partner possono:
   - Richiedere accesso
   - Creare quiz
   - Creare premi
   - Creare aste

✅ Admin possono:
   - Approvare/rifiutare partner
   - Gestire tutti i contenuti

✅ Database:
   - 6 tabelle nuove
   - RLS policies
   - Functions SQL
```

---

## 📱 UI Flow

```
User Profile:
├── Se role = 'user' (no richiesta)
│   └─→ Card: "Diventa Partner" + Button "Richiedi Accesso"
│
├── Se partner_request_status = 'pending'
│   └─→ Card gialla: "Richiesta in Corso" + Badge "In Attesa"
│
└── Se role = 'partner' o 'admin'
    └─→ Card verde: "Partner Dashboard" + Button "Apri Dashboard"


Partner Dashboard:
├── Overview
│   ├─ 3 stats cards (Quiz, Premi, Aste)
│   └─ Quick actions (3 bottoni grandi)
│
├── Quiz Tab
│   ├─ Lista quiz creati
│   └─ Button "Nuovo Quiz" → Modal → Crea quiz
│
├── Premi Tab
│   ├─ Lista rewards creati
│   └─ Button "Nuovo Premio" → Modal → Crea premio
│
└── Aste Tab
    └─ Link ad Auctions page
```

---

## ⚠️ TODO (Implementare dopo)

```
Admin Panel:
☐ Aggiungi button "Approve Partner" in Users tab
☐ Aggiungi tab "Partner Requests" per vedere richieste pending

Functions:
const handleApprovePartner = async (userId: string, approved: boolean) => {
  const { data, error } = await supabase.rpc('update_partner_status', {
    p_user_id: userId,
    p_approved: approved
  });
  if (error) throw error;
  toast.success(approved ? 'Partner approvato!' : 'Richiesta rifiutata');
  fetchUsers();
};
```

---

## 🎉 Done!

```
╔═══════════════════════════════════════╗
║                                       ║
║   ✅  PARTNER SYSTEM READY!           ║
║                                       ║
║   Squadre possono ora:                ║
║   ✓ Richiedere accesso partner        ║
║   ✓ Creare quiz per fans              ║
║   ✓ Creare premi riscattabili         ║
║   ✓ Gestire aste                      ║
║                                       ║
║   Fan engagement: NEXT LEVEL! 🚀      ║
║                                       ║
╚═══════════════════════════════════════╝
```

**Guida Completa:** [PARTNER_SYSTEM_COMPLETE.md](/PARTNER_SYSTEM_COMPLETE.md)
