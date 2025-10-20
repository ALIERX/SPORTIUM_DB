import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { Building2, CheckCircle, AlertTriangle } from 'lucide-react';

interface PartnerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PartnerRequestModal({ isOpen, onClose, onSuccess }: PartnerRequestModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [schemaError, setSchemaError] = useState(false);
  const [formData, setFormData] = useState({
    partnerName: '',
    partnerDescription: '',
    partnerLogoUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.partnerName) {
      toast.error('Inserisci il nome della tua squadra/organizzazione');
      return;
    }

    if (!formData.partnerDescription) {
      toast.error('Inserisci una descrizione');
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Devi essere loggato per richiedere lo status partner');
        return;
      }

      // Update profile directly with partner request info
      const { error } = await supabase
        .from('profiles')
        .update({
          partner_name: formData.partnerName,
          partner_description: formData.partnerDescription,
          partner_logo_url: formData.partnerLogoUrl || null,
          partner_request_status: 'pending',
          partner_requested_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('🎉 Richiesta partner inviata! Riceverai una notifica quando verrà approvata.');
      setFormData({ partnerName: '', partnerDescription: '', partnerLogoUrl: '' });
      await onSuccess();
      // Don't call onClose() here - let onSuccess handle it
    } catch (error: any) {
      console.error('Partner request error:', error);
      
      // Check if it's a schema error (missing columns)
      if (error.code === 'PGRST204' || error.message?.includes('column') || error.message?.includes('schema cache')) {
        setSchemaError(true);
        toast.error(
          'Database non configurato. Controlla le istruzioni nel modale.',
          { duration: 5000 }
        );
      } else {
        toast.error(`Errore: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111318] border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#A7FF1A]" />
            Diventa Partner SPORTIUM
          </DialogTitle>
          <DialogDescription className="text-[#A9AFBC]">
            Coinvolgi i tuoi fans creando quiz, aste e premi esclusivi
          </DialogDescription>
        </DialogHeader>

        {schemaError && (
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-200 text-sm ml-2">
              <strong>Configurazione Database Richiesta</strong>
              <br />
              Le colonne partner non sono state ancora create nel database.
              <br />
              <br />
              <strong>Fix Rapido:</strong>
              <ol className="list-decimal ml-4 mt-2 space-y-1">
                <li>Apri Supabase → SQL Editor</li>
                <li>Esegui lo script <code className="bg-black/30 px-1 rounded">FIX_PARTNER_COLUMNS.sql</code></li>
                <li>Refresh questa pagina</li>
              </ol>
              <br />
              Vedi <code className="bg-black/30 px-1 rounded">PARTNER_COLUMNS_FIX_GUIDE.md</code> per dettagli.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="partner-name">
              Nome Squadra/Organizzazione *
            </Label>
            <Input
              id="partner-name"
              placeholder="Es: FC Inter Milano"
              value={formData.partnerName}
              onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
              className="bg-[#2B2F3A] border-white/10 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner-desc">
              Descrizione *
            </Label>
            <Textarea
              id="partner-desc"
              placeholder="Descrivi la tua squadra e cosa vuoi offrire ai fans..."
              value={formData.partnerDescription}
              onChange={(e) => setFormData({ ...formData, partnerDescription: e.target.value })}
              className="bg-[#2B2F3A] border-white/10 text-white"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner-logo">
              Logo URL (opzionale)
            </Label>
            <Input
              id="partner-logo"
              type="url"
              placeholder="https://..."
              value={formData.partnerLogoUrl}
              onChange={(e) => setFormData({ ...formData, partnerLogoUrl: e.target.value })}
              className="bg-[#2B2F3A] border-white/10 text-white"
            />
          </div>

          <div className="bg-[#A7FF1A]/10 border border-[#A7FF1A]/20 rounded-lg p-4">
            <h4 className="text-white flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-[#A7FF1A]" />
              Cosa Otterrai:
            </h4>
            <ul className="space-y-1 text-sm text-[#A9AFBC]">
              <li>✓ Dashboard dedicata per creare contenuti</li>
              <li>✓ Possibilità di creare quiz personalizzati</li>
              <li>✓ Gestire aste per oggetti esclusivi</li>
              <li>✓ Offrire premi ai fans più fedeli</li>
              <li>✓ Badge "Partner Verificato"</li>
              <li>✓ Analytics e statistiche dettagliate</li>
            </ul>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-white/10 text-white hover:bg-white/10"
            disabled={isLoading}
          >
            Annulla
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
            disabled={isLoading}
          >
            {isLoading ? 'Invio...' : 'Invia Richiesta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
