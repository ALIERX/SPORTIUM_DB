# 🔧 Fix Partner Columns - Guida Rapida

## ❌ Problema
Quando provi a richiedere lo status partner, vedi l'errore:
```
"Could not find the 'partner_description' column of 'profiles' in the schema cache"
```

Questo succede perché le colonne partner non sono state ancora aggiunte al database.

## ✅ Soluzione (2 Minuti)

### Step 1: Vai al SQL Editor di Supabase
1. Apri il tuo progetto Supabase
2. Vai su **SQL Editor** nella sidebar sinistra
3. Clicca su **+ New Query**

### Step 2: Esegui lo Script
1. Apri il file `FIX_PARTNER_COLUMNS.sql` 
2. Copia tutto il contenuto
3. Incollalo nel SQL Editor
4. Clicca su **Run** (o premi Ctrl+Enter / Cmd+Enter)

### Step 3: Verifica il Fix
Dovresti vedere un output come questo:
```
column_name              | data_type | is_nullable | column_default
-------------------------+-----------+-------------+----------------
role                     | text      | YES         | 'user'
partner_name             | text      | YES         | NULL
partner_description      | text      | YES         | NULL
partner_logo_url         | text      | YES         | NULL
partner_verified         | boolean   | YES         | false
partner_request_status   | text      | YES         | NULL
partner_requested_at     | timestamp | YES         | NULL
```

### Step 4: Refresh l'App
1. Torna alla tua app SPORTIUM
2. Fai un refresh della pagina (F5 o Cmd+R)
3. Prova di nuovo a richiedere lo status partner

## 🎉 Risultato
Ora il Partner Request Modal funzionerà perfettamente e potrai:
- ✓ Richiedere lo status partner senza errori
- ✓ Vedere il tuo status nella ProfilePage
- ✓ Accedere alla Partner Dashboard quando approvato

## 📋 Colonne Aggiunte

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| `role` | text | Ruolo utente: 'user', 'partner', 'admin' |
| `partner_name` | text | Nome della squadra/organizzazione |
| `partner_description` | text | Descrizione del partner |
| `partner_logo_url` | text | URL del logo |
| `partner_verified` | boolean | Badge "Partner Verificato" |
| `partner_request_status` | text | 'pending', 'approved', 'rejected' |
| `partner_requested_at` | timestamptz | Data della richiesta |

## 🛡️ Nota sulla Sicurezza
Lo script usa `ADD COLUMN IF NOT EXISTS`, quindi:
- ✅ È sicuro eseguirlo più volte
- ✅ Non sovrascrive dati esistenti  
- ✅ Non causa downtime
- ✅ Funziona anche se le colonne esistono già

## 🔗 Prossimi Passi
Dopo aver fixato le colonne:
1. Gli utenti possono richiedere lo status partner
2. Gli admin possono approvare/rifiutare le richieste
3. I partner approvati vedono la Partner Dashboard
4. I partner possono creare quiz, aste e premi

## 🆘 Troubleshooting

### "permission denied" error?
Assicurati di essere loggato come **Owner** del progetto Supabase.

### Le colonne ci sono ma l'errore persiste?
1. Vai su **Database** → **Tables** → **profiles**
2. Verifica che le colonne siano visibili
3. Prova a fare **Reload Schema Cache** nelle Settings

### Vuoi verificare manualmente?
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

## ✨ Bonus Fix
Abbiamo anche risolto il warning React forwardRef nel Dialog component.
