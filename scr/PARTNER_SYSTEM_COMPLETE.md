# 🤝 Partner System - Guida Completa

## 🎯 Panoramica

Il Partner System permette alle squadre/organizzazioni di:
1. **Registrarsi** come partner su SPORTIUM
2. **Essere approvati** dall'admin
3. **Creare contenuti** per coinvolgere i propri fans:
   - 📝 Quiz personalizzati
   - 🏆 Aste per oggetti esclusivi
   - 🎁 Premi riscattabili con Fans Points

---

## 🔐 3 Ruoli Utente

```typescript
type UserRole = 'user' | 'partner' | 'admin';

// user → Fan normale (default)
// partner → Squadra/Organizzazione (crea contenuti)
// admin → Admin SPORTIUM (approva partner, full access)
```

---

## 🗄️ Database Schema

### **Tabella: `profiles` (Updated)**

```sql
-- Campi aggiunti:
role                     text DEFAULT 'user'
partner_name             text
partner_description      text
partner_logo_url         text
partner_verified         boolean DEFAULT false
partner_request_status   text ('pending', 'approved', 'rejected', NULL)
partner_requested_at     timestamptz
```

### **Tabella: `quizzes`**

```sql
CREATE TABLE quizzes (
  id uuid PRIMARY KEY,
  created_by uuid REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  category text DEFAULT 'general',
  difficulty text ('easy', 'medium', 'hard'),
  points_reward integer DEFAULT 100,
  time_limit_seconds integer DEFAULT 300,
  status text ('draft', 'published', 'archived'),
  starts_at timestamptz,
  ends_at timestamptz,
  image_url text,
  created_at timestamptz,
  updated_at timestamptz
);
```

### **Tabella: `quiz_questions`**

```sql
CREATE TABLE quiz_questions (
  id uuid PRIMARY KEY,
  quiz_id uuid REFERENCES quizzes(id),
  question_text text NOT NULL,
  question_type text ('multiple_choice', 'true_false', 'text'),
  correct_answer text NOT NULL,
  options jsonb, -- Array opzioni
  points integer DEFAULT 10,
  order_index integer,
  created_at timestamptz
);
```

### **Tabella: `quiz_attempts`**

```sql
CREATE TABLE quiz_attempts (
  id uuid PRIMARY KEY,
  quiz_id uuid REFERENCES quizzes(id),
  user_id uuid REFERENCES profiles(id),
  score integer DEFAULT 0,
  max_score integer,
  answers jsonb,
  completed_at timestamptz,
  time_taken_seconds integer,
  points_earned integer,
  UNIQUE(quiz_id, user_id) -- Un tentativo per quiz
);
```

### **Tabella: `rewards`**

```sql
CREATE TABLE rewards (
  id uuid PRIMARY KEY,
  created_by uuid REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  category text DEFAULT 'merchandise',
  points_cost integer NOT NULL,
  quantity_available integer DEFAULT 1,
  quantity_claimed integer DEFAULT 0,
  status text ('active', 'inactive', 'sold_out'),
  image_url text,
  terms_conditions text,
  expiry_date timestamptz,
  created_at timestamptz,
  updated_at timestamptz
);
```

### **Tabella: `reward_claims`**

```sql
CREATE TABLE reward_claims (
  id uuid PRIMARY KEY,
  reward_id uuid REFERENCES rewards(id),
  user_id uuid REFERENCES profiles(id),
  claimed_at timestamptz,
  status text ('pending', 'approved', 'delivered', 'cancelled'),
  delivery_info jsonb,
  notes text
);
```

### **Tabella: `auctions` (Updated)**

```sql
-- Campo aggiunto:
created_by_partner_id uuid REFERENCES profiles(id)
```

---

## 🚀 Setup (3 Step)

### **Step 1: Esegui Migration**

```bash
# In Supabase SQL Editor:
1. Apri /supabase/migrations/006_partner_system.sql
2. Copia TUTTO il contenuto
3. Incolla in SQL Editor
4. Click RUN
```

**Aspettati:**
```
✅ Partner System Migration Complete!

Created:
- Role system (user, partner, admin)
- Quizzes system with questions & attempts
- Rewards system with claims
- RLS policies for partners
- Functions for partner requests
```

---

### **Step 2: Verifica Tabelle**

```sql
-- Check che tutte le tabelle esistano:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'quizzes', 
  'quiz_questions', 
  'quiz_attempts',
  'rewards',
  'reward_claims'
);

-- Check colonna role in profiles:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'role';
```

---

### **Step 3: App Ready!**

L'app è già configurata con:
- ✅ `PartnerDashboard` component
- ✅ `PartnerRequestModal` component
- ✅ ProfilePage aggiornato
- ✅ App.tsx con route `/partner`

---

## 📱 User Journey

### **1. Fan Normale (User)**

```
1. Sign Up → Role: "user"
2. Usa app normalmente
3. Profilo → Vede card "Diventa Partner"
4. Click "Richiedi Accesso" → Modal opens
5. Compila form:
   - Nome Squadra
   - Descrizione
   - Logo URL (opzionale)
6. Submit → partner_request_status: "pending"
7. Vede badge "Richiesta in Corso"
```

