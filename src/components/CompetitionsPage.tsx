import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Trophy, 
  Star, 
  Search, 
  Plus,
  Check,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Target,
  Flame,
  Award,
  Shield,
  Zap,
  Crown,
  Heart,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { HexagonPattern } from "./HexagonPattern";

interface Team {
  id: string;
  name: string;
  logo: string;
  sport: string;
  league: string;
  isPartner: boolean;
  followers: number;
  upcomingMatches: number;
}

interface Athlete {
  id: string;
  name: string;
  avatar: string;
  sport: string;
  ranking: number;
  country: string;
  isPartner: boolean;
  followers: number;
}

interface Competition {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  sport: string;
  league: string;
  date: string;
  time: string;
  odds: { home: number; draw?: number; away: number };
  predictionsCount: number;
  prize: number;
  isLive?: boolean;
  isFeatured?: boolean;
}

export function CompetitionsPage() {
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [followedTeams, setFollowedTeams] = useState<Set<string>>(new Set(["1", "3"]));
  const [followedAthletes, setFollowedAthletes] = useState<Set<string>>(new Set(["1"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const sports = [
    { id: "all", name: "Tutti", icon: "⚡", color: "text-[#A7FF1A]" },
    { id: "football", name: "Calcio", icon: "⚽", color: "text-green-400" },
    { id: "tennis", name: "Tennis", icon: "🎾", color: "text-yellow-400" },
    { id: "basketball", name: "Basket", icon: "🏀", color: "text-orange-400" },
    { id: "f1", name: "Formula 1", icon: "🏎️", color: "text-red-400" },
    { id: "mma", name: "MMA/UFC", icon: "🥊", color: "text-purple-400" },
    { id: "volleyball", name: "Volley", icon: "🏐", color: "text-blue-400" },
  ];

  const teams: Team[] = [
    {
      id: "1",
      name: "Inter Milano",
      logo: "⚫🔵",
      sport: "football",
      league: "Serie A",
      isPartner: true,
      followers: 45230,
      upcomingMatches: 3
    },
    {
      id: "2",
      name: "AC Milan",
      logo: "🔴⚫",
      sport: "football",
      league: "Serie A",
      isPartner: true,
      followers: 42100,
      upcomingMatches: 3
    },
    {
      id: "3",
      name: "Juventus",
      logo: "⚪⚫",
      sport: "football",
      league: "Serie A",
      isPartner: true,
      followers: 48900,
      upcomingMatches: 2
    },
    {
      id: "4",
      name: "Olimpia Milano",
      logo: "🔴⚪",
      sport: "basketball",
      league: "Lega Basket",
      isPartner: true,
      followers: 12500,
      upcomingMatches: 2
    },
    {
      id: "5",
      name: "Virtus Bologna",
      logo: "⚫⚪",
      sport: "basketball",
      league: "Lega Basket",
      isPartner: false,
      followers: 10200,
      upcomingMatches: 2
    },
    {
      id: "6",
      name: "Cucine Lube",
      logo: "🔴⚪",
      sport: "volleyball",
      league: "SuperLega",
      isPartner: true,
      followers: 8500,
      upcomingMatches: 1
    },
  ];

  const athletes: Athlete[] = [
    {
      id: "1",
      name: "Jannik Sinner",
      avatar: "🎾",
      sport: "tennis",
      ranking: 1,
      country: "🇮🇹",
      isPartner: true,
      followers: 67800
    },
    {
      id: "2",
      name: "Carlos Sainz",
      avatar: "🏎️",
      sport: "f1",
      ranking: 3,
      country: "🇪🇸",
      isPartner: false,
      followers: 89400
    },
    {
      id: "3",
      name: "Marvin Vettori",
      avatar: "🥊",
      sport: "mma",
      ranking: 8,
      country: "🇮🇹",
      isPartner: true,
      followers: 34200
    },
    {
      id: "4",
      name: "Matteo Berrettini",
      avatar: "🎾",
      sport: "tennis",
      ranking: 12,
      country: "🇮🇹",
      isPartner: false,
      followers: 45600
    },
  ];

  const competitions: Competition[] = [
    {
      id: "1",
      homeTeam: "Inter Milano",
      awayTeam: "AC Milan",
      homeLogo: "⚫🔵",
      awayLogo: "🔴⚫",
      sport: "football",
      league: "Serie A",
      date: "Oggi",
      time: "20:45",
      odds: { home: 2.10, draw: 3.20, away: 3.50 },
      predictionsCount: 12450,
      prize: 5000,
      isLive: false,
      isFeatured: true
    },
    {
      id: "2",
      homeTeam: "Jannik Sinner",
      awayTeam: "Carlos Alcaraz",
      homeLogo: "🎾",
      awayLogo: "🎾",
      sport: "tennis",
      league: "ATP Finals",
      date: "Domani",
      time: "15:00",
      odds: { home: 1.85, away: 2.05 },
      predictionsCount: 8920,
      prize: 3000,
      isLive: false,
      isFeatured: true
    },
    {
      id: "3",
      homeTeam: "Olimpia Milano",
      awayTeam: "Virtus Bologna",
      homeLogo: "🔴⚪",
      awayLogo: "⚫⚪",
      sport: "basketball",
      league: "Lega Basket",
      date: "Oggi",
      time: "18:30",
      odds: { home: 1.65, away: 2.30 },
      predictionsCount: 3450,
      prize: 2000,
      isLive: true,
      isFeatured: false
    },
    {
      id: "4",
      homeTeam: "Ferrari",
      awayTeam: "GP Abu Dhabi",
      homeLogo: "🏎️",
      awayLogo: "🏁",
      sport: "f1",
      league: "Formula 1",
      date: "Domenica",
      time: "14:00",
      odds: { home: 3.20, away: 1.95 },
      predictionsCount: 15670,
      prize: 8000,
      isLive: false,
      isFeatured: true
    },
  ];

  const toggleFollowTeam = (teamId: string) => {
    const newFollowed = new Set(followedTeams);
    if (newFollowed.has(teamId)) {
      newFollowed.delete(teamId);
    } else {
      newFollowed.add(teamId);
    }
    setFollowedTeams(newFollowed);
  };

  const toggleFollowAthlete = (athleteId: string) => {
    const newFollowed = new Set(followedAthletes);
    if (newFollowed.has(athleteId)) {
      newFollowed.delete(athleteId);
    } else {
      newFollowed.add(athleteId);
    }
    setFollowedAthletes(newFollowed);
  };

  const filteredTeams = teams.filter(team => 
    (selectedSport === "all" || team.sport === selectedSport) &&
    (searchQuery === "" || team.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAthletes = athletes.filter(athlete => 
    (selectedSport === "all" || athlete.sport === selectedSport) &&
    (searchQuery === "" || athlete.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCompetitions = competitions.filter(comp =>
    selectedSport === "all" || comp.sport === selectedSport
  );

  const partnerTeams = teams.filter(t => t.isPartner);
  const partnerAthletes = athletes.filter(a => a.isPartner);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        title="Competizioni"
        subtitle="Segui le tue squadre e atleti preferiti, fai pronostici e vinci premi"
        badge="MULTI-SPORT"
      />

      {/* Sport Selector */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-3 min-w-max pb-2">
          {sports.map((sport) => (
            <motion.button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                selectedSport === sport.id
                  ? "bg-[#A7FF1A]/10 border-[#A7FF1A] text-[#A7FF1A]"
                  : "bg-[#111318] border-white/10 text-white hover:border-white/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">{sport.icon}</span>
              <span>{sport.name}</span>
              {selectedSport === sport.id && <Check className="w-4 h-4" />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#2B2F3A] border-white/10 w-full grid grid-cols-4">
          <TabsTrigger value="overview">
            <Trophy className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Panoramica</span>
            <span className="md:hidden">Home</span>
          </TabsTrigger>
          <TabsTrigger value="teams">
            <Shield className="w-4 h-4 mr-2" />
            Squadre
          </TabsTrigger>
          <TabsTrigger value="athletes">
            <Star className="w-4 h-4 mr-2" />
            Atleti
          </TabsTrigger>
          <TabsTrigger value="partners">
            <Crown className="w-4 h-4 mr-2" />
            Partner
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* My Followed Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400 fill-current" />
                Le Mie Preferenze
              </h2>
              <Badge className="bg-[#A7FF1A]/20 text-[#A7FF1A] border-[#A7FF1A]/30 border">
                {followedTeams.size + followedAthletes.size} Seguite
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Followed Teams */}
              <Card className="p-4 bg-[#111318] border-white/10">
                <h4 className="text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#00E0FF]" />
                  Squadre Seguite ({followedTeams.size})
                </h4>
                <div className="space-y-2">
                  {teams.filter(t => followedTeams.has(t.id)).slice(0, 3).map(team => (
                    <div key={team.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{team.logo}</span>
                        <div>
                          <div className="text-sm text-white">{team.name}</div>
                          <div className="text-xs text-[#A9AFBC]">{team.upcomingMatches} prossime</div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
                        Attiva
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Followed Athletes */}
              <Card className="p-4 bg-[#111318] border-white/10">
                <h4 className="text-white mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Atleti Seguiti ({followedAthletes.size})
                </h4>
                <div className="space-y-2">
                  {athletes.filter(a => followedAthletes.has(a.id)).slice(0, 3).map(athlete => (
                    <div key={athlete.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{athlete.avatar}</span>
                        <div>
                          <div className="text-sm text-white">{athlete.name}</div>
                          <div className="text-xs text-[#A9AFBC]">Ranking #{athlete.ranking}</div>
                        </div>
                      </div>
                      <span className="text-xl">{athlete.country}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Featured Competitions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                Competizioni in Evidenza
              </h2>
              <Button variant="ghost" size="sm" className="text-[#A7FF1A]">
                Vedi Tutte
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCompetitions.filter(c => c.isFeatured).map((comp, idx) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`p-6 bg-gradient-to-br ${
                    comp.isLive 
                      ? "from-red-500/20 to-orange-500/20 border-red-500/50" 
                      : "from-[#A7FF1A]/5 to-transparent border-[#A7FF1A]/20"
                  } border-2 relative overflow-hidden hover:border-[#A7FF1A]/50 transition-all cursor-pointer`}>
                    <HexagonPattern opacity={0.03} />
                    
                    <div className="relative space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="bg-[#00E0FF]/20 text-[#00E0FF] border-[#00E0FF]/30 border mb-2">
                            {comp.league}
                          </Badge>
                          {comp.isLive && (
                            <Badge className="bg-red-500 text-white border-red-500 ml-2 animate-pulse">
                              🔴 LIVE
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-[#A9AFBC]">{comp.date}</div>
                          <div className="text-white">{comp.time}</div>
                        </div>
                      </div>

                      {/* Teams */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 text-center">
                          <div className="text-4xl mb-2">{comp.homeLogo}</div>
                          <div className="text-white">{comp.homeTeam}</div>
                          {comp.odds.draw ? (
                            <Badge className="mt-2 bg-white/10 text-white border-white/20 border">
                              {comp.odds.home}x
                            </Badge>
                          ) : (
                            <Badge className="mt-2 bg-[#A7FF1A]/20 text-[#A7FF1A] border-[#A7FF1A]/30 border">
                              {comp.odds.home}
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <div className="text-2xl text-[#A9AFBC]">VS</div>
                          {comp.odds.draw && (
                            <Badge className="bg-white/10 text-white border-white/20 border">
                              X {comp.odds.draw}
                            </Badge>
                          )}
                        </div>

                        <div className="flex-1 text-center">
                          <div className="text-4xl mb-2">{comp.awayLogo}</div>
                          <div className="text-white">{comp.awayTeam}</div>
                          {comp.odds.draw ? (
                            <Badge className="mt-2 bg-white/10 text-white border-white/20 border">
                              {comp.odds.away}x
                            </Badge>
                          ) : (
                            <Badge className="mt-2 bg-[#A7FF1A]/20 text-[#A7FF1A] border-[#A7FF1A]/30 border">
                              {comp.odds.away}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4 text-sm text-[#A9AFBC]">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {comp.predictionsCount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            {comp.prize.toLocaleString()} FP
                          </span>
                        </div>
                        <Button size="sm" className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]">
                          <Target className="w-4 h-4 mr-2" />
                          Pronostica
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Competitions */}
          <div className="space-y-4">
            <h3 className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00E0FF]" />
              Tutte le Competizioni
            </h3>
            
            <div className="space-y-3">
              {filteredCompetitions.filter(c => !c.isFeatured).map((comp) => (
                <Card key={comp.id} className="p-4 bg-[#111318] border-white/10 hover:border-[#A7FF1A]/50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-center">
                        <div className="text-xs text-[#A9AFBC] mb-1">{comp.date}</div>
                        <div className="text-sm text-white">{comp.time}</div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xl">{comp.homeLogo}</span>
                        <span className="text-white text-sm">{comp.homeTeam}</span>
                        <span className="text-[#A9AFBC] mx-2">vs</span>
                        <span className="text-xl">{comp.awayLogo}</span>
                        <span className="text-white text-sm">{comp.awayTeam}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className="bg-[#00E0FF]/20 text-[#00E0FF] border-[#00E0FF]/30 border text-xs">
                        {comp.league}
                      </Badge>
                      <Button size="sm" variant="outline" className="border-[#A7FF1A]/30 text-[#A7FF1A]">
                        Pronostica
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A9AFBC]" />
            <Input
              placeholder="Cerca squadra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2B2F3A] border-white/10 text-white"
            />
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team, idx) => {
              const isFollowed = followedTeams.has(team.id);
              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className={`p-6 bg-[#111318] border-2 ${
                    isFollowed ? "border-[#A7FF1A]/50" : "border-white/10"
                  } hover:border-[#A7FF1A]/50 transition-all relative overflow-hidden`}>
                    {team.isPartner && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Partner
                        </Badge>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-6xl mb-3">{team.logo}</div>
                        <h3 className="text-white mb-1">{team.name}</h3>
                        <Badge className="bg-[#00E0FF]/20 text-[#00E0FF] border-[#00E0FF]/30 border">
                          {team.league}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10">
                        <div className="text-center">
                          <div className="text-xs text-[#A9AFBC] mb-1">Followers</div>
                          <div className="text-white flex items-center justify-center gap-1">
                            <Users className="w-4 h-4" />
                            {(team.followers / 1000).toFixed(1)}K
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[#A9AFBC] mb-1">Prossime</div>
                          <div className="text-white flex items-center justify-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {team.upcomingMatches}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => toggleFollowTeam(team.id)}
                        className={`w-full ${
                          isFollowed
                            ? "bg-[#A7FF1A]/20 hover:bg-[#A7FF1A]/30 text-[#A7FF1A] border-2 border-[#A7FF1A]/50"
                            : "bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
                        }`}
                      >
                        {isFollowed ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Seguita
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Segui
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Athletes Tab */}
        <TabsContent value="athletes" className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A9AFBC]" />
            <Input
              placeholder="Cerca atleta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2B2F3A] border-white/10 text-white"
            />
          </div>

          {/* Athletes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAthletes.map((athlete, idx) => {
              const isFollowed = followedAthletes.has(athlete.id);
              return (
                <motion.div
                  key={athlete.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className={`p-6 bg-[#111318] border-2 ${
                    isFollowed ? "border-yellow-500/50" : "border-white/10"
                  } hover:border-yellow-500/50 transition-all relative overflow-hidden`}>
                    {athlete.isPartner && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Partner
                        </Badge>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-6xl mb-3">{athlete.avatar}</div>
                        <h3 className="text-white mb-1">{athlete.name}</h3>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl">{athlete.country}</span>
                          <Badge className={`${
                            athlete.ranking <= 3
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-[#00E0FF]/20 text-[#00E0FF] border-[#00E0FF]/30"
                          } border`}>
                            #{athlete.ranking}
                          </Badge>
                        </div>
                      </div>

                      <div className="py-3 border-y border-white/10 text-center">
                        <div className="text-xs text-[#A9AFBC] mb-1">Followers</div>
                        <div className="text-white flex items-center justify-center gap-1">
                          <Users className="w-4 h-4" />
                          {(athlete.followers / 1000).toFixed(1)}K
                        </div>
                      </div>

                      <Button
                        onClick={() => toggleFollowAthlete(athlete.id)}
                        className={`w-full ${
                          isFollowed
                            ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-2 border-yellow-500/50"
                            : "bg-yellow-500 hover:bg-yellow-600 text-[#0A1020]"
                        }`}
                      >
                        {isFollowed ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Seguito
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            Segui
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 border-2">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white mb-2">Partner SPORTIUM</h3>
                <p className="text-[#A9AFBC] mb-4">
                  Squadre e atleti ufficialmente affiliati alla piattaforma SPORTIUM. 
                  Seguili per contenuti esclusivi, pronostici speciali e premi bonus!
                </p>
                <div className="flex gap-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border">
                    Contenuti Esclusivi
                  </Badge>
                  <Badge className="bg-[#A7FF1A]/20 text-[#A7FF1A] border-[#A7FF1A]/30 border">
                    Bonus +50% FP
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 border">
                    Premi VIP
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Partner Teams */}
          <div className="space-y-4">
            <h3 className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00E0FF]" />
              Squadre Partner ({partnerTeams.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partnerTeams.map((team) => {
                const isFollowed = followedTeams.has(team.id);
                return (
                  <Card key={team.id} className="p-4 bg-gradient-to-r from-yellow-500/5 to-transparent border-yellow-500/30 border-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{team.logo}</span>
                        <div>
                          <div className="text-white flex items-center gap-2">
                            {team.name}
                            <Crown className="w-4 h-4 text-yellow-400" />
                          </div>
                          <div className="text-sm text-[#A9AFBC]">{team.league}</div>
                          <div className="flex gap-2 mt-1">
                            <Badge className="bg-[#A7FF1A]/20 text-[#A7FF1A] border-[#A7FF1A]/30 border text-xs">
                              +50% Bonus
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => toggleFollowTeam(team.id)}
                        className={isFollowed 
                          ? "bg-[#A7FF1A]/20 text-[#A7FF1A] border-2 border-[#A7FF1A]/50"
                          : "bg-[#A7FF1A] text-[#0A1020]"
                        }
                      >
                        {isFollowed ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Partner Athletes */}
          <div className="space-y-4">
            <h3 className="text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Atleti Partner ({partnerAthletes.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partnerAthletes.map((athlete) => {
                const isFollowed = followedAthletes.has(athlete.id);
                return (
                  <Card key={athlete.id} className="p-4 bg-gradient-to-r from-yellow-500/5 to-transparent border-yellow-500/30 border-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{athlete.avatar}</span>
                        <div>
                          <div className="text-white flex items-center gap-2">
                            {athlete.name}
                            <span className="text-lg">{athlete.country}</span>
                            <Crown className="w-4 h-4 text-yellow-400" />
                          </div>
                          <div className="text-sm text-[#A9AFBC]">Ranking #{athlete.ranking}</div>
                          <div className="flex gap-2 mt-1">
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 border text-xs">
                              Meet & Greet
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => toggleFollowAthlete(athlete.id)}
                        className={isFollowed 
                          ? "bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/50"
                          : "bg-yellow-500 text-[#0A1020]"
                        }
                      >
                        {isFollowed ? <Check className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Partner Benefits */}
          <Card className="p-6 bg-[#111318] border-white/10">
            <h3 className="text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#A7FF1A]" />
              Vantaggi Partner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#A7FF1A]/10 border border-[#A7FF1A]/30">
                <Zap className="w-8 h-8 text-[#A7FF1A] mb-2" />
                <h4 className="text-white mb-1">Bonus Pronostici</h4>
                <p className="text-sm text-[#A9AFBC]">+50% Fans Points su tutte le predizioni vincenti</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <Award className="w-8 h-8 text-purple-400 mb-2" />
                <h4 className="text-white mb-1">Premi Esclusivi</h4>
                <p className="text-sm text-[#A9AFBC]">Accesso a aste VIP e meet & greet riservati</p>
              </div>
              <div className="p-4 rounded-lg bg-[#00E0FF]/10 border border-[#00E0FF]/30">
                <TrendingUp className="w-8 h-8 text-[#00E0FF] mb-2" />
                <h4 className="text-white mb-1">Contenuti Premium</h4>
                <p className="text-sm text-[#A9AFBC]">Statistiche avanzate e insights dagli atleti</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
