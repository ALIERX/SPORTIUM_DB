import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Wallet, 
  Award,
  Activity,
  Search,
  Ban,
  Edit,
  Trash2,
  RefreshCw,
  DollarSign,
  Gavel,
  History,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Target,
  Zap,
  Gift,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  UserX,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { HexagonPattern } from './HexagonPattern';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalAuctions: number;
  activeAuctions: number;
  totalTransactions: number;
  totalPointsCirculating: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
}

interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  balance_points: number;
  total_earned: number;
  total_spent: number;
  level?: number;
  xp?: number;
  is_banned?: boolean;
}

interface Auction {
  id: string;
  title: string;
  description: string;
  current_bid: number;
  starting_bid: number;
  end_time: string;
  status: string;
  created_by: string;
  bid_count: number;
  image_url?: string;
}

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
  username?: string;
  email?: string;
}

export function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalAuctions: 0,
    activeAuctions: 0,
    totalTransactions: 0,
    totalPointsCirculating: 0,
    totalPointsEarned: 0,
    totalPointsSpent: 0,
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Dialogs
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceReason, setBalanceReason] = useState('');

  useEffect(() => {
    fetchAdminData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchAuctions(),
        fetchTransactions(),
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Errore caricamento dati admin');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-81e425c4/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${supabase.supabaseKey}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        console.error('Stats fetch failed:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-81e425c4/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${supabase.supabaseKey}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Users fetch failed:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAuctions = async () => {
    try {
      const response = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-81e425c4/admin/auctions`,
        {
          headers: {
            Authorization: `Bearer ${supabase.supabaseKey}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAuctions(data.auctions || []);
      } else {
        console.error('Auctions fetch failed:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-81e425c4/admin/transactions?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${supabase.supabaseKey}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      } else {
        console.error('Transactions fetch failed:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleOpenBalanceDialog = (user: User) => {
    setSelectedUser(user);
    setBalanceAmount('');
    setBalanceReason('');
    setIsBalanceDialogOpen(true);
  };

  const handleAdjustBalance = async () => {
    if (!selectedUser || !balanceAmount) {
      toast.error('Inserisci un importo valido');
      return;
    }

    const amount = parseInt(balanceAmount);
    if (isNaN(amount) || amount === 0) {
      toast.error('Importo non valido');
      return;
    }

    try {
      const response = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-81e425c4/admin/users/${selectedUser.id}/adjust-balance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabase.supabaseKey}`,
          },
          body: JSON.stringify({ 
            amount,
            reason: balanceReason || 'Admin adjustment'
          }),
        }
      );

      if (response.ok) {
        toast.success(`Balance aggiornato: ${amount > 0 ? '+' : ''}${amount.toLocaleString()} FP`);
        setIsBalanceDialogOpen(false);
        fetchUsers();
        fetchStats();
      } else {
        const error = await response.text();
        toast.error(`Errore: ${error}`);
      }
    } catch (error) {
      console.error('Error adjusting balance:', error);
      toast.error('Errore aggiornamento balance');
    }
  };

  const handleBanUser = async (userId: string, currentlyBanned: boolean) => {
    const action = currentlyBanned ? 'sbannare' : 'bannare';
    if (!confirm(`Sei sicuro di voler ${action} questo utente?`)) return;

    try {
      const response = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-81e425c4/admin/users/${userId}/ban`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabase.supabaseKey}`,
          },
          body: JSON.stringify({ banned: !currentlyBanned }),
        }
      );

      if (response.ok) {
        toast.success(`Utente ${action}to con successo!`);
        fetchUsers();
      } else {
        toast.error(`Errore ${action}ndo utente`);
      }
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error(`Errore ${action}ndo utente`);
    }
  };

  const handleEndAuction = async (auctionId: string) => {
    if (!confirm('Sei sicuro di voler chiudere questa asta anticipatamente?')) return;

    try {
      const response = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-81e425c4/admin/auctions/${auctionId}/end`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${supabase.supabaseKey}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Asta chiusa con successo!');
        fetchAuctions();
        fetchStats();
      } else {
        const error = await response.text();
        toast.error(`Errore: ${error}`);
      }
    } catch (error) {
      console.error('Error ending auction:', error);
      toast.error('Errore chiusura asta');
    }
  };

  const handleDeleteAuction = async (auctionId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa asta? I bid verranno rimborsati automaticamente.')) return;

    try {
      const response = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-81e425c4/admin/auctions/${auctionId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${supabase.supabaseKey}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Asta eliminata e bid rimborsati!');
        fetchAuctions();
        fetchStats();
      } else {
        const error = await response.text();
        toast.error(`Errore: ${error}`);
      }
    } catch (error) {
      console.error('Error deleting auction:', error);
      toast.error('Errore eliminazione asta');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAuctions = auctions.filter(auction =>
    auction.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    auction.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTransactions = transactions.filter(tx =>
    tx.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-[#A7FF1A]/10 to-[#00E0FF]/10 border-[#A7FF1A]/30 border-2 overflow-hidden">
        <HexagonPattern />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#A7FF1A]/20 rounded-xl glow-neon">
              <Shield className="w-10 h-10 text-[#A7FF1A]" />
            </div>
            <div>
              <h1 className="text-white mb-1">Admin Dashboard</h1>
              <p className="text-sm text-[#A9AFBC]">Pannello di Amministrazione SPORTIUM</p>
            </div>
          </div>
          <Button
            onClick={fetchAdminData}
            className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020] gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30 border hexagon-pattern">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A9AFBC]">Utenti Totali</p>
              <p className="text-2xl text-white mt-1">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-[#A7FF1A] mt-1">↑ {stats.activeUsers} attivi</p>
            </div>
            <div className="p-3 bg-[#A7FF1A]/20 rounded-lg">
              <Users className="w-6 h-6 text-[#A7FF1A]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#00E0FF]/10 to-transparent border-[#00E0FF]/30 border hexagon-pattern">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A9AFBC]">Aste</p>
              <p className="text-2xl text-white mt-1">{stats.totalAuctions.toLocaleString()}</p>
              <p className="text-xs text-[#00E0FF] mt-1">{stats.activeAuctions} attive</p>
            </div>
            <div className="p-3 bg-[#00E0FF]/20 rounded-lg">
              <Gavel className="w-6 h-6 text-[#00E0FF]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30 border hexagon-pattern">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A9AFBC]">Transazioni</p>
              <p className="text-2xl text-white mt-1">{stats.totalTransactions.toLocaleString()}</p>
              <p className="text-xs text-yellow-400 mt-1">Totali</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30 border hexagon-pattern">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A9AFBC]">FP Circolanti</p>
              <p className="text-2xl text-white mt-1">{(stats.totalPointsCirculating / 1000).toFixed(0)}k</p>
              <p className="text-xs text-purple-400 mt-1">Fans Points</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-[#2B2F3A] border border-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">
            Utenti
            {users.length > 0 && <Badge variant="secondary" className="ml-2">{users.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="auctions">
            Aste
            {auctions.length > 0 && <Badge variant="secondary" className="ml-2">{auctions.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="transactions">
            Transazioni
            {transactions.length > 0 && <Badge variant="secondary" className="ml-2">{transactions.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Economy Stats */}
            <Card className="p-6 bg-[#111318] border-white/10">
              <h3 className="flex items-center gap-2 text-white mb-4">
                <DollarSign className="w-5 h-5 text-[#A7FF1A]" />
                Economia Fans Points
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A9AFBC]">Guadagnati:</span>
                  <div className="flex items-center gap-1">
                    <ArrowUpCircle className="w-4 h-4 text-[#A7FF1A]" />
                    <span className="text-[#A7FF1A]">{stats.totalPointsEarned.toLocaleString()} FP</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A9AFBC]">Spesi:</span>
                  <div className="flex items-center gap-1">
                    <ArrowDownCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">{stats.totalPointsSpent.toLocaleString()} FP</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">Circolanti:</span>
                    <span className="text-[#00E0FF]">{stats.totalPointsCirculating.toLocaleString()} FP</span>
                  </div>
                </div>
                <div className="text-xs text-[#A9AFBC] mt-2">
                  Ratio: {stats.totalPointsEarned > 0 ? ((stats.totalPointsSpent / stats.totalPointsEarned) * 100).toFixed(1) : 0}% spesi
                </div>
              </div>
            </Card>

            {/* System Health */}
            <Card className="p-6 bg-[#111318] border-white/10">
              <h3 className="flex items-center gap-2 text-white mb-4">
                <Activity className="w-5 h-5 text-[#00E0FF]" />
                System Health
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#A9AFBC]">Database:</span>
                  <Badge variant="outline" className="bg-[#A7FF1A]/10 text-[#A7FF1A] border-[#A7FF1A]/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#A9AFBC]">API Server:</span>
                  <Badge variant="outline" className="bg-[#A7FF1A]/10 text-[#A7FF1A] border-[#A7FF1A]/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#A9AFBC]">Real-time:</span>
                  <Badge variant="outline" className="bg-[#A7FF1A]/10 text-[#A7FF1A] border-[#A7FF1A]/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#A9AFBC]">Last Update:</span>
                  <span className="text-xs text-[#00E0FF]">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-[#111318] border-white/10">
              <h3 className="flex items-center gap-2 text-white mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A9AFBC]">Avg. Balance:</span>
                  <span className="text-white">
                    {stats.totalUsers > 0 
                      ? (stats.totalPointsCirculating / stats.totalUsers).toFixed(0) 
                      : 0} FP
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A9AFBC]">Avg. Spent:</span>
                  <span className="text-white">
                    {stats.totalUsers > 0 
                      ? (stats.totalPointsSpent / stats.totalUsers).toFixed(0) 
                      : 0} FP
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A9AFBC]">Avg. per Tx:</span>
                  <span className="text-white">
                    {stats.totalTransactions > 0 
                      ? ((stats.totalPointsEarned + stats.totalPointsSpent) / stats.totalTransactions).toFixed(0) 
                      : 0} FP
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A9AFBC]">Active Rate:</span>
                  <span className="text-[#A7FF1A]">
                    {stats.totalUsers > 0 
                      ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6 bg-[#111318] border-white/10">
            <h3 className="flex items-center gap-2 text-white mb-4">
              <History className="w-5 h-5 text-[#00E0FF]" />
              Recent Activity
            </h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {transactions.slice(0, 10).map((tx) => (
                  <div 
                    key={tx.id} 
                    className="flex items-center justify-between p-3 bg-[#2B2F3A] rounded-lg border border-white/5"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'reward' || tx.type === 'purchase' 
                          ? 'bg-[#A7FF1A]/10' 
                          : 'bg-red-500/10'
                      }`}>
                        <History className={`w-4 h-4 ${
                          tx.type === 'reward' || tx.type === 'purchase'
                            ? 'text-[#A7FF1A]'
                            : 'text-red-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{tx.description}</p>
                        <p className="text-xs text-[#A9AFBC]">
                          {tx.username || tx.email || 'User'} • {new Date(tx.created_at).toLocaleString('it-IT', { 
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={tx.amount > 0 ? 'default' : 'destructive'} className="ml-2">
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} FP
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9AFBC]" />
            <Input
              placeholder="Cerca utente per username o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2B2F3A] border-white/10 text-white"
            />
          </div>

          {/* Users List */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="p-4 bg-[#111318] border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="text-white truncate">{user.username || 'No username'}</h4>
                        <Badge variant="outline" className="text-xs">{user.email}</Badge>
                        {user.is_banned && (
                          <Badge variant="destructive" className="text-xs">
                            <Ban className="w-3 h-3 mr-1" />
                            Banned
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-[#A9AFBC]">Balance:</span>
                          <span className="ml-2 text-[#A7FF1A]">{user.balance_points?.toLocaleString() || 0} FP</span>
                        </div>
                        <div>
                          <span className="text-[#A9AFBC]">Earned:</span>
                          <span className="ml-2 text-white">{user.total_earned?.toLocaleString() || 0} FP</span>
                        </div>
                        <div>
                          <span className="text-[#A9AFBC]">Spent:</span>
                          <span className="ml-2 text-white">{user.total_spent?.toLocaleString() || 0} FP</span>
                        </div>
                        <div>
                          <span className="text-[#A9AFBC]">Level:</span>
                          <span className="ml-2 text-white">{user.level || 1}</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#A9AFBC] mt-2">
                        Joined: {new Date(user.created_at).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenBalanceDialog(user)}
                        className="border-white/10 text-white hover:bg-white/10"
                        title="Adjust Balance"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={user.is_banned ? 'default' : 'destructive'}
                        onClick={() => handleBanUser(user.id, user.is_banned || false)}
                        title={user.is_banned ? 'Unban User' : 'Ban User'}
                      >
                        {user.is_banned ? (
                          <UserCheck className="w-4 h-4" />
                        ) : (
                          <UserX className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Auctions Tab */}
        <TabsContent value="auctions" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9AFBC]" />
            <Input
              placeholder="Cerca asta per titolo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2B2F3A] border-white/10 text-white"
            />
          </div>

          {/* Auctions List */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredAuctions.map((auction) => (
                <Card key={auction.id} className="p-4 bg-[#111318] border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="text-white truncate">{auction.title}</h4>
                        <Badge 
                          variant={auction.status === 'active' ? 'default' : 'secondary'}
                          className={auction.status === 'active' ? 'bg-[#A7FF1A]/10 text-[#A7FF1A] border-[#A7FF1A]/20' : ''}
                        >
                          {auction.status}
                        </Badge>
                        {auction.status === 'active' && new Date(auction.end_time) < new Date() && (
                          <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/30">
                            <Clock className="w-3 h-3 mr-1" />
                            Expired
                          </Badge>
                        )}
                      </div>
                      {auction.description && (
                        <p className="text-sm text-[#A9AFBC] mb-2 line-clamp-2">{auction.description}</p>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-[#A9AFBC]">Starting:</span>
                          <span className="ml-2 text-white">{auction.starting_bid?.toLocaleString() || 0} FP</span>
                        </div>
                        <div>
                          <span className="text-[#A9AFBC]">Current:</span>
                          <span className="ml-2 text-[#A7FF1A]">
                            {auction.current_bid ? `${auction.current_bid.toLocaleString()} FP` : 'No bids'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#A9AFBC]">Bids:</span>
                          <span className="ml-2 text-white">{auction.bid_count || 0}</span>
                        </div>
                        <div>
                          <span className="text-[#A9AFBC]">Ends:</span>
                          <span className="ml-2 text-white">
                            {new Date(auction.end_time).toLocaleDateString('it-IT', { 
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {auction.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEndAuction(auction.id)}
                          className="border-white/10 text-white hover:bg-white/10"
                          title="End Auction"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAuction(auction.id)}
                        title="Delete & Refund"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9AFBC]" />
            <Input
              placeholder="Cerca transazione..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2B2F3A] border-white/10 text-white"
            />
          </div>

          {/* Transactions List */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {filteredTransactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between p-3 bg-[#111318] rounded-lg border border-white/5"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      tx.type === 'reward' || tx.type === 'purchase' 
                        ? 'bg-[#A7FF1A]/10' 
                        : tx.type === 'bid'
                        ? 'bg-[#00E0FF]/10'
                        : 'bg-red-500/10'
                    }`}>
                      <History className={`w-4 h-4 ${
                        tx.type === 'reward' || tx.type === 'purchase'
                          ? 'text-[#A7FF1A]'
                          : tx.type === 'bid'
                          ? 'text-[#00E0FF]'
                          : 'text-red-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{tx.description}</p>
                      <p className="text-xs text-[#A9AFBC]">
                        {tx.username || tx.email || 'User'} • {new Date(tx.created_at).toLocaleString('it-IT', { 
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <Badge 
                      variant={tx.amount > 0 ? 'default' : 'destructive'}
                      className={tx.amount > 0 ? 'bg-[#A7FF1A]/10 text-[#A7FF1A]' : ''}
                    >
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} FP
                    </Badge>
                    <p className="text-xs text-[#A9AFBC] mt-1">{tx.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Adjust Balance Dialog */}
      <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
        <DialogContent className="bg-[#111318] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Adjust User Balance</DialogTitle>
            <DialogDescription className="text-[#A9AFBC]">
              Modify {selectedUser?.username || 'user'}'s Fans Points balance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="balance-amount" className="text-white">Amount</Label>
              <Input
                id="balance-amount"
                type="number"
                placeholder="Enter amount (use - to subtract)"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className="bg-[#2B2F3A] border-white/10 text-white"
              />
              <p className="text-xs text-[#A9AFBC]">
                Current balance: {selectedUser?.balance_points?.toLocaleString() || 0} FP
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance-reason" className="text-white">Reason (optional)</Label>
              <Input
                id="balance-reason"
                placeholder="e.g., Compensation, Adjustment, etc."
                value={balanceReason}
                onChange={(e) => setBalanceReason(e.target.value)}
                className="bg-[#2B2F3A] border-white/10 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBalanceDialogOpen(false)}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdjustBalance}
              className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
