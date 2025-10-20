import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Bell, Trophy, AlertCircle, Gift, X, Check } from "lucide-react";
import { useAuth } from "../utils/supabase/AuthContext";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface Notification {
  id: string;
  user_id: string;
  type: 'won' | 'outbid' | 'auction_ended' | 'reward';
  title: string;
  message: string;
  auction_id?: string;
  read: boolean;
  created_at: string;
  read_at?: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { user, session } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchNotifications = async () => {
    if (!user || !session) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-81e425c4/notifications`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Errore nel caricamento notifiche');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notifId: string) => {
    if (!session) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-81e425c4/notifications/${notifId}/read`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to mark as read');

      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notifId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'won':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'outbid':
        return <AlertCircle className="w-5 h-5 text-orange-400" />;
      case 'reward':
        return <Gift className="w-5 h-5 text-[#A7FF1A]" />;
      default:
        return <Bell className="w-5 h-5 text-[#00E0FF]" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-[#111318] border-l border-white/10 z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-[#A7FF1A]" />
                  <div>
                    <h3 className="text-white">Notifiche</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-[#A9AFBC]">{unreadCount} non lette</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1 p-4">
                {loading ? (
                  <div className="text-center text-[#A9AFBC] py-8">
                    Caricamento...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-[#A9AFBC] mx-auto mb-3 opacity-50" />
                    <p className="text-[#A9AFBC]">Nessuna notifica</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card
                          className={`p-4 cursor-pointer transition-all ${
                            notif.read
                              ? 'bg-[#2B2F3A]/30 border-white/5'
                              : 'bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30'
                          }`}
                          onClick={() => !notif.read && markAsRead(notif.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              notif.type === 'won' ? 'bg-yellow-500/20' :
                              notif.type === 'outbid' ? 'bg-orange-500/20' :
                              notif.type === 'reward' ? 'bg-[#A7FF1A]/20' :
                              'bg-[#00E0FF]/20'
                            }`}>
                              {getIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-white text-sm">{notif.title}</h4>
                                {!notif.read && (
                                  <Badge className="bg-[#A7FF1A]/20 text-[#A7FF1A] border-0 text-xs px-2 py-0">
                                    NEW
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-[#A9AFBC] mb-2">{notif.message}</p>
                              <div className="text-xs text-[#A9AFBC]/70">
                                {new Date(notif.created_at).toLocaleString('it-IT', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
