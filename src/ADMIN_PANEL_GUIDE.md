# 🛡️ SPORTIUM - Admin Panel Guide

## 📋 Overview

Il Pannello Admin ti permette di controllare e moderare tutti gli aspetti di SPORTIUM.

---

## 🔐 Accesso Admin

### **Metodo 1: Shield Button (Raccomandato)**
1. Guarda l'header in alto a destra
2. Click sull'icona **Shield** 🛡️ (vicino alle notifiche)
3. Inserisci password: **`Forzabari!`**
4. Click "Accedi al Pannello"
5. ✅ Sei dentro!

### **Metodo 2: URL Diretto**
- Vai su `/admin` (dopo il login)

### **Password Admin:**
```
Forzabari!
```

**⚠️ IMPORTANTE:** La password è case-sensitive! Scrivi esattamente come mostrato.

---

## 🎯 Features del Pannello

### **1. Overview Dashboard**

Stats in tempo reale:
- 👥 **Utenti Totali**
- 🔨 **Aste Attive**
- 📊 **Transazioni**
- 💰 **FP Circolanti**

**Economia Overview:**
- Fans Points Guadagnati Totali
- Fans Points Spesi Totali
- Fans Points in Circolazione

**System Health:**
- Database Status
- Server Status
- Real-time Status

---

### **2. Gestione Utenti**

**Cosa puoi fare:**
- ✅ Vedere tutti gli utenti registrati
- ✅ Vedere balance, earned, spent per ogni utente
- ✅ Cercare utente per username o email
- ✅ **Aggiustare Balance** (aggiungere o rimuovere FP)

**Come aggiustare il balance:**
1. Trova l'utente nella lista
2. Click sul pulsante **Edit** (icona matita)
3. Inserisci importo:
   - Positivo per aggiungere (es: `5000`)
   - Negativo per sottrarre (es: `-2000`)
4. Conferma
5. ✅ Balance aggiornato + Notifica inviata all'utente

**Esempio:**
```
User: TestUser
Balance attuale: 10,000 FP

Aggiungi 5000 → Nuovo balance: 15,000 FP
Sottrai -3000 → Nuovo balance: 7,000 FP
```

---

### **3. Gestione Aste**

**Cosa puoi vedere:**
- Tutte le aste (attive e completate)
- Bid count per ogni asta
- Starting bid e current bid
- Data di chiusura
- Status (active, completed, cancelled)

**Cosa puoi fare:**
- ✅ **Chiudere un'asta manualmente** (pulsante X)
  - Assegna il vincitore
  - Invia notifica al vincitore
  - Cambia status a "completed"

- ✅ **Eliminare un'asta** (pulsante Trash)
  - Rimborsa TUTTI i bidder
  - Crea transazioni di refund
  - Invia notifiche di rimborso
  - Elimina l'asta completamente

**⚠️ Attenzione:** L'eliminazione è permanente!

---

### **4. Storico Transazioni**

**Cosa vedi:**
- Ultime 100 transazioni
- Tipo (purchase, reward, spend, refund)
- Importo
- Descrizione
- Username
- Timestamp

**Tipi di transazioni:**
- 💚 **purchase** - Acquisto FP
- 💚 **reward** - Ricompensa (quiz, challenge, admin)
- 🔴 **spend** - Spesa (bid, redemption)
- 💙 **refund** - Rimborso (bid superata, asta cancellata)

---

## 🔧 Setup Server Endpoints

Per far funzionare il pannello admin, devi aggiungere gli endpoint al server.

### **Step 1: Apri il tuo server**
```
/supabase/functions/server/index.tsx
```

### **Step 2: Copia gli endpoint admin**
```
/supabase/functions/server/admin_endpoints.tsx
```

### **Step 3: Incolla gli endpoint**
- Apri `admin_endpoints.tsx`
- Copia **TUTTO** il contenuto
- Incolla alla fine di `index.tsx` (prima di `Deno.serve`)

### **Endpoint creati:**
```typescript
// Stats
GET /admin/stats

// Users
GET /admin/users
POST /admin/users/:userId/adjust-balance
POST /admin/users/:userId/ban

// Auctions
GET /admin/auctions
POST /admin/auctions/:auctionId/end
DELETE /admin/auctions/:auctionId

// Transactions
GET /admin/transactions?limit=100

// Logs
GET /admin/logs
```

---

## 📊 Use Cases

### **Use Case 1: Dare FP Bonus a un Utente**

Scenario: Vuoi dare 10,000 FP bonus a un utente per un contest.

Steps:
1. Admin Panel → Tab "Utenti"
2. Cerca l'utente
3. Click Edit button
4. Inserisci: `10000`
5. Conferma
6. ✅ L'utente riceve 10,000 FP + notifica

---

### **Use Case 2: Rimuovere FP da Utente Cheater**

Scenario: Un utente ha sfruttato un bug e ha troppi FP.

Steps:
1. Admin Panel → Tab "Utenti"
2. Cerca l'utente
3. Click Edit button
4. Inserisci: `-50000` (importo negativo)
5. Conferma
6. ✅ FP rimossi + notifica inviata