---

### **2. Admin Approva Partner**

```
1. Admin login (double-click logo → Forzabari!)
2. Admin Dashboard → Users tab
3. Vede utenti con partner_request_status: "pending"
4. Click "Approve Partner"
5. User → role: "partner", verified: true
```

**Implementazione Admin Panel:**

Aggiungi al `/components/AdminPageEnhanced.tsx` nella Users tab:

```tsx
{user.partner_request_status === 'pending' && (
  <Button
    size="sm"
    onClick={() => handleApprovePartner(user.id, true)}
    className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
  >
    Approve Partner
  </Button>
)}
```

E la funzione:

```tsx
const handleApprovePartner = async (userId: string, approved: boolean) => {
  try {
    const { data, error } = await supabase.rpc('update_partner_status', {
      p_user_id: userId,
      p_approved: approved
    });

    if (error) throw error;

    toast.success(approved ? 'Partner approvato!' : 'Richiesta rifiutata');
    fetchUsers();
  } catch (error: any) {
    toast.error(`Errore: ${error.message}`);
  }
};
```

---

### **3. Partner Crea Contenuti**

```
1. Dopo approvazione → Profilo mostra card "Partner Dashboard"
2. Click "Apri Dashboard" → Route: /partner
3. Partner Dashboard con 4 tabs:
   - Overview: Quick actions
   - Quiz: Gestione quiz
   - Premi: Gestione rewards
   - Aste: Link ad Auctions page

4. Crea Quiz:
   - Click "Nuovo Quiz"
   - Form completo
   - Status: "draft"
   - Aggiunge domande (TODO: UI per domande)
   - Pubblica → Status: "published"

5. Crea Premio:
   - Click "Nuovo Premio"
   - Imposta costo in FP
   - Quantità disponibile
   - Status: "active"

6. Crea Asta:
   - Usa Auctions page normale
   - Asta creata con created_by_partner_id
```

---

## 🎨 UI Components

### **ProfilePage**

3 stati diversi:

```tsx
// 1. Se role = 'partner' o 'admin'
<Card>  // Verde/Cyan glow
  <Crown icon />
  Partner Dashboard
  <Button>Apri Dashboard</Button>
</Card>

// 2. Se partner_request_status = 'pending'
<Card>  // Yellow
  <Clock icon />
  Richiesta Partner in Corso
  <Badge>In Attesa</Badge>
</Card>

// 3. Se role = 'user' (nessuna richiesta)
<Card>  // Normale
  <Building2 icon />
  Diventa Partner
  <Button>Richiedi Accesso</Button>
</Card>
```

---

### **PartnerDashboard**

**Overview Tab:**
- 3 stats cards (Quiz, Premi, Aste)
- Quick actions (3 bottoni grandi)

**Quiz Tab:**
- Lista quiz del partner
- Button "Nuovo Quiz"
- Cards con:
  - Title, description
  - Status badge
  - Difficulty, category
  - Points reward
  - Edit/Delete buttons

**Premi Tab:**
- Lista rewards del partner
- Button "Nuovo Premio"
- Cards con:
  - Title, description
  - Status badge
  - Points cost
  - Disponibili / Totali
  - Edit/Delete buttons

**Aste Tab:**
- Placeholder
- Link a Auctions page

---

## 🔐 RLS Policies

### **Quizzes:**

```sql
-- Public può vedere quiz pubblicati
SELECT WHERE status = 'published'

-- Partner può gestire i suoi quiz
ALL WHERE auth.uid() = created_by AND role IN ('partner', 'admin')

-- Admin può gestire tutti i quiz
ALL WHERE role = 'admin'
```

### **Rewards:**

```sql
-- Public può vedere rewards attivi
SELECT WHERE status = 'active'

-- Partner può gestire i suoi rewards
ALL WHERE auth.uid() = created_by AND role IN ('partner', 'admin')
```

### **Quiz Attempts:**

```sql
-- User può vedere i suoi tentativi
SELECT WHERE auth.uid() = user_id

-- User può sottomettere tentativi
INSERT WITH CHECK (auth.uid() = user_id)

-- Partner può vedere tentativi sui suoi quiz
SELECT WHERE quiz.created_by = auth.uid()
```

---

## 📡 Functions SQL

### **request_partner_status()**

```sql
-- Richiede status partner
SELECT request_partner_status(
  'FC Inter Milano',
  'Vogliamo coinvolgere i nostri fans...',
  'https://logo.url'
);

-- Aggiorna profile con:
-- partner_name, partner_description, partner_logo_url
-- partner_request_status: 'pending'
-- partner_requested_at: now()
```

### **update_partner_status()**

```sql
-- Admin approva/rifiuta (SECURITY DEFINER)
SELECT update_partner_status(
  'user_uuid',
  true  -- approved
);

-- Se approved:
-- role → 'partner'
-- partner_verified → true
-- partner_request_status → 'approved'

-- Se rejected:
-- role → 'user'
-- partner_request_status → 'rejected'
```

