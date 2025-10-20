import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Trophy, Award, Target, Zap, Crown, Lock } from "lucide-react";
import { HeroBanner } from "./HeroBanner";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "legend";
  category: string;
  progress: number;
  target: number;
  reward: number;
  unlocked: boolean;
  unlockedDate?: string;
}

export function AchievementsPage() {
  const achievements: Achievement[] = [
    {
      id: "1",
      name: "Primo Pronostico",
      description: "Fai il tuo primo pronostico",
      icon: "🎯",
      tier: "bronze",
      category: "predictions",
      progress: 1,
      target: 1,
      reward: 100,
      unlocked: true,
      unlockedDate: "1 settimana fa"
    },
    {
      id: "2",
      name: "Serie Vincente",
      description: "Indovina 5 pronostici consecutivi",
      icon: "🔥",
      tier: "silver",
      category: "predictions",
      progress: 3,
      target: 5,
      reward: 500,
      unlocked: false
    },
    {
      id: "3",
      name: "Oracolo",
      description: "Indovina 25 pronostici consecutivi",
      icon: "🔮",
      tier: "gold",
      category: "predictions",
      progress: 3,
      target: 25,
      reward: 2500,
      unlocked: false
    },
    {
      id: "4",
      name: "Quiz Master",
      description: "Completa 100 quiz",
      icon: "🧠",
      tier: "gold",
      category: "quiz",
      progress: 47,
      target: 100,
      reward: 2000,
      unlocked: false
    },
    {
      id: "5",
      name: "Tifoso Fedele",
      description: "Login per 30 giorni consecutivi",
      icon: "⭐",
      tier: "silver",
      category: "streak",
      progress: 12,
      target: 30,
      reward: 1000,
      unlocked: false
    },
    {
      id: "6",
      name: "Leggenda",
      description: "Raggiungi la posizione #1 nella classifica globale",
      icon: "👑",
      tier: "legend",
      category: "leaderboard",
      progress: 0,
      target: 1,
      reward: 10000,
      unlocked: false
    },
    {
      id: "7",
      name: "Collezionista",
      description: "Possiedi 50 card NFT",
      icon: "🃏",
      tier: "gold",
      category: "collection",
      progress: 12,
      target: 50,
      reward: 3000,
      unlocked: false
    },
    {
      id: "8",
      name: "Ruggito dello Stadio",
      description: "Raggiungi 100dB nel Noise Meter",
      icon: "📢",
      tier: "silver",
      category: "noise",
      progress: 87,
      target: 100,
      reward: 750,
      unlocked: false
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "legend":
        return "from-purple-500/30 to-pink-500/30 border-purple-500/50";
      case "gold":
        return "from-yellow-500/30 to-orange-500/30 border-yellow-500/50";
      case "silver":
        return "from-gray-400/30 to-gray-600/30 border-gray-400/50";
      default:
        return "from-orange-700/30 to-orange-900/30 border-orange-700/50";
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "legend":
        return "Leggendaria";
      case "gold":
        return "Oro";
      case "silver":
        return "Argento";
      default:
        return "Bronzo";
    }
  };

  const stats = {
    totalUnlocked: achievements.filter(a => a.unlocked).length,
    totalAchievements: achievements.length,
    totalPoints: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward, 0)
  };

  const renderAchievementCard = (achievement: Achievement) => (
    <Card 
      key={achievement.id}
      className={`p-6 bg-gradient-to-br ${getTierColor(achievement.tier)} border-2 transition-all ${
        achievement.unlocked ? "hover:scale-105" : "opacity-75"
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="text-5xl">{achievement.icon}</div>
          <Badge className={`${
            achievement.tier === "legend"
              ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300"
              : achievement.tier === "gold"
              ? "bg-yellow-500/20 text-yellow-300"
              : achievement.tier === "silver"
              ? "bg-gray-400/20 text-gray-300"
              : "bg-orange-700/20 text-orange-300"
          }`}>
            {getTierLabel(achievement.tier)}
          </Badge>
        </div>

        <div>
          <h4 className="text-white mb-2 flex items-center gap-2">
            {achievement.name}
            {!achievement.unlocked && <Lock className="w-4 h-4 text-[#A9AFBC]" />}
          </h4>
          <p className="text-sm text-[#A9AFBC]">{achievement.description}</p>
        </div>

        {!achievement.unlocked ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#A9AFBC]">
                Progresso: {achievement.progress}/{achievement.target}
              </span>
              <span className="text-[#A7FF1A]">+{achievement.reward} FP</span>
            </div>
            <Progress 
              value={(achievement.progress / achievement.target) * 100} 
              className="h-2"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <Badge className="bg-[#A7FF1A]/20 text-[#A7FF1A] border-[#A7FF1A]/30 border">
              ✓ Sbloccata
            </Badge>
            <div className="text-sm text-[#A9AFBC]">{achievement.unlockedDate}</div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waHklMjBhdmFyZHxlbnwxfHx8fDE3NTk4NjMzMzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
        title="Achievement"
        subtitle="Sblocca achievement, guadagna ricompense e mostra le tue conquiste"
        badge="SHOWCASE"
        height="small"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30 text-center">
          <div className="space-y-2">
            <Trophy className="w-6 h-6 text-[#A7FF1A] mx-auto" />
            <div className="text-2xl text-white">
              {stats.totalUnlocked}/{stats.totalAchievements}
            </div>
            <p className="text-xs text-[#A9AFBC]">Sbloccate</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#00E0FF]/10 to-transparent border-[#00E0FF]/30 text-center">
          <div className="space-y-2">
            <Award className="w-6 h-6 text-[#00E0FF] mx-auto" />
            <div className="text-2xl text-white">
              {Math.round((stats.totalUnlocked / stats.totalAchievements) * 100)}%
            </div>
            <p className="text-xs text-[#A9AFBC]">Completamento</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30 text-center">
          <div className="space-y-2">
            <Zap className="w-6 h-6 text-purple-400 mx-auto" />
            <div className="text-2xl text-white">{stats.totalPoints}</div>
            <p className="text-xs text-[#A9AFBC]">FP Totali</p>
          </div>
        </Card>
      </div>

      {/* Achievements Grid */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-[#2B2F3A] border-white/10">
          <TabsTrigger value="all">Tutte</TabsTrigger>
          <TabsTrigger value="unlocked">Sbloccate</TabsTrigger>
          <TabsTrigger value="locked">Da Sbloccare</TabsTrigger>
          <TabsTrigger value="legend">Leggendarie</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(renderAchievementCard)}
        </TabsContent>

        <TabsContent value="unlocked" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.filter(a => a.unlocked).map(renderAchievementCard)}
        </TabsContent>

        <TabsContent value="locked" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.filter(a => !a.unlocked).map(renderAchievementCard)}
        </TabsContent>

        <TabsContent value="legend" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.filter(a => a.tier === "legend").map(renderAchievementCard)}
        </TabsContent>
      </Tabs>

      {/* Featured Achievement Showcase */}
      <Card className="p-6 bg-gradient-to-br from-[#A7FF1A]/10 to-[#00E0FF]/5 border-[#A7FF1A]/30">
        <h3 className="text-white mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-[#A7FF1A]" />
          Achievement in Evidenza
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.filter(a => a.unlocked).slice(0, 4).map((achievement) => (
            <div key={achievement.id} className="text-center space-y-2">
              <div className="text-4xl">{achievement.icon}</div>
              <div className="text-sm text-white">{achievement.name}</div>
              <Badge className="bg-[#A7FF1A]/10 text-[#A7FF1A] border-[#A7FF1A]/30 border text-xs">
                {getTierLabel(achievement.tier)}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
