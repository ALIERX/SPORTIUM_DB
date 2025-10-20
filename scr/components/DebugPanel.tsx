import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function DebugPanel() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [testSignup, setTestSignup] = useState<any>(null);
  const [emailCheck, setEmailCheck] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-81e425c4/health`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      setHealthStatus({ error: String(error) });
    }
    setLoading(false);
  };

  const testSignupEndpoint = async () => {
    setLoading(true);
    try {
      const email = testEmail || `test-${Date.now()}@sportium.test`;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-81e425c4/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            password: 'testpassword123',
            username: 'TestUser',
          }),
        }
      );
      const data = await response.json();
      setTestSignup({ 
        email,
        status: response.status, 
        ok: response.ok,
        data 
      });
    } catch (error) {
      setTestSignup({ error: String(error) });
    }
    setLoading(false);
  };

  const checkEmail = async () => {
    if (!testEmail) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-81e425c4/auth/check-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email: testEmail }),
        }
      );
      const data = await response.json();
      setEmailCheck({ email: testEmail, ...data });
    } catch (error) {
      setEmailCheck({ error: String(error) });
    }
    setLoading(false);
  };

  const copySQL = () => {
    const sql = `-- Rimuovi trigger che interferiscono con signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS create_user_wallet ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile ON auth.users;

-- Rimuovi funzioni associate
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_wallet() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile() CASCADE;`;
    
    navigator.clipboard.writeText(sql);
    alert("✅ SQL copiato! Incollalo in Supabase SQL Editor");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-h-[90vh] overflow-auto">
      <Card className="p-4 bg-[#111318] border-yellow-500/50 w-96">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white">🔧 Debug Panel</h3>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-xs text-cyan-glow hover:text-cyan-glow/80"
          >
            {showInstructions ? "Hide" : "Help"}
          </button>
        </div>
        
        {showInstructions && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-white space-y-2">
            <div className="font-bold text-red-400">⚠️ Errore "Database error creating new user"</div>
            <div>
              <strong>Causa:</strong> Trigger di database cerca di inserire in tabella "wallets" che non esiste.
            </div>
            <div>
              <strong>Fix:</strong>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-white/80">
              <li>Vai su Supabase Dashboard</li>
              <li>SQL Editor → New Query</li>
              <li>Click "Copy SQL" qui sotto</li>
              <li>Incolla ed esegui nel SQL Editor</li>
              <li>Torna qui e testa signup</li>
            </ol>
            <Button
              onClick={copySQL}
              size="sm"
              className="w-full bg-red-500 hover:bg-red-600 mt-2"
            >
              📋 Copy SQL Fix
            </Button>
            <div className="text-white/60 mt-2">
              Vedi anche: <code className="text-neon-lime">/FIX_TRIGGER.sql</code>
            </div>
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          <Button 
            onClick={checkHealth} 
            disabled={loading}
            size="sm"
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Check Server Health
          </Button>

          <div className="space-y-1">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-3 py-2 text-sm rounded bg-black/30 text-white border border-white/20"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={checkEmail} 
                disabled={loading || !testEmail}
                size="sm"
                className="bg-purple-500 hover:bg-purple-600"
              >
                Check Email
              </Button>
              <Button 
                onClick={testSignupEndpoint} 
                disabled={loading}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                Test Signup
              </Button>
            </div>
          </div>
        </div>

        {healthStatus && (
          <div className="mb-3">
            <div className="text-xs text-white/70 mb-1">Health Status:</div>
            <pre className="text-xs text-white bg-black/30 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(healthStatus, null, 2)}
            </pre>
          </div>
        )}

        {emailCheck && (
          <div className="mb-3">
            <div className="text-xs text-white/70 mb-1">Email Check:</div>
            <pre className="text-xs text-white bg-black/30 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(emailCheck, null, 2)}
            </pre>
          </div>
        )}

        {testSignup && (
          <div>
            <div className="text-xs text-white/70 mb-1">Signup Test:</div>
            <pre className="text-xs text-white bg-black/30 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(testSignup, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
}