---

## 🧪 Testing

### **Test 1: Richiesta Partner**

```
1. Login come user normale
2. Profilo → "Diventa Partner"
3. Form:
   - Nome: "Test FC"
   - Descrizione: "Team di test"
   - Logo: (vuoto)
4. Submit
5. ✅ Vedi badge "Richiesta in Corso"

Check DB:
SELECT partner_name, partner_request_status 
FROM profiles 
WHERE id = 'user_id';
→ partner_name: "Test FC"
→ partner_request_status: "pending"
```

---

### **Test 2: Approvazione Admin**

```sql
-- Approva manualmente:
SELECT update_partner_status(
  'user_uuid_from_test_1',
  true
);

-- Check:
SELECT role, partner_verified 
FROM profiles 
WHERE id = 'user_id';
→ role: "partner"
→ partner_verified: true
```

---

### **Test 3: Partner Dashboard**

```
1. Refresh app (o re-login)
2. Profilo → Vedi card "Partner Dashboard" verde
3. Click "Apri Dashboard"
4. ✅ Vedi PartnerDashboard
5. Overview → 3 stats cards (tutti = 0)
6. Quick Actions → 3 bottoni
```

---

### **Test 4: Crea Quiz**

```
1. Partner Dashboard → Tab "Quiz"
2. Click "Nuovo Quiz"
3. Form:
   - Titolo: "Quiz Serie A"
   - Descrizione: "Test quiz"
   - Categoria: "football"
   - Difficoltà: "medium"
   - Reward: 100 FP
   - Tempo: 300 sec
4. Submit
5. ✅ Modal chiude, quiz appare in lista
6. Badge "draft"

Check DB:
SELECT title, status, created_by 
FROM quizzes 
WHERE created_by = 'partner_id';
→ title: "Quiz Serie A"
→ status: "draft"
```

---

### **Test 5: Crea Premio**

```
1. Tab "Premi"
2. Click "Nuovo Premio"
3. Form:
   - Titolo: "Maglia Autografata"
   - Descrizione: "Maglia ufficiale"
   - Categoria: "merchandise"
   - Costo: 5000 FP
   - Quantità: 3
4. Submit
5. ✅ Premio appare in lista
6. Badge "active"
7. "3/3 disponibili"

Check DB:
SELECT title, status, points_cost, quantity_available 
FROM rewards 
WHERE created_by = 'partner_id';
```

---

## 🎯 TODO / Estensioni Future

### **Quiz System:**
- [ ] UI per aggiungere domande ai quiz
- [ ] Quiz preview prima di pubblicare
- [ ] Quiz analytics (quanti hanno partecipato, score medio)
- [ ] Quiz leaderboard per quiz

### **Rewards System:**
- [ ] Upload immagini rewards
- [ ] Approval workflow per reward claims
- [ ] Delivery tracking
- [ ] Rewards analytics

### **Auctions:**
- [ ] Link created_by_partner_id nelle CreateAuctionModal
- [ ] Partner-only auctions filter
- [ ] Auction analytics per partner

### **Admin Panel:**
- [ ] Tab "Partner Requests" in AdminPage
- [ ] Approve/Reject buttons
- [ ] Partner analytics (quanti contenuti, engagement)
- [ ] Disable partner feature

### **Notifiche:**
- [ ] Notifica user quando partner approvato
- [ ] Notifica partner quando qualcuno fa il quiz
- [ ] Notifica partner quando qualcuno riscatta premio

---

## ✅ Checklist Setup

```
Database:
☐ Eseguito 006_partner_system.sql
☐ Verificato tabelle create
☐ Verificato colonna role aggiunta
☐ Verificato functions create

Frontend:
☑ PartnerDashboard.tsx creato
☑ PartnerRequestModal.tsx creato
☑ ProfilePage.tsx aggiornato
☑ App.tsx aggiornato (route /partner)

Admin:
☐ AdminPage: Aggiungi approve partner button
☐ AdminPage: Tab per partner requests

Testing:
☐ Test richiesta partner
☐ Test approvazione (manuale SQL)
☐ Test partner dashboard access
☐ Test crea quiz
☐ Test crea reward
☐ Test RLS policies
```

---

## 🎉 Success!

```
╔═══════════════════════════════════════════╗
║                                           ║
║   ✅  PARTNER SYSTEM READY!               ║
║                                           ║
║   Squadre possono:                        ║
║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║   ✓ Richiedere status partner             ║
║   ✓ Essere approvate da admin              ║
║   ✓ Accedere a Partner Dashboard           ║
║   ✓ Creare quiz personalizzati             ║
║   ✓ Creare premi riscattabili              ║
║   ✓ Gestire aste (via Auctions page)       ║
║                                           ║
║   Fans engagement: NEXT LEVEL! 🚀         ║
║                                           ║
╚═══════════════════════════════════════════╝
```

---

**Start:** Esegui `/supabase/migrations/006_partner_system.sql` → Test! 🎉
