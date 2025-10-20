import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CreateAuctionModal } from "./CreateAuctionModal";
import { PartnerRequestModal } from "./PartnerRequestModal";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { 
  Wallet, 
  Trophy, 
  Brain, 
  TrendingUp, 
  Settings, 
  Award, 
  CreditCard,
  Shield,
  Users,
  BarChart3,
  Activity,
  Target,
  Zap,
  Calendar,
  Clock,
  Plus,
  ChevronRight,
  Sparkles,
  Gift,
  Crown,
  CircleDollarSign,
  LogOut,
  LogIn,
  UserPlus,
  Building2,
  ExternalLink
} from "lucide-react";
import { HexagonPattern } from "./HexagonPattern";
import { HeroBanner } from "./HeroBanner";
import { useAuth } from "../utils/supabase/AuthContext";
import { toast } from "sonner@2.0.3";

export function ProfilePage({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { user, profile, wallet, loading, signIn, signUp, signOut, refreshProfile } = useAuth();
  const [viewMode, setViewMode] = useState<"user" | "admin">("user");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isCreateAuctionOpen, setIsCreateAuctionOpen] = useState(false);
  const [isPartnerRequestOpen, setIsPartnerRequestOpen] = useState(false);
  
  // Auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await signIn(email, password);
    setAuthLoading(false);
    
    if (error) {
      toast.error(`Login failed: ${error.message}`);
    } else {
      toast.success("Welcome back!");
      setEmail("");
      setPassword("");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || !username) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    
    setAuthLoading(true);
    const { error } = await signUp(email, password, username);
    setAuthLoading(false);
    
    if (error) {
      const errorMessage = error.message;
      
      // Provide helpful error messages
      if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
        toast.error("This email is already registered. Try signing in instead.");
      } else if (errorMessage.includes('invalid email')) {
        toast.error("Please enter a valid email address");
      } else if (errorMessage.includes('password')) {
        toast.error("Password must be at least 6 characters");
      } else {
        toast.error(`Signup failed: ${errorMessage}`);
      }
    } else {
      toast.success("🎉 Account created! Welcome to SPORTIUM!");
      setEmail("");
      setPassword("");
      setUsername("");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  // Get username from profile, user metadata, or email
  const getUsername = () => {
    // 1. Try profile username
    if (profile?.username) return profile.username;
    
    // 2. Try user metadata (for users created during signup)
    if (user?.user_metadata?.username) return user.user_metadata.username;
    
    // 3. Fallback to email prefix
    if (user?.email) return user.email.split('@')[0];
    
    // 4. Last resort fallback
    return "CalcioFan";
  };

  // Mock data for demo when not authenticated
  const userStats = {
    username: getUsername(),
    level: 28,
    xp: 7450,
    xpToNextLevel: 10000,
    totalPoints: wallet?.balance_points || 18450,
    quizzesCompleted: 156,
    predictionsWin: 89,
    predictionsTotal: 234,
    winRate: 38,
  };
  
  const transactions = [
    { id: 1, type: "purchase", amount: 1050, price: 8.09, date: "2024-10-06", status: "succeeded" },
    { id: 2, type: "reward", amount: 500, date: "2024-10-05", status: "succeeded" },
    { id: 3, type: "purchase", amount: 500, price: 4.04, date: "2024-10-03", status: "succeeded" },
  ];
  
  const achievements = [
    { id: 1, title: "Prima Vittoria", icon: Trophy, unlocked: true },
    { id: 2, title: "Quiz Master", icon: Brain, unlocked: true },
    { id: 3, title: "Pronosticatore", icon: TrendingUp, unlocked: false },
    { id: 4, title: "Leggenda", icon: Award, unlocked: false },
  ];

  // Admin Dashboard Data
  const adminStats = {
    totalUsers: 24567,
    activeUsers: 18234,
    totalFPSpent: 8945620,
    totalFPPurchased: 12340500,
    conversionRate: 74,
    avgSessionTime: "24m 15s",
    dailyActiveUsers: 12456,
    monthlyRevenue: 45678.90
  };

  const topSpenders = [
    { id: 1, username: "TifosoNero_92", spent: 125000, activities: "Aste, Quiz, Premi", avatar: "TN" },
    { id: 2, username: "InterFan_Forever", spent: 98500, activities: "Aste, Squad Builder", avatar: "IF" },
    { id: 3, username: "MilanLegend", spent: 87200, activities: "Spin Wheel, Battle Pass", avatar: "ML" },
    { id: 4, username: "JuveCollector", spent: 76300, activities: "Aste, Rewards", avatar: "JC" },
    { id: 5, username: "RomaFanatic", spent: 65800, activities: "Quiz, Challenges", avatar: "RF" },
  ];

  const activityBreakdown = [
    { category: "Aste", spent: 3245000, users: 4567, percentage: 36 },
    { category: "Premi", spent: 2180000, users: 8934, percentage: 24 },
    { category: "Quiz", spent: 1560000, users: 12456, percentage: 17 },
    { category: "Spin Wheel", spent: 980000, users: 6789, percentage: 11 },
    { category: "Battle Pass", spent: 650000, users: 3245, percentage: 7 },
    { category: "Altri", spent: 330620, users: 2134, percentage: 5 },
  ];

  const recentActivities = [
    { id: 1, type: "auction", user: "TifosoNero_92", action: "Vinto asta Maglia Inter", amount: 12000, time: "2 min fa" },
    { id: 2, type: "quiz", user: "InterFan_Forever", action: "Completato Quiz Serie A", amount: 500, time: "5 min fa" },
    { id: 3, type: "reward", user: "MilanLegend", action: "Riscattato Biglietti VIP", amount: 8000, time: "12 min fa" },
    { id: 4, type: "purchase", user: "JuveCollector", action: "Acquistato 5000 FP", amount: 5000, time: "18 min fa" },
    { id: 5, type: "challenge", user: "RomaFanatic", action: "Daily Challenge completata", amount: 250, time: "25 min fa" },
  ];

  const contentStats = [
    { type: "Aste Attive", count: 24, icon: Target, color: "text-[#A7FF1A]", bg: "bg-[#A7FF1A]/10" },
    { type: "Quiz Pubblicati", count: 156, icon: Brain, color: "text-[#00E0FF]", bg: "bg-[#00E0FF]/10" },
    { type: "Challenges Attive", count: 48, icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { type: "Premi Disponibili", count: 89, icon: Gift, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  // Show auth screen if not logged in
  if (!user) {
    return (
      <div className="space-y-6 pb-24 md:pb-8">
        <HeroBanner
          imageUrl="https://images.unsplash.com/photo-1708577907839-1240466aee53?w=1200"
          title="Il Tuo Profilo"
          subtitle="Accedi o registrati per gestire il tuo account"
          badge="SPORTIUM"
          height="small"
        />

        <div className="max-w-md mx-auto">
          <Card className="p-6 bg-gradient-to-br from-[#111318] via-[#111318] to-[#2B2F3A] border-white/10 overflow-hidden">
            <HexagonPattern />
            <div className="relative space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#A7FF1A]/20 flex items-center justify-center mx-auto mb-4">
                  {authMode === "signin" ? (
                    <LogIn className="w-8 h-8 text-[#A7FF1A]" />
                  ) : (
                    <UserPlus className="w-8 h-8 text-[#A7FF1A]" />
                  )}
                </div>
                <h2 className="text-white mb-2">
                  {authMode === "signin" ? "Accedi a SPORTIUM" : "Crea il tuo Account"}
                </h2>
                <p className="text-sm text-[#A9AFBC]">
                  {authMode === "signin" 
                    ? "Bentornato! Accedi per continuare" 
                    : "Unisciti alla community SPORTIUM"
                  }
                </p>
              </div>

              <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#2B2F3A]">
                  <TabsTrigger value="signin">Accedi</TabsTrigger>
                  <TabsTrigger value="signup">Registrati</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tuo@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-[#2B2F3A] border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-[#2B2F3A] border-white/10 text-white"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
                      disabled={authLoading}
                    >
                      {authLoading ? "Accesso in corso..." : "Accedi"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  {/* Warning Banner for Trigger Issue */}
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="text-yellow-500 mt-0.5">⚠️</div>
                      <div className="text-xs text-white/90">
                        <strong>Se signup fallisce:</strong> potrebbe esserci un trigger di database che interferisce. Apri Debug Panel (basso-destra) → Help
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="TuoUsername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="bg-[#2B2F3A] border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="tuo@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-[#2B2F3A] border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="bg-[#2B2F3A] border-white/10 text-white"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
                      disabled={authLoading}
                    >
                      {authLoading ? "Registrazione..." : "Crea Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-center text-[#A9AFBC]">
                  Creando un account accetti i nostri Termini di Servizio e Privacy Policy
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Mode Switch */}
      <Card className="p-4 bg-gradient-to-r from-[#A7FF1A]/10 to-[#00E0FF]/10 border-[#A7FF1A]/30 border-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              viewMode === "admin" ? "bg-[#A7FF1A]/20" : "bg-[#00E0FF]/20"
            }`}>
              {viewMode === "admin" ? (
                <Shield className="w-6 h-6 text-[#A7FF1A]" />
              ) : (
                <Users className="w-6 h-6 text-[#00E0FF]" />
              )}
            </div>
            <div>
              <h3 className="text-white">
                {viewMode === "admin" ? "Team Admin Dashboard" : "Profilo Utente"}
              </h3>
              <p className="text-sm text-[#A9AFBC]">
                {viewMode === "admin" 
                  ? "Gestisci contenuti e visualizza analytics" 
                  : "Le tue statistiche e achievements"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Label htmlFor="viewMode" className="text-white">Admin</Label>
              <Switch
                id="viewMode"
                checked={viewMode === "admin"}
                onCheckedChange={(checked) => setViewMode(checked ? "admin" : "user")}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Esci
            </Button>
          </div>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {viewMode === "user" ? (
          <motion.div
            key="user"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <HeroBanner
              imageUrl="https://images.unsplash.com/photo-1708577907839-1240466aee53?w=1200"
              title="Il Tuo Profilo"
              subtitle="Gestisci il tuo account, visualizza le tue statistiche e i premi"
              badge={`LIVELLO ${userStats.level}`}
              height="small"
            />
            
            {/* User Profile Content */}
            <Card className="bg-gradient-to-br from-[#111318] via-[#111318] to-[#2B2F3A] border-white/10 overflow-hidden">
              <HexagonPattern />
              <div className="relative p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 border-2 border-[#A7FF1A]">
                      <AvatarFallback className="bg-gradient-to-br from-[#A7FF1A] to-[#00E0FF] text-[#0A1020] text-2xl">
                        {userStats.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-white mb-1">{userStats.username}</h2>
                      <p className="text-sm text-[#A9AFBC] mb-2">{user.email}</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#A7FF1A]/20 text-[#A7FF1A] border-[#A7FF1A]/30 border">
                          Livello {userStats.level}
                        </Badge>
                        <Badge className="bg-[#00E0FF]/20 text-[#00E0FF] border-[#00E0FF]/30 border">
                          {userStats.totalPoints.toLocaleString()} FP
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/10 text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Impostazioni
                  </Button>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#A9AFBC]">Progressione Livello</span>
                    <span className="text-sm text-white">{userStats.xp} / {userStats.xpToNextLevel} XP</span>
                  </div>
                  <Progress value={(userStats.xp / userStats.xpToNextLevel) * 100} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Partner Section */}
            {profile?.role === 'partner' || profile?.role === 'admin' ? (
              <Card className="p-6 bg-gradient-to-r from-[#A7FF1A]/10 to-[#00E0FF]/10 border-[#A7FF1A]/30 border-2 overflow-hidden">
                <HexagonPattern />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#A7FF1A]/20 rounded-lg glow-neon">
                      <Crown className="w-8 h-8 text-[#A7FF1A]" />
                    </div>
                    <div>
                      <h3 className="text-white mb-1">Partner Dashboard</h3>
                      <p className="text-sm text-[#A9AFBC]">
                        {profile?.partner_name || 'Partner Verificato'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate?.('partner')}
                    className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
                  >
                    Apri Dashboard
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ) : profile?.partner_request_status === 'pending' ? (
              <Card className="p-6 bg-yellow-500/10 border-yellow-500/30 border overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <Clock className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-white mb-1">Richiesta Partner in Corso</h3>
                      <p className="text-sm text-[#A9AFBC]">
                        La tua richiesta è in fase di revisione
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                    In Attesa
                  </Badge>
                </div>
              </Card>
            ) : (
              <Card className="p-6 bg-[#111318] border-white/10 overflow-hidden">
                <HexagonPattern />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#00E0FF]/20 rounded-lg">
                      <Building2 className="w-8 h-8 text-[#00E0FF]" />
                    </div>
                    <div>
                      <h3 className="text-white mb-1">Diventa Partner</h3>
                      <p className="text-sm text-[#A9AFBC]">
                        Crea quiz, aste e premi per i tuoi fans
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsPartnerRequestOpen(true)}
                    className="bg-[#00E0FF] hover:bg-[#00C8E6] text-[#0A1020]"
                  >
                    Richiedi Accesso
                  </Button>
                </div>
              </Card>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-[#111318] border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#A7FF1A]/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-[#A7FF1A]" />
                  </div>
                  <div>
                    <div className="text-2xl text-white">{userStats.totalPoints.toLocaleString()}</div>
                    <div className="text-xs text-[#A9AFBC]">Fans Points</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-[#111318] border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00E0FF]/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#00E0FF]" />
                  </div>
                  <div>
                    <div className="text-2xl text-white">{userStats.quizzesCompleted}</div>
                    <div className="text-xs text-[#A9AFBC]">Quiz Completati</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-[#111318] border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl text-white">{userStats.predictionsWin}</div>
                    <div className="text-xs text-[#A9AFBC]">Pronostici Vinti</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-[#111318] border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl text-white">{userStats.winRate}%</div>
                    <div className="text-xs text-[#A9AFBC]">Win Rate</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="achievements" className="space-y-6">
              <TabsList className="bg-[#2B2F3A] border-white/10">
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="transactions">Transazioni</TabsTrigger>
              </TabsList>

              <TabsContent value="achievements" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <Card
                        key={achievement.id}
                        className={`p-6 text-center ${
                          achievement.unlocked
                            ? "bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30"
                            : "bg-[#111318] border-white/10 opacity-50"
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                          achievement.unlocked ? "bg-[#A7FF1A]/20" : "bg-white/10"
                        }`}>
                          <Icon className={`w-8 h-8 ${achievement.unlocked ? "text-[#A7FF1A]" : "text-[#A9AFBC]"}`} />
                        </div>
                        <h4 className="text-white text-sm">{achievement.title}</h4>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-3">
                {transactions.map((tx) => (
                  <Card key={tx.id} className="p-4 bg-[#111318] border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === "purchase" ? "bg-[#A7FF1A]/20" : "bg-[#00E0FF]/20"
                        }`}>
                          {tx.type === "purchase" ? (
                            <CreditCard className="w-5 h-5 text-[#A7FF1A]" />
                          ) : (
                            <Award className="w-5 h-5 text-[#00E0FF]" />
                          )}
                        </div>
                        <div>
                          <div className="text-white">{tx.type === "purchase" ? "Acquisto" : "Premio"}</div>
                          <div className="text-xs text-[#A9AFBC]">{tx.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#A7FF1A]">+{tx.amount.toLocaleString()} FP</div>
                        {tx.price && <div className="text-xs text-[#A9AFBC]">€{tx.price}</div>}
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <HeroBanner
              imageUrl="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1200"
              title="Team Admin Dashboard"
              subtitle="Gestisci contenuti, monitora analytics e amministra la piattaforma"
              badge="ADMIN PANEL"
              height="small"
            />

            {/* Admin Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30 border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#A7FF1A]/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#A7FF1A]" />
                  </div>
                  <div>
                    <div className="text-2xl text-white">{adminStats.totalUsers.toLocaleString()}</div>
                    <div className="text-xs text-[#A9AFBC]">Utenti Totali</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-[#00E0FF]/10 to-transparent border-[#00E0FF]/30 border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00E0FF]/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#00E0FF]" />
                  </div>
                  <div>
                    <div className="text-2xl text-white">{adminStats.activeUsers.toLocaleString()}</div>
                    <div className="text-xs text-[#A9AFBC]">Utenti Attivi</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30 border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <CircleDollarSign className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl text-white">{(adminStats.totalFPSpent / 1000000).toFixed(1)}M</div>
                    <div className="text-xs text-[#A9AFBC]">FP Spesi</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30 border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl text-white">{adminStats.conversionRate}%</div>
                    <div className="text-xs text-[#A9AFBC]">Conversion</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Content Stats */}
            <Card className="p-6 bg-[#111318] border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white">Contenuti Pubblicati</h3>
                <Button className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]">
                  <Plus className="w-4 h-4 mr-2" />
                  Crea Nuovo
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {contentStats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className={`p-4 rounded-lg ${stat.bg} border border-white/10`}>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-8 h-8 ${stat.color}`} />
                        <div>
                          <div className={`text-2xl ${stat.color}`}>{stat.count}</div>
                          <div className="text-xs text-[#A9AFBC]">{stat.type}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Activity Breakdown */}
            <Card className="p-6 bg-[#111318] border-white/10">
              <h3 className="text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#A7FF1A]" />
                FP Spesi per Categoria
              </h3>
              <div className="space-y-4">
                {activityBreakdown.map((activity, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#A7FF1A]/20 flex items-center justify-center text-[#A7FF1A] text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-white">{activity.category}</div>
                          <div className="text-xs text-[#A9AFBC]">{activity.users.toLocaleString()} utenti</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#A7FF1A]">{activity.spent.toLocaleString()} FP</div>
                        <div className="text-xs text-[#A9AFBC]">{activity.percentage}%</div>
                      </div>
                    </div>
                    <Progress value={activity.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Spenders */}
              <Card className="p-6 bg-[#111318] border-white/10">
                <h3 className="text-white mb-6 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  Top 5 Utenti per FP Spesi
                </h3>
                <div className="space-y-4">
                  {topSpenders.map((spender, idx) => (
                    <motion.div
                      key={spender.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-[#A7FF1A]/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          idx === 0 ? "bg-yellow-500/20 text-yellow-400" :
                          idx === 1 ? "bg-gray-400/20 text-gray-300" :
                          idx === 2 ? "bg-orange-500/20 text-orange-400" :
                          "bg-[#A7FF1A]/20 text-[#A7FF1A]"
                        }`}>
                          {idx + 1}
                        </div>
                        <Avatar className="w-10 h-10 border-2 border-[#A7FF1A]/30">
                          <AvatarFallback className="bg-gradient-to-br from-[#A7FF1A]/20 to-[#00E0FF]/20 text-white text-xs">
                            {spender.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white text-sm">{spender.username}</div>
                          <div className="text-xs text-[#A9AFBC]">{spender.activities}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#A7FF1A]">{spender.spent.toLocaleString()}</div>
                        <div className="text-xs text-[#A9AFBC]">FP</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Recent Activities */}
              <Card className="p-6 bg-[#111318] border-white/10">
                <h3 className="text-white mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#00E0FF]" />
                  Attività Recenti
                </h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, idx) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${
                              activity.type === "auction" ? "bg-[#A7FF1A]/20 text-[#A7FF1A]" :
                              activity.type === "quiz" ? "bg-[#00E0FF]/20 text-[#00E0FF]" :
                              activity.type === "reward" ? "bg-yellow-500/20 text-yellow-400" :
                              activity.type === "purchase" ? "bg-green-500/20 text-green-400" :
                              "bg-purple-500/20 text-purple-400"
                            } border-0 text-xs`}>
                              {activity.type}
                            </Badge>
                            <span className="text-xs text-[#A9AFBC]">{activity.time}</span>
                          </div>
                          <div className="text-white text-sm mb-1">{activity.user}</div>
                          <div className="text-xs text-[#A9AFBC]">{activity.action}</div>
                        </div>
                        <div className="text-[#A7FF1A] text-sm whitespace-nowrap ml-3">
                          {activity.type === "purchase" ? "+" : "-"}{activity.amount.toLocaleString()} FP
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-br from-[#A7FF1A]/10 to-[#00E0FF]/10 border-[#A7FF1A]/30 border-2">
              <h3 className="text-white mb-6">Azioni Rapide</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => setIsCreateAuctionOpen(true)}
                  className="h-auto flex-col gap-3 p-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                >
                  <Target className="w-8 h-8 text-[#A7FF1A]" />
                  <span>Crea Asta</span>
                </Button>
                <Button className="h-auto flex-col gap-3 p-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white">
                  <Brain className="w-8 h-8 text-[#00E0FF]" />
                  <span>Nuovo Quiz</span>
                </Button>
                <Button className="h-auto flex-col gap-3 p-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <span>Challenge</span>
                </Button>
                <Button className="h-auto flex-col gap-3 p-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white">
                  <Gift className="w-8 h-8 text-purple-400" />
                  <span>Aggiungi Premio</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Auction Modal */}
      <CreateAuctionModal
        isOpen={isCreateAuctionOpen}
        onClose={() => setIsCreateAuctionOpen(false)}
        onSuccess={() => {
          toast.success("Asta pubblicata con successo!");
        }}
      />

      {/* Partner Request Modal */}
      <PartnerRequestModal
        isOpen={isPartnerRequestOpen}
        onClose={() => setIsPartnerRequestOpen(false)}
        onSuccess={async () => {
          // Reload profile to show pending status
          await refreshProfile();
          setIsPartnerRequestOpen(false);
        }}
      />
    </div>
  );
}
