import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Shield, Swords, Trophy, Users, TrendingUp, Flame } from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { HexagonPattern } from "./HexagonPattern";

interface TeamBattle {
  id: string;
  team1: {
    name: string;
    logo: string;
    color: string;
    fans: number;
    points: number;
  };
  team2: {
    name: string;
    logo: string;
    color: string;
    fans: number;
    points: number;
  };
  prize: number;
  endsIn: string;
  status: "active" | "upcoming" | "finished";
}

export function TeamBattlesPage() {
  const activeBattles: TeamBattle[] = [
    {
      id: "1",
      team1: {
        name: "Inter",
        logo: "🔵⚫",
        color: "#0068A8",
        fans: 18450,
        points: 2450000
      },
      team2: {
        name: "Milan",
        logo: "🔴⚫",
        color: "#FB090B",
        fans: 17320,
        points: 2180000
      },
      prize: 50000,
      endsIn: "2 giorni",
      status: "active"
    },
    {
      id: "2",
      team1: {
        name: "Juventus",
        logo: "⚪⚫",
        color: "#000000",
        fans: 22100,
        points: 3100000
      },
      team2: {
        name: "Napoli",
        logo: "🔵⚪",
        color: "#0067B5",
        fans: 19800,
        points: 2850000
      },
      prize: 75000,
      endsIn: "4 giorni",
      status: "active"
    }
  ];

  const upcomingBattles: TeamBattle[] = [
    {
      id: "3",
      team1: {
        name: "Roma",
        logo: "🟡🔴",
        color: "#BE0027",
        fans: 15600,
        points: 0
      },
      team2: {
        name: "Lazio",
        logo: "🔵⚪",
        color: "#87CEEB",
        fans: 14200,
        points: 0
      },
      prize: 40000,
      endsIn: "Inizia tra 1 giorno",
      status: "upcoming"
    }
  ];

  const renderBattleCard = (battle: TeamBattle) => {
    const total = battle.team1.points + battle.team2.points;
    const team1Percent = total > 0 ? (battle.team1.points / total) * 100 : 50;
    const team2Percent = total > 0 ? (battle.team2.points / total) * 100 : 50;

    return (
      <Card key={battle.id} className="p-6 bg-[#111318] border-white/10 overflow-hidden hover:border-[#A7FF1A]/50 transition-all">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Badge className={`${
              battle.status === "active"
                ? "bg-red-500/20 text-red-400 border-red-500/30"
                : "bg-[#A9AFBC]/20 text-[#A9AFBC] border-[#A9AFBC]/30"
            } border flex items-center gap-2`}>
              {battle.status === "active" && <Flame className="w-3 h-3" />}
              {battle.status === "active" ? "LIVE" : "Prossima"}
            </Badge>
            <div className="flex items-center gap-2 text-[#A7FF1A]">
              <Trophy className="w-4 h-4" />
              <span>{battle.prize.toLocaleString()} FP</span>
            </div>
          </div>

          {/* Teams */}
          <div className="flex items-center gap-4">
            {/* Team 1 */}
            <div className="flex-1 text-center space-y-2">
              <div className="text-4xl">{battle.team1.logo}</div>
              <h3 className="text-white">{battle.team1.name}</h3>
              <div className="space-y-1">
                <div className="text-2xl" style={{ color: battle.team1.color }}>
                  {battle.team1.points.toLocaleString()}
                </div>
                <div className="text-xs text-[#A9AFBC]">
                  {battle.team1.fans.toLocaleString()} tifosi
                </div>
              </div>
            </div>

            {/* VS */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#2B2F3A] flex items-center justify-center">
                <Swords className="w-6 h-6 text-[#A7FF1A]" />
              </div>
            </div>

            {/* Team 2 */}
            <div className="flex-1 text-center space-y-2">
              <div className="text-4xl">{battle.team2.logo}</div>
              <h3 className="text-white">{battle.team2.name}</h3>
              <div className="space-y-1">
                <div className="text-2xl" style={{ color: battle.team2.color }}>
                  {battle.team2.points.toLocaleString()}
                </div>
                <div className="text-xs text-[#A9AFBC]">
                  {battle.team2.fans.toLocaleString()} tifosi
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {battle.status === "active" && (
            <div className="space-y-2">
              <div className="flex h-4 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="transition-all duration-500"
                  style={{ 
                    width: `${team1Percent}%`, 
                    backgroundColor: battle.team1.color 
                  }}
                />
                <div 
                  className="transition-all duration-500"
                  style={{ 
                    width: `${team2Percent}%`, 
                    backgroundColor: battle.team2.color 
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#A9AFBC]">
                <span>{team1Percent.toFixed(1)}%</span>
                <span>{team2Percent.toFixed(1)}%</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="text-sm text-[#A9AFBC]">{battle.endsIn}</div>
            <Button className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]">
              {battle.status === "active" ? "Contribuisci" : "Partecipa"}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHJpdmFscnl8ZW58MXx8fHwxNzU5ODYzMzM1fDA&ixlib=rb-4.1.0&q=80&w=1080"
        title="Team Battles"
        subtitle="Sfide settimanali tra tifoserie rivali. Supporta la tua squadra!"
        badge="GUERRE TRA TIFOSI"
        height="small"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">Il Tuo Team</span>
              <Shield className="w-4 h-4 text-[#A7FF1A]" />
            </div>
            <div className="text-2xl text-white">Inter 🔵⚫</div>
            <p className="text-xs text-[#A9AFBC]">18.4k tifosi</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#00E0FF]/10 to-transparent border-[#00E0FF]/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">Contributo</span>
              <TrendingUp className="w-4 h-4 text-[#00E0FF]" />
            </div>
            <div className="text-2xl text-white">12,500</div>
            <p className="text-xs text-[#A9AFBC]">Punti questa settimana</p>
          </div>
        </Card>

        <Card className="p-4 bg-[#111318] border-white/10">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">Rank</span>
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl text-white">#143</div>
            <p className="text-xs text-[#A9AFBC]">Nella tua tifoseria</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">Vittorie</span>
              <Flame className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl text-white">7/10</div>
            <p className="text-xs text-[#A9AFBC]">Battles vinte</p>
          </div>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="p-6 bg-gradient-to-br from-[#A7FF1A]/5 to-transparent border-[#A7FF1A]/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#A7FF1A]/20 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-[#A7FF1A]" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-2">Come Funziona</h3>
            <p className="text-sm text-[#A9AFBC] mb-3">
              Ogni settimana vengono create battaglie tra squadre rivali. Tutti i punti che guadagni 
              (pronostici, quiz, challenges) vengono automaticamente aggiunti al totale della tua squadra. 
              La tifoseria vincente riceve ricompense esclusive!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-[#A9AFBC]">
                <div className="w-2 h-2 rounded-full bg-[#A7FF1A]" />
                <span>Gioca normalmente</span>
              </div>
              <div className="flex items-center gap-2 text-[#A9AFBC]">
                <div className="w-2 h-2 rounded-full bg-[#A7FF1A]" />
                <span>I tuoi punti contano</span>
              </div>
              <div className="flex items-center gap-2 text-[#A9AFBC]">
                <div className="w-2 h-2 rounded-full bg-[#A7FF1A]" />
                <span>Vinci premi collettivi</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Battles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl text-white">Battaglie Attive</h3>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border flex items-center gap-2">
            <Flame className="w-3 h-3" />
            {activeBattles.length} Live
          </Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeBattles.map(renderBattleCard)}
        </div>
      </div>

      {/* Upcoming Battles */}
      <div className="space-y-4">
        <h3 className="text-xl text-white">Prossime Battaglie</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingBattles.map(renderBattleCard)}
        </div>
      </div>

      {/* Leaderboard */}
      <Card className="p-6 bg-[#111318] border-white/10">
        <h3 className="text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#A7FF1A]" />
          Top Contributors - Inter
        </h3>
        <div className="space-y-3">
          {[
            { rank: 1, name: "GiovanniNera", points: 45600, badge: "🥇" },
            { rank: 2, name: "InterFan1908", points: 42100, badge: "🥈" },
            { rank: 3, name: "NeroAzzurro", points: 38500, badge: "🥉" },
            { rank: 4, name: "You", points: 12500, badge: "" },
          ].map((user) => (
            <div 
              key={user.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.name === "You" 
                  ? "bg-[#A7FF1A]/10 border border-[#A7FF1A]/30" 
                  : "bg-[#2B2F3A]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{user.badge || `#${user.rank}`}</span>
                <span className={user.name === "You" ? "text-[#A7FF1A]" : "text-white"}>
                  {user.name}
                </span>
              </div>
              <span className="text-[#A9AFBC]">{user.points.toLocaleString()} FP</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
