import { Home, Trophy, Brain, Award, User, Wallet, Gift, Volume2, Target, Sparkles, Users, Swords, Video, UserPlus, Crown, Zap, TrendingUp, Gavel, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import logoImage from "figma:asset/ce7b0ec8e185fed3574ef2b6517369f59fa12071.png";

interface DesktopNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onBuyPoints: () => void;
}

export function DesktopNav({ currentTab, onTabChange, onBuyPoints }: DesktopNavProps) {
  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "shop", label: "Store", icon: ShoppingBag },
    { id: "competitions", label: "Competizioni", icon: Trophy },
    { id: "profile", label: "Profilo", icon: User },
  ];

  const gameTabs = [
    { id: "quiz", label: "Quiz", icon: Brain },
    { id: "challenges", label: "Sfide", icon: Target },
    { id: "spinwheel", label: "Ruota", icon: Sparkles },
    { id: "squad", label: "Squad", icon: Users },
    { id: "teambattles", label: "Team Battles", icon: Swords },
    { id: "bracket", label: "Bracket", icon: TrendingUp },
    { id: "noisemeter", label: "Noise Meter", icon: Volume2 },
  ];

  const socialTabs = [
    { id: "watchparty", label: "Watch Party", icon: Video },
    { id: "referral", label: "Invita Amici", icon: UserPlus },
  ];

  const rewardsTabs = [
    { id: "auctions", label: "Aste", icon: Gavel },
    { id: "rewards", label: "Premi", icon: Gift },
  ];

  const progressTabs = [
    { id: "battlepass", label: "Battle Pass", icon: Crown },
    { id: "achievements", label: "Achievement", icon: Zap },
    { id: "leaderboard", label: "Classifica", icon: Award },
  ];
  
  return (
    <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-[#111318] border-r border-white/10 flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="SPORTIUM" className="w-10 h-10" />
          <span className="text-xl text-white">SPORTIUM</span>
        </div>
      </div>
      
      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Main */}
        <div className="space-y-1">
          <div className="text-xs text-[#A9AFBC] px-3 mb-2">PRINCIPALE</div>
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                  isActive
                    ? "bg-[#A7FF1A]/10 text-[#A7FF1A] border border-[#A7FF1A]/30"
                    : "text-[#A9AFBC] hover:bg-[#2B2F3A] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <Separator className="bg-white/10" />

        {/* Game Modes */}
        <div className="space-y-1">
          <div className="text-xs text-[#A9AFBC] px-3 mb-2">GIOCHI</div>
          {gameTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                  isActive
                    ? "bg-[#A7FF1A]/10 text-[#A7FF1A] border border-[#A7FF1A]/30"
                    : "text-[#A9AFBC] hover:bg-[#2B2F3A] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <Separator className="bg-white/10" />

        {/* Social */}
        <div className="space-y-1">
          <div className="text-xs text-[#A9AFBC] px-3 mb-2">SOCIAL</div>
          {socialTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                  isActive
                    ? "bg-[#A7FF1A]/10 text-[#A7FF1A] border border-[#A7FF1A]/30"
                    : "text-[#A9AFBC] hover:bg-[#2B2F3A] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <Separator className="bg-white/10" />

        {/* Rewards */}
        <div className="space-y-1">
          <div className="text-xs text-[#A9AFBC] px-3 mb-2">RICOMPENSE</div>
          {rewardsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                  isActive
                    ? "bg-[#A7FF1A]/10 text-[#A7FF1A] border border-[#A7FF1A]/30"
                    : "text-[#A9AFBC] hover:bg-[#2B2F3A] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <Separator className="bg-white/10" />

        {/* Progress */}
        <div className="space-y-1">
          <div className="text-xs text-[#A9AFBC] px-3 mb-2">PROGRESSI</div>
          {progressTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                  isActive
                    ? "bg-[#A7FF1A]/10 text-[#A7FF1A] border border-[#A7FF1A]/30"
                    : "text-[#A9AFBC] hover:bg-[#2B2F3A] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
      
      {/* CTA Button */}
      <div className="p-4 border-t border-white/10">
        <Button 
          onClick={onBuyPoints}
          className="w-full bg-[#A7FF1A] hover:bg-[#8FE515] text-[#0A1020] glow-neon"
        >
          <Wallet className="w-5 h-5 mr-2" />
          Compra Fans Points
        </Button>
      </div>
    </nav>
  );
}