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
}

interface Auction {
  id: string;
  title: string;
  current_bid: number;
  starting_bid: number;
  end_time: string;
  status: string;
  created_by: string;
  bid_count: number;
}

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
  username?: string;
}

export function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
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

  useEffect(() => {
    fetchAdminData();
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
      // Fetch from server endpoint (create this later)
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
        setUsers(data.users);
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
        setAuctions(data.auctions);
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
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleAdjustBalance = async (userId: string, amount: number) => {
    try {
      const response = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-81e425c4/admin/users/${userId}/adjust-balance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabase.supabaseKey}`,
          },
          body: JSON.stringify({ amount }),
        }
      );

      if (response.ok) {
        toast.success('Balance aggiornato con successo!');
        fetchUsers();
        fetchStats();
      } else {
        toast.error('Errore aggiornamento balance');
      }
    } catch (error) {
      console.error('Error adjusting balance:', error);
      toast.error('Errore aggiornamento balance');
    }
  };

  const handleEndAuction = async (auctionId: string) => {
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
      } else {
        toast.error('Errore chiusura asta');
      }
    } catch (error) {
      console.error('Error ending auction:', error);
      toast.error('Errore chiusura asta');
    }
  };

  const handleDeleteAuction = async (auctionId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa asta?')) return;

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
        toast.success('Asta eliminata con successo!');
        fetchAuctions();
      } else {
        toast.error('Errore eliminazione asta');
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
    auction.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg glow-neon">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl">Admin Dashboard</h1>
            <p className="text-muted-foreground">Pannello di Amministrazione SPORTIUM</p>
          </div>
        </div>
        <Button
          onClick={fetchAdminData}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Aggiorna
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border hexagon-pattern">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Utenti Totali</p>
              <p className="text-2xl mt-1">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border hexagon-pattern">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Aste Attive</p>
              <p className="text-2xl mt-1">{stats.activeAuctions.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Gavel className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border hexagon-pattern">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Transazioni</p>
              <p className="text-2xl mt-1">{stats.totalTransactions.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <Activity className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border hexagon-pattern">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">FP Circolanti</p>
              <p className="text-2xl mt-1">{stats.totalPointsCirculating.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Utenti</TabsTrigger>
          <TabsTrigger value="auctions">Aste</TabsTrigger>
          <TabsTrigger value="transactions">Transazioni</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Economy Stats */}
            <Card className="p-6 bg-card border-border">
              <h3 className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-primary" />
                Economia Fans Points
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guadagnati Totali:</span>
                  <span className="text-primary">{stats.totalPointsEarned.toLocaleString()} FP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spesi Totali:</span>
                  <span className="text-destructive">{stats.totalPointsSpent.toLocaleString()} FP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Circolanti:</span>
                  <span className="text-secondary">{stats.totalPointsCirculating.toLocaleString()} FP</span>
                </div>
              </div>
            </Card>

            {/* System Health */}
            <Card className="p-6 bg-card border-border">
              <h3 className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-secondary" />
                System Health
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Database:</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Server:</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Real-time:</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cerca utente per username o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-border"
            />
          </div>

          {/* Users List */}
          <Card className="bg-card border-border">
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-3">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="p-4 bg-muted/10 border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4>{user.username || 'No username'}</h4>
                          <Badge variant="outline">{user.email}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Balance:</span>
                            <span className="ml-2 text-primary">{user.balance_points?.toLocaleString() || 0} FP</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Earned:</span>
                            <span className="ml-2">{user.total_earned?.toLocaleString() || 0} FP</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Spent:</span>
                            <span className="ml-2">{user.total_spent?.toLocaleString() || 0} FP</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Level:</span>
                            <span className="ml-2">{user.level || 1}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const amount = prompt('Importo da aggiungere (usa - per sottrarre):');
                            if (amount) {
                              handleAdjustBalance(user.id, parseInt(amount));
                            }
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Auctions Tab */}
        <TabsContent value="auctions" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cerca asta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-border"
            />
          </div>

          {/* Auctions List */}
          <Card className="bg-card border-border">
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-3">
                {filteredAuctions.map((auction) => (
                  <Card key={auction.id} className="p-4 bg-muted/10 border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4>{auction.title}</h4>
                          <Badge 
                            variant={auction.status === 'active' ? 'default' : 'secondary'}
                            className={auction.status === 'active' ? 'bg-primary/10 text-primary' : ''}
                          >
                            {auction.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Starting:</span>
                            <span className="ml-2">{auction.starting_bid?.toLocaleString() || 0} FP</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Current:</span>
                            <span className="ml-2 text-primary">{auction.current_bid?.toLocaleString() || 'No bids'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Bids:</span>
                            <span className="ml-2">{auction.bid_count || 0}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Ends:</span>
                            <span className="ml-2">{new Date(auction.end_time).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {auction.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEndAuction(auction.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteAuction(auction.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card className="bg-card border-border">
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-2">
                {transactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'reward' || tx.type === 'purchase' 
                          ? 'bg-primary/10' 
                          : 'bg-destructive/10'
                      }`}>
                        <History className={`w-4 h-4 ${
                          tx.type === 'reward' || tx.type === 'purchase'
                            ? 'text-primary'
                            : 'text-destructive'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.username || tx.user_id} • {new Date(tx.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={tx.amount > 0 ? 'default' : 'destructive'}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} FP
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{tx.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
