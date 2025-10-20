import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Trophy, Zap, Gift, Crown, Lock, Check } from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { HexagonPattern } from "./HexagonPattern";

interface Reward {
  level: number;
  free: {
    type: string;
    value: string;
    icon: string;
  };
  premium: {
    type: string;
    value: string;
    icon: string;
  };
  unlocked: boolean;
}

export function BattlePassPage() {
  const currentLevel = 12;
  const currentXP = 2450;
  const xpPerLevel = 1000;
  const seasonEndsIn = "28 giorni";

  const rewards: Reward[] = [
    {
      level: 1,
      free: { type: "points", value: "100 FP", icon: "💎" },
      premium: { type: "points", value: "500 FP", icon: "💰" },
      unlocked: true
    },
    {
      level: 2,
      free: { type: "badge", value: "Badge Bronze", icon: "🥉" },
      premium: { type: "card", value: "Card Rara", icon: "🃏" },
      unlocked: true
    },
    {
      level: 3,
      free: { type: "points", value: "150 FP", icon: "💎" },
      premium: { type: "multiplier", value: "x1.5 Boost", icon: "⚡" },
      unlocked: true
    },
    {
      level: 5,
      free: { type: "badge", value: "Badge Silver", icon: "🥈" },
      premium: { type: "card", value: "Card Epica", icon: "🎴" },
      unlocked: true
    },
    {
      level: 10,
      free: { type: "points", value: "500 FP", icon: "💎" },
      premium: { type: "skin", value: "Theme Esclusivo", icon: "🎨" },
      unlocked: true
    },
    {
      level: 12,
      free: { type: "points", value: "200 FP", icon: "💎" },
      premium: { type: "points", value: "1000 FP", icon: "💰" },
      unlocked: true
    },
    {
      level: 15,
      free: { type: "badge", value: "Badge Gold", icon: "🥇" },
      premium: { type: "card", value: "Card Leggendaria", icon: "👑" },
      unlocked: false
    },
    {
      level: 20,
      free: { type: "points", value: "1000 FP", icon: "💎" },
      premium: { type: "skin", value: "Avatar Esclusivo", icon: "🎭" },
      unlocked: false
    },
    {
      level: 25,
      free: { type: "badge", value: "Badge Platinum", icon: "💫" },
      premium: { type: "jackpot", value: "5000 FP", icon: "🏆" },
      unlocked: false
    },
    {
      level: 30,
      free: { type: "points", value: "2000 FP", icon: "💎" },
      premium: { type: "card", value: "Card Ultimate", icon: "⭐" },
      unlocked: false
    },
    {
      level: 50,
      free: { type: "badge", value: "Badge Legend", icon: "👑" },
      premium: { type: "ultimate", value: "Reward Ultimate", icon: "🌟" },
      unlocked: false
    }
  ];

  const stats = {
    currentLevel,
    xpProgress: currentXP,
    xpNeeded: xpPerLevel,
    rewardsUnlocked: rewards.filter(r => r.unlocked).length,
    totalRewards: rewards.length,
    isPremium: false
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwdHJvcGh5fGVufDF8fHx8MTc1OTg2MzMzN3ww&ixlib=rb-4.1.0&q=80&w=1080"
        title="Battle Pass Stagionale"
        subtitle="Gioca, completa missioni e sblocca ricompense esclusive stagionali"
        badge="STAGIONE 1"
        height="small"
      />

      {/* Progress Overview */}
      <Card className="p-6 bg-gradient-to-br from-[#A7FF1A]/10 to-[#00E0FF]/5 border-[#A7FF1A]/30 overflow-hidden">
        <HexagonPattern opacity={0.05} />
        <div className="relative space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl text-white mb-2">Livello {stats.currentLevel}</h3>
              <p className="text-sm text-[#A9AFBC]">Stagione termina tra {seasonEndsIn}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl text-[#A7FF1A] mb-1">{stats.xpProgress}</div>
              <div className="text-sm text-[#A9AFBC]">/ {stats.xpNeeded} XP</div>
            </div>
          </div>

          <div className="space-y-2">
            <Progress 
              value={(stats.xpProgress / stats.xpNeeded) * 100} 
              className="h-3"
            />
            <div className="flex items-center justify-between text-sm text-[#A9AFBC]">
              <span>Livello {stats.currentLevel}</span>
              <span>Prossimo livello: {stats.xpNeeded - stats.xpProgress} XP</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl text-white mb-1">{stats.rewardsUnlocked}/{stats.totalRewards}</div>
              <div className="text-xs text-[#A9AFBC]">Ricompense</div>
            </div>
            <div className="text-center">
              <div className="text-xl text-[#00E0FF] mb-1">
                {Math.round((stats.currentLevel / 50) * 100)}%
              </div>
              <div className="text-xs text-[#A9AFBC]">Completamento</div>
            </div>
            <div className="text-center">
              <div className="text-xl text-[#A7FF1A] mb-1">{50 - stats.currentLevel}</div>
              <div className="text-xs text-[#A9AFBC]">Livelli Rimasti</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Premium Upgrade */}
      {!stats.isPremium && (
        <Card className="p-6 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent border-purple-500/50">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl text-white mb-2">Sblocca il Premium Pass</h3>
              <p className="text-sm text-[#A9AFBC] mb-4">
                Accedi a ricompense esclusive, card leggendarie, skin premium e moltiplicatori XP permanenti
              </p>
              <div className="flex items-center gap-4">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Crown className="w-4 h-4 mr-2" />
                  Acquista per 5000 FP
                </Button>
                <div className="text-sm text-[#A9AFBC]">
                  <div>✓ 50+ ricompense premium</div>
                  <div>✓ x2 XP per sempre</div>
                  <div>✓ Badge & Skin esclusive</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Rewards Track */}
      <div className="space-y-4">
        <h3 className="text-xl text-white">Traccia Ricompense</h3>
        
        <div className="space-y-4">
          {rewards.map((reward) => (
            <Card 
              key={reward.level}
              className={`p-4 bg-[#111318] border transition-all ${
                reward.unlocked 
                  ? "border-[#A7FF1A]/50" 
                  : reward.level === currentLevel + 1
                  ? "border-[#00E0FF]/50"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Level Badge */}
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  reward.unlocked
                    ? "bg-[#A7FF1A]/20 border-2 border-[#A7FF1A]/50"
                    : "bg-[#2B2F3A] border-2 border-white/10"
                }`}>
                  <div className="text-center">
                    <div className="text-xs text-[#A9AFBC] mb-1">LVL</div>
                    <div className="text-lg text-white">{reward.level}</div>
                  </div>
                </div>

                {/* Free Reward */}
                <div className="flex-1">
                  <div className="text-xs text-[#A9AFBC] mb-2">Free Track</div>
                  <div className="flex items-center gap-3 p-3 bg-[#2B2F3A] rounded-lg">
                    <div className="text-2xl">{reward.free.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm text-white">{reward.free.value}</div>
                      <div className="text-xs text-[#A9AFBC]">Gratis</div>
                    </div>
                    {reward.unlocked ? (
                      <Check className="w-5 h-5 text-[#A7FF1A]" />
                    ) : (
                      <Lock className="w-5 h-5 text-[#A9AFBC]" />
                    )}
                  </div>
                </div>

                {/* Premium Reward */}
                <div className="flex-1">
                  <div className="text-xs text-purple-400 mb-2">Premium Track</div>
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${
                    stats.isPremium 
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                      : "bg-[#2B2F3A] opacity-50"
                  }`}>
                    <div className="text-2xl">{reward.premium.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm text-white">{reward.premium.value}</div>
                      <div className="text-xs text-purple-400">Premium</div>
                    </div>
                    {stats.isPremium ? (
                      reward.unlocked ? (
                        <Check className="w-5 h-5 text-[#A7FF1A]" />
                      ) : (
                        <Lock className="w-5 h-5 text-[#A9AFBC]" />
                      )
                    ) : (
                      <Crown className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How to Earn XP */}
      <Card className="p-6 bg-[#111318] border-white/10">
        <h3 className="text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#A7FF1A]" />
          Come Guadagnare XP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-[#2B2F3A] rounded-lg">
            <Trophy className="w-5 h-5 text-[#A7FF1A]" />
            <div className="flex-1">
              <div className="text-sm text-white">Pronostici Corretti</div>
              <div className="text-xs text-[#A9AFBC]">+50 XP per pronostico</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#2B2F3A] rounded-lg">
            <Gift className="w-5 h-5 text-[#00E0FF]" />
            <div className="flex-1">
              <div className="text-sm text-white">Quiz Completati</div>
              <div className="text-xs text-[#A9AFBC]">+100 XP per quiz</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#2B2F3A] rounded-lg">
            <Zap className="w-5 h-5 text-purple-400" />
            <div className="flex-1">
              <div className="text-sm text-white">Daily Challenges</div>
              <div className="text-xs text-[#A9AFBC]">+150 XP per sfida</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#2B2F3A] rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <div className="text-sm text-white">Team Battles</div>
              <div className="text-xs text-[#A9AFBC]">+200 XP per vittoria</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
