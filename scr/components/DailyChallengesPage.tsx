import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Trophy, Target, Zap, Gift, CheckCircle2, Clock } from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { Button } from "./ui/button";

interface Challenge {
  id: string;
  type: "daily" | "weekly" | "special";
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  category: string;
  completed: boolean;
  expiresIn?: string;
}

export function DailyChallengesPage() {
  const dailyChallenges: Challenge[] = [
    {
      id: "1",
      type: "daily",
      title: "Pronosticatore Attivo",
      description: "Fai 3 pronostici su partite in corso",
      progress: 1,
      target: 3,
      reward: 500,
      category: "predictions",
      completed: false,
      expiresIn: "18h 42m"
    },
    {
      id: "2",
      type: "daily",
      title: "Quiz Master",
      description: "Completa 2 quiz con almeno 80% di risposte corrette",
      progress: 2,
      target: 2,
      reward: 300,
      category: "quiz",
      completed: true,
      expiresIn: "18h 42m"
    },
    {
      id: "3",
      type: "daily",
      title: "Punti Giornalieri",
      description: "Guadagna 1000 Fans Points oggi",
      progress: 750,
      target: 1000,
      reward: 200,
      category: "points",
      completed: false,
      expiresIn: "18h 42m"
    },
    {
      id: "4",
      type: "daily",
      title: "Social Fan",
      description: "Commenta 5 partite live",
      progress: 3,
      target: 5,
      reward: 150,
      category: "social",
      completed: false,
      expiresIn: "18h 42m"
    }
  ];

  const weeklyChallenges: Challenge[] = [
    {
      id: "w1",
      type: "weekly",
      title: "Pronosticatore Leggendario",
      description: "Fai 20 pronostici corretti questa settimana",
      progress: 12,
      target: 20,
      reward: 2500,
      category: "predictions",
      completed: false,
      expiresIn: "5 giorni"
    },
    {
      id: "w2",
      type: "weekly",
      title: "Ultimate Quiz Champion",
      description: "Completa 10 quiz questa settimana",
      progress: 6,
      target: 10,
      reward: 2000,
      category: "quiz",
      completed: false,
      expiresIn: "5 giorni"
    },
    {
      id: "w3",
      type: "weekly",
      title: "Noise Master",
      description: "Fai 100dB nel Noise Meter 3 volte",
      progress: 1,
      target: 3,
      reward: 1500,
      category: "noise",
      completed: false,
      expiresIn: "5 giorni"
    }
  ];

  const specialChallenges: Challenge[] = [
    {
      id: "s1",
      type: "special",
      title: "Derby Week",
      description: "Pronostica correttamente tutti i derby di questa settimana",
      progress: 0,
      target: 4,
      reward: 5000,
      category: "special",
      completed: false,
      expiresIn: "3 giorni"
    },
    {
      id: "s2",
      type: "special",
      title: "Champions League Special",
      description: "Indovina il vincitore di ogni partita della Champions",
      progress: 2,
      target: 8,
      reward: 10000,
      category: "special",
      completed: false,
      expiresIn: "2 giorni"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "predictions":
        return Trophy;
      case "quiz":
        return Target;
      case "points":
        return Zap;
      case "social":
        return Gift;
      default:
        return Target;
    }
  };

  const renderChallengeCard = (challenge: Challenge) => {
    const Icon = getCategoryIcon(challenge.category);
    const progressPercent = (challenge.progress / challenge.target) * 100;

    return (
      <Card 
        key={challenge.id}
        className={`p-4 bg-[#111318] border transition-all hover:border-[#A7FF1A]/50 ${
          challenge.completed 
            ? "border-[#A7FF1A]/50 bg-[#A7FF1A]/5" 
            : "border-white/10"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            challenge.completed
              ? "bg-[#A7FF1A]/20"
              : "bg-[#2B2F3A]"
          }`}>
            {challenge.completed ? (
              <CheckCircle2 className="w-6 h-6 text-[#A7FF1A]" />
            ) : (
              <Icon className="w-6 h-6 text-[#A9AFBC]" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-white mb-1">{challenge.title}</h4>
                <p className="text-sm text-[#A9AFBC]">{challenge.description}</p>
              </div>
              <Badge className={`${
                challenge.type === "special"
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30"
                  : challenge.type === "weekly"
                  ? "bg-[#00E0FF]/10 text-[#00E0FF] border-[#00E0FF]/30"
                  : "bg-[#A7FF1A]/10 text-[#A7FF1A] border-[#A7FF1A]/30"
              } border`}>
                {challenge.type === "daily" ? "Giornaliera" : challenge.type === "weekly" ? "Settimanale" : "Speciale"}
              </Badge>
            </div>

            {!challenge.completed && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A9AFBC]">
                    Progresso: {challenge.progress}/{challenge.target}
                  </span>
                  <span className="text-[#A7FF1A]">+{challenge.reward} FP</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            )}

            {challenge.completed && (
              <div className="flex items-center justify-between">
                <Badge className="bg-[#A7FF1A] text-[#0A1020] border-0">
                  ✓ Completata
                </Badge>
                <span className="text-[#A7FF1A]">+{challenge.reward} FP</span>
              </div>
            )}

            {challenge.expiresIn && !challenge.completed && (
              <div className="flex items-center gap-2 text-xs text-[#A9AFBC]">
                <Clock className="w-3 h-3" />
                Scade tra {challenge.expiresIn}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const totalDailyRewards = dailyChallenges.reduce((sum, c) => sum + c.reward, 0);
  const completedDaily = dailyChallenges.filter(c => c.completed).length;

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHRhcmdldCUyMGdvYWx8ZW58MXx8fHwxNzU5ODYzMzM0fDA&ixlib=rb-4.1.0&q=80&w=1080"
        title="Missioni & Sfide"
        subtitle="Completa le sfide giornaliere e settimanali per guadagnare ricompense esclusive"
        badge="SFIDE ATTIVE"
        height="small"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">Oggi</span>
              <Trophy className="w-4 h-4 text-[#A7FF1A]" />
            </div>
            <div className="text-2xl text-white">{completedDaily}/{dailyChallenges.length}</div>
            <p className="text-xs text-[#A9AFBC]">Completate</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#00E0FF]/10 to-transparent border-[#00E0FF]/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">Disponibili</span>
              <Zap className="w-4 h-4 text-[#00E0FF]" />
            </div>
            <div className="text-2xl text-white">{totalDailyRewards}</div>
            <p className="text-xs text-[#A9AFBC]">FP Oggi</p>
          </div>
        </Card>

        <Card className="p-4 bg-[#111318] border-white/10">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">Settimanali</span>
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl text-white">{weeklyChallenges.length}</div>
            <p className="text-xs text-[#A9AFBC]">Attive</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">Speciali</span>
              <Gift className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl text-white">{specialChallenges.length}</div>
            <p className="text-xs text-[#A9AFBC]">Eventi</p>
          </div>
        </Card>
      </div>

      {/* Daily Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl text-white">Sfide Giornaliere</h3>
          <Badge className="bg-[#2B2F3A] text-[#A9AFBC] border-white/10 border">
            Resettano tra 18h 42m
          </Badge>
        </div>
        <div className="space-y-3">
          {dailyChallenges.map(renderChallengeCard)}
        </div>
      </div>

      {/* Weekly Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl text-white">Sfide Settimanali</h3>
          <Badge className="bg-[#00E0FF]/10 text-[#00E0FF] border-[#00E0FF]/30 border">
            5 giorni rimanenti
          </Badge>
        </div>
        <div className="space-y-3">
          {weeklyChallenges.map(renderChallengeCard)}
        </div>
      </div>

      {/* Special Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl text-white">Eventi Speciali</h3>
          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30 border">
            Tempo limitato
          </Badge>
        </div>
        <div className="space-y-3">
          {specialChallenges.map(renderChallengeCard)}
        </div>
      </div>
    </div>
  );
}
