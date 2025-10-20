import { useState } from "react";
import { Home, Trophy, Brain, MoreHorizontal, User, Target, Sparkles, Users, Swords, Video, UserPlus, Crown, Zap, Award, Gift, Volume2, TrendingUp, Gavel, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";

interface MobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileNav({ currentTab, onTabChange }: MobileNavProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "shop", label: "Store", icon: ShoppingBag },
    { id: "competitions", label: "Competizioni", icon: Trophy },
    { id: "profile", label: "Profilo", icon: User },
  ];

  const moreTabs = {
    games: [
      { id: "quiz", label: "Quiz", icon: Brain },
      { id: "challenges", label: "Sfide", icon: Target },
      { id: "spinwheel", label: "Ruota", icon: Sparkles },
      { id: "squad", label: "Squad", icon: Users },
      { id: "teambattles", label: "Team Battles", icon: Swords },
      { id: "bracket", label: "Bracket", icon: TrendingUp },
      { id: "noisemeter", label: "Noise Meter", icon: Volume2 },
    ],
    social: [
      { id: "watchparty", label: "Watch Party", icon: Video },
      { id: "referral", label: "Invita Amici", icon: UserPlus },
    ],
    rewards: [
      { id: "auctions", label: "Aste", icon: Gavel },
      { id: "rewards", label: "Premi", icon: Gift },
    ],
    progress: [
      { id: "battlepass", label: "Battle Pass", icon: Crown },
      { id: "achievements", label: "Achievement", icon: Zap },
      { id: "leaderboard", label: "Classifica", icon: Award },
    ]
  };

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setIsSheetOpen(false);
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#111318] border-t border-white/10 backdrop-blur-lg z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive 
                  ? "text-[#A7FF1A]" 
                  : "text-[#A9AFBC] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A7FF1A] glow-neon" />
              )}
            </button>
          );
        })}

        {/* More Menu */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-1 text-[#A9AFBC] hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-xs">Altro</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-[#111318] border-t border-white/10 max-h-[80vh] overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-white">Tutte le Funzionalità</SheetTitle>
            </SheetHeader>

            <div className="space-y-6">
              {/* Games */}
              <div className="space-y-2">
                <div className="text-xs text-[#A9AFBC] px-3 mb-3">GIOCHI</div>
                <div className="grid grid-cols-2 gap-2">
                  {moreTabs.games.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-[#A7FF1A]/10 text-[#A7FF1A] border border-[#A7FF1A]/30"
                            : "bg-[#2B2F3A] text-[#A9AFBC] hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Social */}
              <div className="space-y-2">
                <div className="text-xs text-[#A9AFBC] px-3 mb-3">SOCIAL</div>
                <div className="grid grid-cols-2 gap-2">
                  {moreTabs.social.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-[#A7FF1A]/10 text-[#A7FF1A] border border-[#A7FF1A]/30"
                            : "bg-[#2B2F3A] text-[#A9AFBC] hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Rewards */}
              <div className="space-y-2">
                <div className="text-xs text-[#A9AFBC] px-3 mb-3">RICOMPENSE</div>
                <div className="grid grid-cols-2 gap-2">
                  {moreTabs.rewards.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-[#A7FF1A]/10 text-[#A7FF1A] border border-[#A7FF1A]/30"
                            : "bg-[#2B2F3A] text-[#A9AFBC] hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Progress */}
              <div className="space-y-2">
                <div className="text-xs text-[#A9AFBC] px-3 mb-3">PROGRESSI</div>
                <div className="grid grid-cols-2 gap-2">
                  {moreTabs.progress.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-[#A7FF1A]/10 text-[#A7FF1A] border border-[#A7FF1A]/30"
                            : "bg-[#2B2F3A] text-[#A9AFBC] hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}