import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Zap, 
  Trophy, 
  Brain, 
  Gift, 
  ArrowRight, 
  Volume2, 
  Target, 
  Sparkles, 
  Users, 
  Swords, 
  Crown, 
  Gavel, 
  Clock, 
  Flame,
  TrendingUp,
  Award,
  Star,
  Medal,
  ChevronRight,
  Calendar,
  Play,
  Coins
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { HexagonPattern } from "./HexagonPattern";
import { Badge } from "./ui/badge";
import { HeroBanner } from "./HeroBanner";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onBuyPoints: () => void;
}

export function HomePage({ onNavigate, onBuyPoints }: HomePageProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 18 });

  // Countdown animation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const upcomingMatches = [
    { id: 1, home: "Inter", away: "Milan", league: "Serie A", time: "20:45", date: "Oggi", isLive: false },
    { id: 2, home: "Juventus", away: "Napoli", league: "Serie A", time: "18:00", date: "Domani", isLive: false },
  ];

  const liveEvents = [
    { id: 1, title: "Inter vs Milan", type: "Noise Meter", participants: 2456, icon: Volume2, color: "red" },
    { id: 2, title: "Quiz Champions", type: "Quiz Live", participants: 1289, icon: Brain, color: "cyan" },
    { id: 3, title: "Battle Royale", type: "Team Battles", participants: 856, icon: Swords, color: "purple" },
  ];

  const topPlayers = [
    { id: 1, username: "CalcioKing", points: 125000, position: 1, streak: 24 },
    { id: 2, username: "InterFan92", points: 98500, position: 2, streak: 18 },
    { id: 3, username: "MilanLegend", points: 87200, position: 3, streak: 15 },
  ];

  const quickActions = [
    { id: "quiz", label: "Quiz", desc: "Gioca e vinci", icon: Brain, color: "lime", gradient: "from-[#A7FF1A]/10 to-transparent", border: "[#A7FF1A]/30" },
    { id: "competitions", label: "Competizioni", desc: "Fai pronostici", icon: Trophy, color: "cyan", gradient: "from-[#00E0FF]/10 to-transparent", border: "[#00E0FF]/30" },
    { id: "rewards", label: "Premi", desc: "Riscatta ora", icon: Gift, color: "yellow", gradient: "from-yellow-500/10 to-orange-500/10", border: "yellow-500/30" },
    { id: "noisemeter", label: "Noise Meter", desc: "Fai rumore!", icon: Volume2, color: "red", gradient: "from-red-500/10 to-orange-500/10", border: "red-500/30" },
    { id: "shop", label: "Store", desc: "Ricarica FP", icon: Zap, color: "lime", gradient: "from-[#A7FF1A]/20 to-[#A7FF1A]/5", border: "[#A7FF1A]/50", special: true },
  ];

  const featuredFeatures = [
    { id: "battlepass", label: "Battle Pass", desc: "Stagione 1", icon: Crown, color: "purple", gradient: "from-purple-500/10 to-pink-500/10", border: "purple-500/30", badge: "S1" },
    { id: "challenges", label: "Sfide", desc: "4 attive", icon: Target, color: "lime", gradient: "from-[#A7FF1A]/10 to-transparent", border: "[#A7FF1A]/30", badge: "4" },
    { id: "spinwheel", label: "Ruota", desc: "1 spin gratis", icon: Sparkles, color: "yellow", gradient: "from-yellow-500/10 to-orange-500/10", border: "yellow-500/30", badge: "FREE" },
    { id: "squad", label: "Squad", desc: "Build team", icon: Users, color: "cyan", gradient: "from-[#00E0FF]/10 to-transparent", border: "[#00E0FF]/30", badge: "NEW" },
    { id: "teambattles", label: "Battles", desc: "2 live", icon: Swords, color: "red", gradient: "from-red-500/10 to-orange-500/10", border: "red-500/30", badge: "LIVE" },
    { id: "auctions", label: "Aste", desc: "6 live", icon: Gavel, color: "yellow", gradient: "from-yellow-500/10 to-orange-500/10", border: "yellow-500/30", badge: "HOT" },
  ];

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeroBanner
          imageUrl="https://images.unsplash.com/photo-1551384732-fb4f003640e4?w=1200"
          title="Vinci 10.000 Fans Points!"
          subtitle="Partecipa ai quiz della settimana e scala la classifica per vincere premi incredibili"
          ctaText="Gioca Ora"
          ctaAction={() => onNavigate("quiz")}
          badge="EVENTO SPECIALE"
          height="medium"
        />
      </motion.div>

      {/* Live Now Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </div>
          <h3 className="text-white">Live Ora</h3>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border animate-pulse">
            {liveEvents.length} EVENTI ATTIVI
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveEvents.map((event, idx) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card 
                  className={`p-4 bg-gradient-to-br ${
                    event.color === "red" ? "from-red-500/10 to-orange-500/10 border-red-500/50" :
                    event.color === "cyan" ? "from-[#00E0FF]/10 to-transparent border-[#00E0FF]/50" :
                    "from-purple-500/10 to-pink-500/10 border-purple-500/50"
                  } hover:scale-105 transition-all cursor-pointer group`}
                  onClick={() => onNavigate(event.type === "Noise Meter" ? "noisemeter" : event.type === "Quiz Live" ? "quiz" : "teambattles")}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.color === "red" ? "bg-red-500/20" :
                        event.color === "cyan" ? "bg-[#00E0FF]/20" :
                        "bg-purple-500/20"
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          event.color === "red" ? "text-red-400" :
                          event.color === "cyan" ? "text-[#00E0FF]" :
                          "text-purple-400"
                        }`} />
                      </div>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border text-xs animate-pulse">
                        LIVE
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-white mb-1">{event.title}</h4>
                      <p className="text-xs text-[#A9AFBC]">{event.type}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-[#A9AFBC]">
                        <Users className="w-3.5 h-3.5" />
                        <span>{event.participants.toLocaleString()}</span>
                      </div>
                      <Button size="sm" className={`${
                        event.color === "red" ? "bg-red-500 hover:bg-red-600" :
                        event.color === "cyan" ? "bg-[#00E0FF] hover:bg-[#00C8E8]" :
                        "bg-purple-500 hover:bg-purple-600"
                      } text-white h-7 text-xs`}>
                        <Play className="w-3 h-3 mr-1" />
                        Unisciti
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Daily Rewards */}
      <Card className="p-6 bg-gradient-to-br from-[#A7FF1A]/10 via-[#00E0FF]/5 to-transparent border-[#A7FF1A]/30 border-2 overflow-hidden relative">
        <HexagonPattern />
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#A7FF1A]" />
                <h3 className="text-white">Daily Login Bonus</h3>
              </div>
              <p className="text-sm text-[#A9AFBC]">Accedi ogni giorno per sbloccare premi esclusivi!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl text-[#A7FF1A] mb-1">+500 FP</div>
              <p className="text-xs text-[#A9AFBC]">Disponibile tra</p>
              <div className="flex items-center gap-1 justify-end mt-1">
                <Badge className="bg-[#2B2F3A] text-white border-0 text-xs">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </Badge>
                <span className="text-[#A9AFBC]">:</span>
                <Badge className="bg-[#2B2F3A] text-white border-0 text-xs">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A9AFBC]">Streak Corrente</span>
              <span className="text-[#A7FF1A]">7 giorni 🔥</span>
            </div>
            <Progress value={70} className="h-2" />
            <p className="text-xs text-[#A9AFBC]">3 giorni al prossimo bonus multiplier</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-white">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`p-6 bg-gradient-to-br ${action.gradient} border-${action.border} border ${
                    action.special ? "glow-neon" : ""
                  } hover:border-opacity-100 transition-all cursor-pointer group`}
                  onClick={() => action.id === "shop" ? onBuyPoints() : onNavigate(action.id)}
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-lg ${
                      action.special ? "bg-[#A7FF1A] glow-neon" :
                      action.color === "lime" ? "bg-[#A7FF1A]/20" :
                      action.color === "cyan" ? "bg-[#00E0FF]/20" :
                      action.color === "yellow" ? "bg-yellow-500/20" :
                      "bg-red-500/20"
                    } flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${
                        action.special ? "text-[#0A1020]" :
                        action.color === "lime" ? "text-[#A7FF1A]" :
                        action.color === "cyan" ? "text-[#00E0FF]" :
                        action.color === "yellow" ? "text-yellow-400" :
                        "text-red-500"
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-white">{action.label}</h3>
                      <p className="text-sm text-[#A9AFBC]">{action.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Featured Features */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#A7FF1A]" />
            Funzionalità in Evidenza
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {featuredFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card 
                  className={`p-4 bg-gradient-to-br ${feature.gradient} border-${feature.border} border hover:border-opacity-100 transition-all cursor-pointer group relative overflow-hidden`}
                  onClick={() => onNavigate(feature.id)}
                >
                  {feature.badge && (
                    <Badge className={`absolute top-2 right-2 text-xs ${
                      feature.badge === "LIVE" ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" :
                      feature.badge === "HOT" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                      feature.badge === "NEW" ? "bg-[#00E0FF]/20 text-[#00E0FF] border-[#00E0FF]/30" :
                      feature.badge === "FREE" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      "bg-[#A7FF1A]/20 text-[#A7FF1A] border-[#A7FF1A]/30"
                    } border`}>
                      {feature.badge}
                    </Badge>
                  )}
                  <div className="space-y-2">
                    <div className={`w-10 h-10 rounded-lg ${
                      feature.color === "purple" ? "bg-purple-500/20" :
                      feature.color === "lime" ? "bg-[#A7FF1A]/20" :
                      feature.color === "yellow" ? "bg-yellow-500/20" :
                      feature.color === "cyan" ? "bg-[#00E0FF]/20" :
                      "bg-red-500/20"
                    } flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${
                        feature.color === "purple" ? "text-purple-400" :
                        feature.color === "lime" ? "text-[#A7FF1A]" :
                        feature.color === "yellow" ? "text-yellow-400" :
                        feature.color === "cyan" ? "text-[#00E0FF]" :
                        "text-red-400"
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-white text-sm">{feature.label}</h4>
                      <p className="text-xs text-[#A9AFBC]">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Top Players This Week */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Top Players Settimana
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("leaderboard")}
            className="text-[#A7FF1A] hover:text-[#8FE515]"
          >
            Classifica <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPlayers.map((player, idx) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`p-6 relative overflow-hidden ${
                idx === 0 ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-yellow-500/50 border-2" :
                idx === 1 ? "bg-gradient-to-br from-gray-400/20 to-gray-500/10 border-gray-400/50 border-2" :
                "bg-gradient-to-br from-orange-600/20 to-orange-700/10 border-orange-600/50 border-2"
              }`}>
                <HexagonPattern />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
                        idx === 0 ? "bg-yellow-500/30 glow-neon" :
                        idx === 1 ? "bg-gray-400/30" :
                        "bg-orange-600/30"
                      }`}>
                        <span className="text-2xl">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                      </div>
                      <div>
                        <h4 className="text-white">{player.username}</h4>
                        <p className="text-xs text-[#A9AFBC]">#{player.position} Globale</p>
                      </div>
                    </div>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">
                      🔥 {player.streak}d
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#A9AFBC] mb-1">Fans Points</p>
                      <div className={`text-2xl ${
                        idx === 0 ? "text-yellow-400" :
                        idx === 1 ? "text-gray-300" :
                        "text-orange-400"
                      }`}>
                        {player.points.toLocaleString()}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => onNavigate("profile")}
                    >
                      Vedi Profilo
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Upcoming Matches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white">Prossime Partite</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("competitions")}
            className="text-[#A7FF1A] hover:text-[#8FE515]"
          >
            Vedi tutto <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {upcomingMatches.map((match, idx) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card 
                className="p-4 bg-[#111318] border-white/10 hover:border-[#A7FF1A]/50 transition-all cursor-pointer"
                onClick={() => onNavigate("competitions")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-[#00E0FF]/30 text-[#00E0FF]">
                        {match.league}
                      </Badge>
                      <span className="text-xs text-[#A9AFBC]">{match.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white">{match.home}</span>
                      <span className="text-[#A9AFBC]">vs</span>
                      <span className="text-white">{match.away}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#A7FF1A] mb-1">{match.time}</div>
                    <Button size="sm" className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020] h-7 text-xs">
                      Pronostica
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Hot Auctions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Aste Hot
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("auctions")}
            className="text-[#A7FF1A] hover:text-[#8FE515]"
          >
            Vedi tutte <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="p-6 bg-[#111318] border-yellow-500/50 hover:border-yellow-500 transition-all cursor-pointer overflow-hidden relative"
              onClick={() => onNavigate("auctions")}>
              <HexagonPattern />
              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border mb-2">
                      Leggendario
                    </Badge>
                    <h4 className="text-white mb-1">Scarpini Match-Worn Lautaro</h4>
                    <p className="text-sm text-[#A9AFBC]">Indossati nel Derby + autografi</p>
                  </div>
                  <div className="text-3xl">👟</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#A9AFBC] mb-1">Offerta Attuale</div>
                    <div className="text-2xl text-[#A7FF1A]">22,000 FP</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
                    <Clock className="w-4 h-4 text-red-400 animate-pulse" />
                    <span className="text-sm text-red-400">1h 30m</span>
                  </div>
                </div>
                <Button className="w-full bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]">
                  <Gavel className="w-4 h-4 mr-2" />
                  Fai un'offerta
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="p-6 bg-[#111318] border-[#A7FF1A]/30 hover:border-[#A7FF1A]/50 transition-all cursor-pointer overflow-hidden relative"
              onClick={() => onNavigate("auctions")}>
              <HexagonPattern />
              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="bg-[#A7FF1A]/20 text-[#A7FF1A] border-[#A7FF1A]/30 border mb-2">
                      Esperienza VIP
                    </Badge>
                    <h4 className="text-white mb-1">Meet & Greet Inter</h4>
                    <p className="text-sm text-[#A9AFBC]">Con 3 giocatori + autografi</p>
                  </div>
                  <div className="text-3xl">🤝</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#A9AFBC] mb-1">Offerta Attuale</div>
                    <div className="text-2xl text-[#A7FF1A]">45,000 FP</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2B2F3A]">
                    <Clock className="w-4 h-4 text-[#00E0FF]" />
                    <span className="text-sm text-white">2h 15m</span>
                  </div>
                </div>
                <Button className="w-full bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]">
                  <Gavel className="w-4 h-4 mr-2" />
                  Fai un'offerta
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Community Highlights */}
      <div className="space-y-4">
        <h3 className="text-white">Community Stats</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="p-6 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30 border">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#A7FF1A]" />
                  <span className="text-sm text-[#A9AFBC]">Giocatori Online</span>
                </div>
                <div className="text-3xl text-[#A7FF1A]">1,247</div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
                  +12% oggi
                </Badge>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="p-6 bg-gradient-to-br from-[#00E0FF]/10 to-transparent border-[#00E0FF]/30 border">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#00E0FF]" />
                  <span className="text-sm text-[#A9AFBC]">Pronostici Oggi</span>
                </div>
                <div className="text-3xl text-[#00E0FF]">42,891</div>
                <Badge className="bg-[#00E0FF]/20 text-[#00E0FF] border-[#00E0FF]/30 border text-xs">
                  Record!
                </Badge>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 border">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-[#A9AFBC]">Premi Distribuiti</span>
                </div>
                <div className="text-3xl text-yellow-400">€156K</div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border text-xs">
                  Questo mese
                </Badge>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
