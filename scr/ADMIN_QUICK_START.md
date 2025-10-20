# ⚡ Admin Panel - Quick Start

## 🎯 Setup in 3 Step (5 minuti)

### **Step 1: Aggiungi Endpoint Server** (2 min)

1. Apri `/supabase/functions/server/index.tsx`
2. Apri `/supabase/functions/server/admin_endpoints.tsx`
3. Copia **TUTTO** il contenuto di `admin_endpoints.tsx`
4. Incolla alla **FINE** di `index.tsx` (prima di `Deno.serve`)
5. Salva

---

### **Step 2: Test Endpoint** (1 min)

Verifica che funzioni:

```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-81e425c4/admin/stats \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Risposta attesa:**
```json
{
  "stats": {
    "totalUsers": 5,
    "totalAuctions": 3,
    "activeAuctions": 2,
    ...
  }
}
```

---

### **Step 3: Accedi al Pannello** (2 min)

1. Apri la tua app SPORTIUM
2. Guarda in alto a destra
3. Click icona **Shield** 🛡️
4. Password: **`Forzabari!`**
5. Click "Accedi al Pannello"
6. ✅ **Sei dentro!**

---

## 🎮 Cosa Puoi Fare

### **Dashboard:**
```
✅ Vedi stats in tempo reale
✅ Monitora economia FP
✅ Check system health
```

### **Users Tab:**
```
✅ Lista tutti gli utenti
✅ Vedi balance/earned/spent
✅ Cerca per username/email
✅ Aggiusta balance (+ o -)
```

### **Auctions Tab:**
```
✅ Lista tutte le aste
✅ Vedi bid count e importi
✅ Chiudi asta manualmente
✅ Elimina asta (con refund auto)
```

### **Transactions Tab:**
```
✅ Ultime 100 transazioni
✅ Filtra per tipo
✅ Vedi username e timestamp
```

---

## 💡 Quick Actions

### **Dare FP Bonus:**
```
1. Users tab
2. Trova utente
3. Click Edit
4. Inserisci: 5000
5. ✅ Done!
```

### **Rimuovere FP:**
```
1. Users tab
2. Trova utente
3. Click Edit
4. Inserisci: -5000
5. ✅ Done!
```

### **Chiudere Asta:**
```
1. Auctions tab
2. Trova asta
3. Click X button
4. ✅ Done!
```

### **Eliminare Asta:**
```
1. Auctions tab
2. Trova asta
3. Click Trash button
4. Conferma
5. ✅ Tutti rimborsati!
```

---

## 🔐 Password

```
Forzabari!
```

**⚠️ Case-sensitive!** Scrivi esattamente come mostrato.

---

## ✅ Checklist Veloce

- [ ] Endpoint aggiunti al server
- [ ] Test `/admin/stats` OK
- [ ] Click Shield button
- [ ] Login con password
- [ ] Dashboard visibile
- [ ] Users tab funziona
- [ ] Auctions tab funziona
- [ ] Transactions tab funziona

---

## 🎉 Done!

Hai il **controllo completo** di SPORTIUM!

**Guide Complete:** [`ADMIN_PANEL_GUIDE.md`](/ADMIN_PANEL_GUIDE.md)

**SPORTIUM Admin - Ready! 🛡️⚽**
