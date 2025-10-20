# ⚡ SPORTIUM - Quick Start Production (10 min)

## 🎯 Goal

Trasforma SPORTIUM da prototipo a **production-ready** in 10 minuti.

---

## ✅ Step 1: Supabase Dashboard (2 min)

1. Vai su https://supabase.com/dashboard
2. Seleziona progetto SPORTIUM
3. Click **"SQL Editor"**

---

## ✅ Step 2: Run Migrations (6 min)

Copia e incolla questi file **in ordine**, uno alla volta:

### 🗄️ **Migration 1: Complete Schema**
```
File: /supabase/migrations/001_complete_schema.sql
Time: ~30 seconds
```
- Apri file, copia TUTTO
- Incolla in SQL Editor → New Query
- Click **"Run"**
- ✅ Aspetta "SUCCESS"

### 📦 **Migration 2: Storage**
```
File: /supabase/migrations/002_storage_setup.sql
Time: ~10 seconds
```
- Copia TUTTO → New Query → Run
- ✅ Aspetta "SUCCESS"

### 🔐 **Migration 3: Security**
```
File: /supabase/migrations/003_rls_policies.sql
Time: ~20 seconds
```
- Copia TUTTO → New Query → Run
- ✅ Aspetta "SUCCESS"

### ⚡ **Migration 4: Indexes**
```
File: /supabase/migrations/004_indexes.sql
Time: ~30 seconds
```
- Copia TUTTO → New Query → Run
- ✅ Aspetta "SUCCESS"

### 🎮 **Migration 5: Seed Data** (Opzionale)
```
File: /supabase/migrations/005_seed_data.sql
Time: ~10 seconds
```
- Copia TUTTO → New Query → Run
- ✅ Aspetta "SUCCESS"

---

## ✅ Step 3: Verify (1 min)

Esegui questa query:

```sql
-- Check tables
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name NOT LIKE 'kv_%';
```

**Risultato atteso:** `table_count: 17` ✅

```sql
-- Check buckets
SELECT COUNT(*) as bucket_count 
FROM storage.buckets;
```

**Risultato atteso:** `bucket_count: 4` ✅

---

## ✅ Step 4: Test (1 min)

1. Torna alla tua app SPORTIUM
2. Profile → Sign Up
3. Crea un nuovo account di test
4. Verifica:
   - ✅ Account creato
   - ✅ Wallet: 18,450 FP
   - ✅ Nessun errore

---

## 🎉 Done!

Hai ora:
- ✅ **17 tabelle SQL**
- ✅ **4 storage buckets**
- ✅ **Row Level Security**
- ✅ **50+ indexes**
- ✅ **Production-ready!**

---

## 📚 Next Steps

### **Immediate:**
1. Leggi [`COMPLETE_SETUP_SUMMARY.md`](/COMPLETE_SETUP_SUMMARY.md)
2. Vedi come usare SQL: [`CODE_MIGRATION_GUIDE.md`](/CODE_MIGRATION_GUIDE.md)

### **This Week:**
3. Migra codice da KV a SQL
4. Aggiungi real-time subscriptions
5. Implementa file upload

### **This Month:**
6. Completa tutte le features
7. Deploy in produzione
8. Scala a migliaia di utenti

---

## 🆘 Help

- **Setup completo:** [`PRODUCTION_SETUP_GUIDE.md`](/PRODUCTION_SETUP_GUIDE.md)
- **Code examples:** [`CODE_MIGRATION_GUIDE.md`](/CODE_MIGRATION_GUIDE.md)
- **Troubleshooting:** [`TROUBLESHOOTING.md`](/TROUBLESHOOTING.md)

---

**SPORTIUM è production-ready! 🚀⚽🏆**