---

### **Use Case 3: Chiudere Asta Prematuramente**

Scenario: Un'asta ha contenuto inappropriato.

Steps:
1. Admin Panel → Tab "Aste"
2. Trova l'asta
3. **Opzione A - Chiudi:**
   - Click pulsante X
   - L'asta si chiude, vincitore assegnato
4. **Opzione B - Elimina:**
   - Click pulsante Trash
   - Conferma
   - Tutti i bidder vengono rimborsati
   - Asta eliminata

---

### **Use Case 4: Monitorare Economia**

Scenario: Vuoi vedere se c'è inflazione.

Steps:
1. Admin Panel → Tab "Overview"
2. Guarda "Economia Fans Points"
3. Controlla:
   - Earned vs Spent ratio
   - FP circolanti

**Healthy Economy:**
```
Earned: 500,000 FP
Spent:  400,000 FP
Circolanti: 100,000 FP
```

**Inflazione (problema):**
```
Earned: 1,000,000 FP
Spent:  200,000 FP
Circolanti: 800,000 FP (troppi!)
```

---

## 🚨 Sicurezza

### **Password Protection:**
- ✅ Password hardcoded: `Forzabari!`
- ✅ Session storage (logout = auto-logout admin)
- ✅ No backend validation (solo frontend)

### **⚠️ Importante per Production:**

Per un ambiente production reale, dovresti:

1. **Backend Validation:**
```typescript
// Nel server endpoint
const adminPassword = Deno.env.get('ADMIN_PASSWORD');
if (password !== adminPassword) {
  return c.json({ error: 'Unauthorized' }, 401);
}
```

2. **Database Admin Users:**
```sql
-- Aggiungi colonna is_admin a profiles
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
```

3. **JWT Token Admin:**
```typescript
// Usa JWT per auth admin invece di sessionStorage
```

---

## 📈 Stats Dashboard Explained

### **Total Users:**
- Conta profili nella tabella `profiles`
- Include tutti gli utenti registrati

### **Active Auctions:**
- Conta aste con `status = 'active'`
- Non include aste completate o cancellate

### **Total Transactions:**
- Tutte le transazioni nel database
- Include purchase, reward, spend, refund

### **FP Circolanti:**
- Somma di tutti i `balance_points` nei wallet
- Rappresenta i FP "liberi" nell'economia

### **FP Earned:**
- Somma di tutti i `total_earned` nei wallet
- Include purchase, reward, refund

### **FP Spent:**
- Somma di tutti i `total_spent` nei wallet
- Include bid, redemption

---

## 🎯 Best Practices

### **DO ✅**
- Controlla stats overview regolarmente
- Monitora transazioni per attività sospette
- Usa adjust balance con moderazione
- Documenta ogni azione admin importante

### **DON'T ❌**
- Non dare FP arbitrariamente senza motivo
- Non eliminare aste con molte bid senza avvisare
- Non condividere la password admin
- Non lasciare il pannello aperto incustodito

---

## 🔧 Troubleshooting

### **"Cannot fetch stats"**
➡️ Gli endpoint admin non sono stati aggiunti al server. Vedi "Setup Server Endpoints".

### **"Unauthorized" quando chiamo endpoint**
➡️ Verifica che stai usando `publicAnonKey` nell'header Authorization.

### **Admin button non visibile**
➡️ L'icona Shield è nell'header, vicino alle notifiche. Se non la vedi, verifica che `AdminLoginModal` sia importato.

### **Password non funziona**
➡️ La password è case-sensitive: `Forzabari!` (con F maiuscola e ! alla fine).

---

## 📝 Checklist Setup

- [ ] File creati:
  - [ ] `/components/AdminPage.tsx`
  - [ ] `/components/AdminLoginModal.tsx`
  - [ ] `/supabase/functions/server/admin_endpoints.tsx`

- [ ] App.tsx aggiornato:
  - [ ] Importato AdminPage e AdminLoginModal
  - [ ] Aggiunto route "admin"
  - [ ] Aggiunto admin login state

- [ ] Header.tsx aggiornato:
  - [ ] Aggiunto Shield button
  - [ ] Importato AdminLoginModal
  - [ ] Aggiunto admin auth check

- [ ] Server aggiornato:
  - [ ] Copiato contenuto admin_endpoints.tsx
  - [ ] Incollato in index.tsx
  - [ ] Testato endpoint /admin/stats

- [ ] Test:
  - [ ] Click Shield button
  - [ ] Login con "Forzabari!"
  - [ ] Dashboard carica
  - [ ] Stats visibili
  - [ ] Users list visibile
  - [ ] Adjust balance funziona

---

## 🎉 Pronto!

Ora hai un **Pannello Admin completo** per SPORTIUM!

**Quick Access:**
1. Click Shield 🛡️ in header
2. Password: `Forzabari!`
3. Manage everything! 🎮

**Next Steps:**
- Aggiungi gli endpoint al server
- Testa tutte le funzionalità
- Monitora l'economia
- Modera le aste

---

**SPORTIUM Admin Panel - Full Control! 🏆⚽**
