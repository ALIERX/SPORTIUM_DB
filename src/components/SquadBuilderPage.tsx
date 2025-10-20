import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Users, Trophy, Zap, Shield, Target, Swords } from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { HexagonPattern } from "./HexagonPattern";

interface PlayerCard {
  id: string;
  name: string;
  team: string;
  position: string;
  rating: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  image: string;
}

export function SquadBuilderPage() {
  const [formation, setFormation] = useState("4-3-3");
  const [squad, setSquad] = useState<{[key: string]: PlayerCard | null}>({
    GK: null,
    LB: null, CB1: null, CB2: null, RB: null,
    LM: null, CM: null, RM: null,
    LW: null, ST: null, RW: null
  });

  const myCards: PlayerCard[] = [
    {
      id: "1",
      name: "Lautaro Martínez",
      team: "Inter",
      position: "ST",
      rating: 89,
      pace: 85,
      shooting: 88,
      passing: 76,
      dribbling: 84,
      defending: 45,
      physical: 82,
      rarity: "legendary",
      image: "⚽"
    },
    {
      id: "2",
      name: "Rafael Leão",
      team: "Milan",
      position: "LW",
      rating: 87,
      pace: 93,
      shooting: 78,
      passing: 75,
      dribbling: 88,
      defending: 38,
      physical: 76,
      rarity: "epic",
      image: "🔥"
    },
    {
      id: "3",
      name: "Nicolò Barella",
      team: "Inter",
      position: "CM",
      rating: 86,
      pace: 78,
      shooting: 74,
      passing: 83,
      dribbling: 82,
      defending: 72,
      physical: 78,
      rarity: "epic",
      image: "⭐"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-500/30 to-orange-500/30 border-yellow-500/50";
      case "epic":
        return "from-purple-500/30 to-pink-500/30 border-purple-500/50";
      case "rare":
        return "from-blue-500/30 to-cyan-500/30 border-blue-500/50";
      default:
        return "from-[#2B2F3A] to-[#111318] border-white/10";
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "Leggendaria";
      case "epic":
        return "Epica";
      case "rare":
        return "Rara";
      default:
        return "Comune";
    }
  };

  const getSquadRating = () => {
    const filledPositions = Object.values(squad).filter(p => p !== null) as PlayerCard[];
    if (filledPositions.length === 0) return 0;
    const total = filledPositions.reduce((sum, p) => sum + p.rating, 0);
    return Math.round(total / filledPositions.length);
  };

  const getSquadChemistry = () => {
    // Simplified chemistry calculation
    const filledPositions = Object.values(squad).filter(p => p !== null) as PlayerCard[];
    if (filledPositions.length < 2) return 0;
    
    let chemistry = 0;
    const teams = filledPositions.map(p => p.team);
    const teamCounts: {[key: string]: number} = {};
    
    teams.forEach(team => {
      teamCounts[team] = (teamCounts[team] || 0) + 1;
    });
    
    // Bonus for same team players
    Object.values(teamCounts).forEach(count => {
      if (count >= 3) chemistry += 20;
      else if (count >= 2) chemistry += 10;
    });
    
    return Math.min(100, chemistry);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1574629810360-7efbbe195018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHRlYW0lMjBmb3JtYXRpb258ZW58MXx8fHwxNzU5ODYzMzM1fDA&ixlib=rb-4.1.0&q=80&w=1080"
        title="Squad Builder"
        subtitle="Crea la tua formazione ultimate con le card NFT collezionate"
        badge="ULTIMATE TEAM"
        height="small"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Squad Stats */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6 bg-[#111318] border-white/10 space-y-4">
            <h3 className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#A7FF1A]" />
              La Mia Squadra
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#2B2F3A] rounded-lg">
                <span className="text-[#A9AFBC]">Overall</span>
                <span className="text-2xl text-[#A7FF1A]">{getSquadRating()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#2B2F3A] rounded-lg">
                <span className="text-[#A9AFBC]">Chimica</span>
                <span className="text-2xl text-[#00E0FF]">{getSquadChemistry()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#2B2F3A] rounded-lg">
                <span className="text-[#A9AFBC]">Giocatori</span>
                <span className="text-2xl text-white">
                  {Object.values(squad).filter(p => p !== null).length}/11
                </span>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-[#A7FF1A] to-[#00E0FF] text-[#0A1020] hover:opacity-90">
              <Swords className="w-4 h-4 mr-2" />
              Sfida Altri Squad
            </Button>
          </Card>

          {/* Formation Selector */}
          <Card className="p-6 bg-[#111318] border-white/10">
            <h4 className="text-white mb-4">Formazione</h4>
            <div className="grid grid-cols-2 gap-2">
              {["4-3-3", "4-4-2", "3-5-2", "4-2-3-1"].map((form) => (
                <button
                  key={form}
                  onClick={() => setFormation(form)}
                  className={`p-3 rounded-lg transition-all ${
                    formation === form
                      ? "bg-[#A7FF1A] text-[#0A1020]"
                      : "bg-[#2B2F3A] text-[#A9AFBC] hover:bg-[#3B3F4A]"
                  }`}
                >
                  {form}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Formation Field */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-gradient-to-br from-green-900/20 via-green-800/10 to-green-900/20 border-white/10 min-h-[600px] relative overflow-hidden">
            <HexagonPattern opacity={0.03} />
            
            {/* Field Lines */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
              <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Formation Positions */}
            <div className="relative h-full flex flex-col justify-between py-8">
              {/* Goalkeeper */}
              <div className="flex justify-center">
                <PositionSlot position="GK" player={squad.GK} />
              </div>

              {/* Defense */}
              <div className="flex justify-around px-8">
                <PositionSlot position="LB" player={squad.LB} />
                <PositionSlot position="CB1" player={squad.CB1} />
                <PositionSlot position="CB2" player={squad.CB2} />
                <PositionSlot position="RB" player={squad.RB} />
              </div>

              {/* Midfield */}
              <div className="flex justify-around px-12">
                <PositionSlot position="LM" player={squad.LM} />
                <PositionSlot position="CM" player={squad.CM} />
                <PositionSlot position="RM" player={squad.RM} />
              </div>

              {/* Attack */}
              <div className="flex justify-around px-8">
                <PositionSlot position="LW" player={squad.LW} />
                <PositionSlot position="ST" player={squad.ST} />
                <PositionSlot position="RW" player={squad.RW} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* My Cards */}
      <div className="space-y-4">
        <h3 className="text-xl text-white">Le Mie Card</h3>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-[#2B2F3A] border-white/10">
            <TabsTrigger value="all">Tutte</TabsTrigger>
            <TabsTrigger value="legendary">Leggendarie</TabsTrigger>
            <TabsTrigger value="epic">Epiche</TabsTrigger>
            <TabsTrigger value="rare">Rare</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {myCards.map((card) => (
              <PlayerCardComponent key={card.id} card={card} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PositionSlot({ position, player }: { position: string; player: PlayerCard | null }) {
  return (
    <div className="relative group cursor-pointer">
      <div className={`w-20 h-28 rounded-lg flex flex-col items-center justify-center border-2 transition-all ${
        player 
          ? "bg-gradient-to-br from-[#A7FF1A]/20 to-transparent border-[#A7FF1A]/50 hover:border-[#A7FF1A]" 
          : "bg-[#2B2F3A]/50 border-dashed border-white/20 hover:border-[#A7FF1A]/50"
      }`}>
        {player ? (
          <>
            <div className="text-3xl mb-1">{player.image}</div>
            <div className="text-xs text-white text-center px-1">{player.name.split(' ').pop()}</div>
            <div className="text-lg text-[#A7FF1A]">{player.rating}</div>
          </>
        ) : (
          <>
            <div className="text-xs text-[#A9AFBC]">{position}</div>
            <div className="text-2xl text-[#A9AFBC]/30">+</div>
          </>
        )}
      </div>
    </div>
  );
}

function PlayerCardComponent({ card }: { card: PlayerCard }) {
  const rarityColors = {
    legendary: "from-yellow-500/30 to-orange-500/30 border-yellow-500/50",
    epic: "from-purple-500/30 to-pink-500/30 border-purple-500/50",
    rare: "from-blue-500/30 to-cyan-500/30 border-blue-500/50",
    common: "from-[#2B2F3A] to-[#111318] border-white/10"
  };

  return (
    <Card className={`p-4 bg-gradient-to-br ${rarityColors[card.rarity]} border-2 cursor-pointer hover:scale-105 transition-transform`}>
      <div className="text-center space-y-2">
        <Badge className="text-xs mb-2">{card.position}</Badge>
        <div className="text-4xl">{card.image}</div>
        <div>
          <div className="text-2xl text-[#A7FF1A] mb-1">{card.rating}</div>
          <div className="text-sm text-white truncate">{card.name}</div>
          <div className="text-xs text-[#A9AFBC]">{card.team}</div>
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="text-[#A9AFBC]">PAC {card.pace}</div>
          <div className="text-[#A9AFBC]">SHO {card.shooting}</div>
          <div className="text-[#A9AFBC]">PAS {card.passing}</div>
          <div className="text-[#A9AFBC]">DRI {card.dribbling}</div>
        </div>
      </div>
    </Card>
  );
}
