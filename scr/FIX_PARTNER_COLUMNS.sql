-- ============================================
-- FIX: Aggiungi Colonne Partner alla Tabella Profiles
-- ============================================
-- Esegui questo script nel SQL Editor di Supabase
-- per risolvere l'errore "Could not find the 'partner_description' column"
-- ============================================

-- Aggiungi colonne per il sistema Partner
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'partner', 'admin'));

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS partner_name text;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS partner_description text;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS partner_logo_url text;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS partner_verified boolean DEFAULT false;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS partner_request_status text CHECK (partner_request_status IN ('pending', 'approved', 'rejected', NULL));

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS partner_requested_at timestamptz;

-- Crea indici per performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_partner_status ON public.profiles(partner_request_status) WHERE partner_request_status IS NOT NULL;

-- Aggiungi colonna partner alle aste (opzionale)
ALTER TABLE public.auctions 
ADD COLUMN IF NOT EXISTS created_by_partner_id uuid REFERENCES public.profiles(id);

CREATE INDEX IF NOT EXISTS idx_auctions_partner ON public.auctions(created_by_partner_id) WHERE created_by_partner_id IS NOT NULL;

-- Verifica che le colonne siano state create
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN (
    'role', 
    'partner_name', 
    'partner_description', 
    'partner_logo_url', 
    'partner_verified', 
    'partner_request_status', 
    'partner_requested_at'
  )
ORDER BY ordinal_position;

-- ============================================
-- ✅ FATTO! 
-- ============================================
-- Ora il Partner Request Modal dovrebbe funzionare senza errori
-- ============================================
