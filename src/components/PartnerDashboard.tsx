import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Trophy,
  Gift,
  Brain,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  Award,
  Target,
  Zap,
  Crown,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { HexagonPattern } from './HexagonPattern';
import { useAuth } from '../utils/supabase/AuthContext';

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points_reward: number;
  status: string;
  created_at: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  quantity_available: number;
  quantity_claimed: number;
  status: string;
  created_at: string;
}

interface Auction {
  id: string;
  title: string;
  description: string;
  starting_bid: number;
  current_bid: number;
  status: string;
  end_time: string;
  created_at: string;
}

export function PartnerDashboard() {
  const { user, profile } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Data
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [isCreateRewardOpen, setIsCreateRewardOpen] = useState(false);
  const [isCreateAuctionOpen, setIsCreateAuctionOpen] = useState(false);
  
  // Forms
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    category: 'general',
    difficulty: 'medium',
    points_reward: 100,
    time_limit_seconds: 300,
  });
  
  const [rewardForm, setRewardForm] = useState({
    title: '',
    description: '',
    category: 'merchandise',
    points_cost: 1000,
    quantity_available: 10,
  });

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchQuizzes(),
        fetchRewards(),
        fetchAuctions(),
      ]);
    } catch (error) {
      console.error('Error fetching partner data:', error);
      toast.error('Errore caricamento dati');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const fetchAuctions = async () => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('created_by_partner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuctions(data || []);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  const handleCreateQuiz = async () => {
    if (!quizForm.title) {
      toast.error('Inserisci un titolo per il quiz');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          ...quizForm,
          created_by: user?.id,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Quiz creato! Aggiungi domande per pubblicarlo.');
      setIsCreateQuizOpen(false);
      setQuizForm({
        title: '',
        description: '',
        category: 'general',
        difficulty: 'medium',
        points_reward: 100,
        time_limit_seconds: 300,
      });
      fetchQuizzes();
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      toast.error(`Errore: ${error.message}`);
    }
  };

  const handleCreateReward = async () => {
    if (!rewardForm.title) {
      toast.error('Inserisci un titolo per il premio');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('rewards')
        .insert({
          ...rewardForm,
          created_by: user?.id,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Premio creato con successo!');
      setIsCreateRewardOpen(false);
      setRewardForm({
        title: '',
        description: '',
        category: 'merchandise',
        points_cost: 1000,
        quantity_available: 10,
      });
      fetchRewards();
    } catch (error: any) {
      console.error('Error creating reward:', error);
      toast.error(`Errore: ${error.message}`);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo quiz?')) return;

    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) throw error;

      toast.success('Quiz eliminato');
      fetchQuizzes();
    } catch (error: any) {
      console.error('Error deleting quiz:', error);
      toast.error(`Errore: ${error.message}`);
    }
  };

  const handleDeleteReward = async (rewardId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo premio?')) return;

    try {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', rewardId);

      if (error) throw error;

      toast.success('Premio eliminato');
      fetchRewards();
    } catch (error: any) {
      console.error('Error deleting reward:', error);
      toast.error(`Errore: ${error.message}`);
    }
  };

  const stats = {
    totalQuizzes: quizzes.length,
    publishedQuizzes: quizzes.filter(q => q.status === 'published').length,
    totalRewards: rewards.length,
    activeRewards: rewards.filter(r => r.status === 'active').length,
    totalAuctions: auctions.length,
    activeAuctions: auctions.filter(a => a.status === 'active').length,
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-[#A7FF1A]/10 to-[#00E0FF]/10 border-[#A7FF1A]/30 border-2 overflow-hidden">
        <HexagonPattern />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#A7FF1A]/20 rounded-xl glow-neon">
              <Crown className="w-10 h-10 text-[#A7FF1A]" />
            </div>
            <div>
              <h1 className="text-white mb-1">Partner Dashboard</h1>
              <p className="text-sm text-[#A9AFBC]">{profile?.partner_name || 'Partner'}</p>
            </div>
          </div>
          <Badge className="bg-[#A7FF1A]/10 text-[#A7FF1A] border-[#A7FF1A]/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Partner Verificato
          </Badge>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30 border hexagon-pattern">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A9AFBC]">Quiz</p>
              <p className="text-2xl text-white mt-1">{stats.totalQuizzes}</p>
              <p className="text-xs text-[#A7FF1A] mt-1">{stats.publishedQuizzes} pubblicati</p>
            </div>
            <div className="p-3 bg-[#A7FF1A]/20 rounded-lg">
              <Brain className="w-6 h-6 text-[#A7FF1A]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#00E0FF]/10 to-transparent border-[#00E0FF]/30 border hexagon-pattern">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A9AFBC]">Premi</p>
              <p className="text-2xl text-white mt-1">{stats.totalRewards}</p>
              <p className="text-xs text-[#00E0FF] mt-1">{stats.activeRewards} attivi</p>
            </div>
            <div className="p-3 bg-[#00E0FF]/20 rounded-lg">
              <Gift className="w-6 h-6 text-[#00E0FF]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30 border hexagon-pattern">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A9AFBC]">Aste</p>
              <p className="text-2xl text-white mt-1">{stats.totalAuctions}</p>
              <p className="text-xs text-yellow-400 mt-1">{stats.activeAuctions} attive</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-[#2B2F3A] border border-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quizzes">
            Quiz
            {quizzes.length > 0 && <Badge variant="secondary" className="ml-2">{quizzes.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="rewards">
            Premi
            {rewards.length > 0 && <Badge variant="secondary" className="ml-2">{rewards.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="auctions">
            Aste
            {auctions.length > 0 && <Badge variant="secondary" className="ml-2">{auctions.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6 bg-[#111318] border-white/10">
            <h3 className="text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => setIsCreateQuizOpen(true)}
                className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020] h-20"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crea Quiz
              </Button>
              <Button
                onClick={() => setIsCreateRewardOpen(true)}
                className="bg-[#00E0FF] hover:bg-[#00C8E6] text-[#0A1020] h-20"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crea Premio
              </Button>
              <Button
                onClick={() => setIsCreateAuctionOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-[#0A1020] h-20"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crea Asta
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-[#111318] border-white/10">
            <h3 className="text-white mb-4">Recent Activity</h3>
            <p className="text-sm text-[#A9AFBC]">
              Gestisci i tuoi quiz, premi e aste dalle tab sopra.
            </p>
          </Card>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white">I Tuoi Quiz</h3>
            <Button
              onClick={() => setIsCreateQuizOpen(true)}
              className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Quiz
            </Button>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="p-4 bg-[#111318] border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white">{quiz.title}</h4>
                        <Badge
                          variant={quiz.status === 'published' ? 'default' : 'secondary'}
                          className={quiz.status === 'published' ? 'bg-[#A7FF1A]/10 text-[#A7FF1A]' : ''}
                        >
                          {quiz.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#A9AFBC] mb-2">{quiz.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-[#A9AFBC]">
                          Categoria: <span className="text-white">{quiz.category}</span>
                        </span>
                        <span className="text-[#A9AFBC]">
                          Difficoltà: <span className="text-white">{quiz.difficulty}</span>
                        </span>
                        <span className="text-[#A9AFBC]">
                          Reward: <span className="text-[#A7FF1A]">{quiz.points_reward} FP</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/10">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {quizzes.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-[#A9AFBC] mx-auto mb-4" />
                  <p className="text-[#A9AFBC]">Nessun quiz creato ancora</p>
                  <Button
                    onClick={() => setIsCreateQuizOpen(true)}
                    className="mt-4 bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
                  >
                    Crea il tuo primo quiz
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white">I Tuoi Premi</h3>
            <Button
              onClick={() => setIsCreateRewardOpen(true)}
              className="bg-[#00E0FF] hover:bg-[#00C8E6] text-[#0A1020]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Premio
            </Button>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {rewards.map((reward) => (
                <Card key={reward.id} className="p-4 bg-[#111318] border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white">{reward.title}</h4>
                        <Badge
                          variant={reward.status === 'active' ? 'default' : 'secondary'}
                          className={reward.status === 'active' ? 'bg-[#00E0FF]/10 text-[#00E0FF]' : ''}
                        >
                          {reward.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#A9AFBC] mb-2">{reward.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-[#A9AFBC]">
                          Costo: <span className="text-[#A7FF1A]">{reward.points_cost} FP</span>
                        </span>
                        <span className="text-[#A9AFBC]">
                          Disponibili: <span className="text-white">
                            {reward.quantity_available - reward.quantity_claimed}/{reward.quantity_available}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/10">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteReward(reward.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {rewards.length === 0 && (
                <div className="text-center py-12">
                  <Gift className="w-12 h-12 text-[#A9AFBC] mx-auto mb-4" />
                  <p className="text-[#A9AFBC]">Nessun premio creato ancora</p>
                  <Button
                    onClick={() => setIsCreateRewardOpen(true)}
                    className="mt-4 bg-[#00E0FF] hover:bg-[#00C8E6] text-[#0A1020]"
                  >
                    Crea il tuo primo premio
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Auctions Tab */}
        <TabsContent value="auctions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white">Le Tue Aste</h3>
            <Button
              onClick={() => setIsCreateAuctionOpen(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-[#0A1020]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuova Asta
            </Button>
          </div>

          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-[#A9AFBC] mx-auto mb-4" />
            <p className="text-[#A9AFBC]">Usa la pagina Aste per creare nuove aste</p>
            <p className="text-sm text-[#A9AFBC] mt-2">
              Le aste create appariranno qui per la gestione
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Quiz Modal */}
      <Dialog open={isCreateQuizOpen} onOpenChange={setIsCreateQuizOpen}>
        <DialogContent className="bg-[#111318] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crea Nuovo Quiz</DialogTitle>
            <DialogDescription className="text-[#A9AFBC]">
              Coinvolgi i tuoi fans con un quiz personalizzato
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Titolo *</Label>
              <Input
                id="quiz-title"
                placeholder="Es: Quiz Serie A 2024"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                className="bg-[#2B2F3A] border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-desc">Descrizione</Label>
              <Textarea
                id="quiz-desc"
                placeholder="Descrivi il tuo quiz..."
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                className="bg-[#2B2F3A] border-white/10"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={quizForm.category}
                  onValueChange={(value) => setQuizForm({ ...quizForm, category: value })}
                >
                  <SelectTrigger className="bg-[#2B2F3A] border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Generale</SelectItem>
                    <SelectItem value="football">Calcio</SelectItem>
                    <SelectItem value="team">Squadra</SelectItem>
                    <SelectItem value="history">Storia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficoltà</Label>
                <Select
                  value={quizForm.difficulty}
                  onValueChange={(value) => setQuizForm({ ...quizForm, difficulty: value })}
                >
                  <SelectTrigger className="bg-[#2B2F3A] border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Facile</SelectItem>
                    <SelectItem value="medium">Medio</SelectItem>
                    <SelectItem value="hard">Difficile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-points">Fans Points Reward</Label>
                <Input
                  id="quiz-points"
                  type="number"
                  value={quizForm.points_reward}
                  onChange={(e) => setQuizForm({ ...quizForm, points_reward: parseInt(e.target.value) })}
                  className="bg-[#2B2F3A] border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-time">Tempo Limite (secondi)</Label>
                <Input
                  id="quiz-time"
                  type="number"
                  value={quizForm.time_limit_seconds}
                  onChange={(e) => setQuizForm({ ...quizForm, time_limit_seconds: parseInt(e.target.value) })}
                  className="bg-[#2B2F3A] border-white/10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateQuizOpen(false)} className="border-white/10">
              Annulla
            </Button>
            <Button onClick={handleCreateQuiz} className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]">
              Crea Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Reward Modal */}
      <Dialog open={isCreateRewardOpen} onOpenChange={setIsCreateRewardOpen}>
        <DialogContent className="bg-[#111318] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crea Nuovo Premio</DialogTitle>
            <DialogDescription className="text-[#A9AFBC]">
              Offri premi esclusivi ai tuoi fans più fedeli
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reward-title">Titolo *</Label>
              <Input
                id="reward-title"
                placeholder="Es: Maglia Ufficiale Autografata"
                value={rewardForm.title}
                onChange={(e) => setRewardForm({ ...rewardForm, title: e.target.value })}
                className="bg-[#2B2F3A] border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward-desc">Descrizione</Label>
              <Textarea
                id="reward-desc"
                placeholder="Descrivi il premio..."
                value={rewardForm.description}
                onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                className="bg-[#2B2F3A] border-white/10"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={rewardForm.category}
                  onValueChange={(value) => setRewardForm({ ...rewardForm, category: value })}
                >
                  <SelectTrigger className="bg-[#2B2F3A] border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="merchandise">Merchandise</SelectItem>
                    <SelectItem value="tickets">Biglietti</SelectItem>
                    <SelectItem value="experience">Esperienze</SelectItem>
                    <SelectItem value="vip">VIP Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reward-quantity">Quantità Disponibile</Label>
                <Input
                  id="reward-quantity"
                  type="number"
                  value={rewardForm.quantity_available}
                  onChange={(e) => setRewardForm({ ...rewardForm, quantity_available: parseInt(e.target.value) })}
                  className="bg-[#2B2F3A] border-white/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward-cost">Costo in Fans Points</Label>
              <Input
                id="reward-cost"
                type="number"
                value={rewardForm.points_cost}
                onChange={(e) => setRewardForm({ ...rewardForm, points_cost: parseInt(e.target.value) })}
                className="bg-[#2B2F3A] border-white/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateRewardOpen(false)} className="border-white/10">
              Annulla
            </Button>
            <Button onClick={handleCreateReward} className="bg-[#00E0FF] hover:bg-[#00C8E6] text-[#0A1020]">
              Crea Premio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
