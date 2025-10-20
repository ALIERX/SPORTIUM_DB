import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    
    // Password check: "Forzabari!"
    if (password === 'Forzabari!') {
      // Store admin session
      sessionStorage.setItem('sportium_admin_auth', 'true');
      toast.success('✅ Accesso Admin Autorizzato!');
      onSuccess();
      onClose();
    } else {
      toast.error('❌ Password Errata!');
    }
    
    setIsLoading(false);
    setPassword('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Admin Access</DialogTitle>
              <DialogDescription>
                Pannello di Amministrazione SPORTIUM
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password Amministratore
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Inserisci password admin..."
              className="bg-input-background border-border"
              autoFocus
            />
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={isLoading || !password}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? 'Verifica...' : 'Accedi al Pannello'}
          </Button>

          {/* Info */}
          <div className="p-3 bg-muted/20 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center">
              🔒 Accesso riservato agli amministratori SPORTIUM
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
