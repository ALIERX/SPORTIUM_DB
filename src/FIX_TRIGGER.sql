-- ============================================
-- SPORTIUM - FIX SIGNUP TRIGGER
-- ============================================
-- 
-- PROBLEMA: 
-- Esiste un trigger su auth.users che cerca di inserire 
-- nella tabella "wallets" quando un utente si registra,
-- ma la tabella non esiste → signup fallisce.
--
-- SOLUZIONE:
-- Rimuovere/disabilitare i trigger che cercano di creare
-- wallets o profiles automaticamente.
--
-- ============================================

-- STEP 1: Trova tutti i trigger su auth.users
-- Esegui questa query per vedere cosa c'è:

SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth';

-- ============================================

-- STEP 2: Trova trigger che menzionano "wallets" o "profiles"
-- (Se la query sopra non mostra nulla, prova questa)

SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND (
    action_statement ILIKE '%wallets%' 
    OR action_statement ILIKE '%profiles%'
  );

-- ============================================

-- STEP 3: Rimuovi i trigger comuni
-- Esegui questi comandi uno alla volta
-- (Se ricevi "trigger does not exist", va bene, continua)

-- Trigger comuni di Supabase per auto-creazione wallet:
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS create_user_wallet ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile ON auth.users;
DROP TRIGGER IF EXISTS insert_user_wallet ON auth.users;
DROP TRIGGER IF EXISTS insert_user_profile ON auth.users;

-- ============================================

-- STEP 4: Rimuovi anche le funzioni trigger associate
-- (Se la funzione non esiste, va bene, continua)

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_wallet() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS public.insert_user_wallet() CASCADE;
DROP FUNCTION IF EXISTS public.insert_user_profile() CASCADE;

-- ============================================

-- STEP 5: Verifica che i trigger siano stati rimossi
-- Riesegui la query dello STEP 1
-- Dovrebbe tornare 0 risultati

SELECT 
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth';

-- ============================================
-- DONE! 
-- ============================================
--
-- Ora prova a fare signup dalla tua app.
-- Il trigger non interferirà più e il nostro server
-- gestirà la creazione di wallet e profile nel KV store.
--
-- ============================================

-- OPZIONALE: Se vuoi vedere tutte le tabelle esistenti
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Dovresti vedere solo: kv_store_81e425c4
-- (e altre tabelle di sistema)
