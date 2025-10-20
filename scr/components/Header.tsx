import { useState, useEffect } from "react";
import { Wallet, Zap, LogIn, Bell, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StreakCounter } from "./StreakCounter";
import { NotificationsPanel } from "./NotificationsPanel";
import { AdminLoginModal } from "./AdminLoginModal";
import logoImage from "figma:asset/ce7b0ec8e185fed3574ef2b6517369f59fa12071.png";
import { useAuth } from "../utils/supabase/AuthContext";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface HeaderProps {
  onBuyPoints: () => void;
  onNavigate: (tab: string) => void;
  showLogo?: boolean;
  userStreak?: number;
  streakMultiplier?: number;
}

export function Header({ onBuyPoints, onNavigate, showLogo = true, userStreak = 0, streakMultiplier = 1.0 }: HeaderProps) {
  const { user, wallet, session } = useAuth();
  const userPoints = wallet?.balance_points || 0;
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);

  // Check admin auth
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('sportium_admin_auth');
    if (adminAuth === 'true') {
      setIsAdminAuthed(true);
    }
  }, []);

  // Fetch unread notifications count
  useEffect(() => {
    if (user && session) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Check every 30s
      return () => clearInterval(interval);
    }
  }, [user, session]);

  const fetchUnreadCount = async () => {
    if (!session) return;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-81e425c4/notifications`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const unread = data.notifications.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications count:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#111318]/95 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Mobile */}
        {showLogo && (
          <div className="flex items-center gap-2 md:hidden">
            <img src={logoImage} alt="SPORTIUM" className="w-8 h-8" />
            <span className="text-lg text-white">SPORTIUM</span>
          </div>
        )}
        
        {/* Streak Counter - Desktop */}
        {userStreak > 0 && user && (
          <div className="hidden md:block">
            <StreakCounter days={userStreak} multiplier={streakMultiplier} />
          </div>
        )}
        
        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {user ? (
            <>
              {/* Points Balance */}
              <div className="flex items-center gap-2 bg-[#2B2F3A] rounded-lg px-3 py-2 border border-white/10">
                <Wallet className="w-4 h-4 text-[#A7FF1A]" />
                <span className="text-sm text-white">{userPoints.toLocaleString()}</span>
                <span className="text-xs text-[#A9AFBC]">FP</span>
              </div>
              
              {/* Buy Points - Mobile */}
              <Button
                onClick={onBuyPoints}
                size="sm"
                className="md:hidden bg-[#A7FF1A] hover:bg-[#8FE515] text-[#0A1020]"
              >
                <Wallet className="w-4 h-4" />
              </Button>
              
              {/* Buy Points - Desktop */}
              <Button
                onClick={onBuyPoints}
                size="sm"
                className="hidden md:flex bg-[#A7FF1A] hover:bg-[#8FE515] text-[#0A1020] glow-neon"
              >
                <Zap className="w-4 h-4 mr-2" />
                Compra Fans Points
              </Button>

              {/* Notifications Bell */}
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2 rounded-lg hover:bg-[#2B2F3A] transition-colors"
              >
                <Bell className="w-5 h-5 text-[#A9AFBC]" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#A7FF1A] text-[#0A1020] text-xs border-0">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </button>

              {/* Admin Button (visible only if authed or for testing) */}
              <button
                onClick={() => {
                  if (isAdminAuthed) {
                    onNavigate('admin');
                  } else {
                    setIsAdminLoginOpen(true);
                  }
                }}
                className="relative p-2 rounded-lg hover:bg-primary/10 transition-colors group"
                title="Admin Panel"
              >
                <Shield className={`w-5 h-5 ${isAdminAuthed ? 'text-primary' : 'text-muted-foreground'} group-hover:text-primary`} />
              </button>
            </>
          ) : (
            <Button 
              onClick={() => onNavigate('profile')}
              size="sm"
              className="bg-[#A7FF1A] hover:bg-[#8FE515] text-[#0A1020]"
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Accedi</span>
            </Button>
          )}
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => {
          setIsNotificationsOpen(false);
          fetchUnreadCount(); // Refresh count when closing
        }}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminAuthed(true);
          onNavigate('admin');
        }}
      />
    </header>
  );
}
