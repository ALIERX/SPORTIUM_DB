import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./utils/supabase/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { auctionMonitor } from "./utils/supabase/auctionMonitor";
import { Header } from "./components/Header";
import { MobileNav } from "./components/MobileNav";
import { DesktopNav } from "./components/DesktopNav";
import { HomePage } from "./components/HomePage";
import { PointsShopPage } from "./components/PointsShopPage";
import { CompetitionsPage } from "./components/CompetitionsPage";
import { QuizPage } from "./components/QuizPage";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { ProfilePage } from "./components/ProfilePage";
import { RewardsPage } from "./components/RewardsPage";
import { NoiseMeterPage } from "./components/NoiseMeterPage";
import { DailyChallengesPage } from "./components/DailyChallengesPage";
import { SpinWheelPage } from "./components/SpinWheelPage";
import { SquadBuilderPage } from "./components/SquadBuilderPage";
import { TeamBattlesPage } from "./components/TeamBattlesPage";
import { WatchPartyPage } from "./components/WatchPartyPage";
import { ReferralPage } from "./components/ReferralPage";
import { AchievementsPage } from "./components/AchievementsPage";
import { BattlePassPage } from "./components/BattlePassPage";
import { BracketPage } from "./components/BracketPage";
import { AuctionsPage } from "./components/AuctionsPage";
import { AuctionDetailPage } from "./components/AuctionDetailPage";
import { CheckoutModal } from "./components/CheckoutModal";
import { DebugPanel } from "./components/DebugPanel";
import { AdminPage } from "./components/AdminPageEnhanced";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { PartnerDashboard } from "./components/PartnerDashboard";

function AppContent() {
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  
  // Check admin auth on mount
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('sportium_admin_auth');
    if (adminAuth === 'true') {
      setIsAdminAuthed(true);
    }
  }, []);
  const { wallet, refreshWallet, profile } = useAuth();
  const [currentTab, setCurrentTab] = useState("home");
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
  const [userStreak, setUserStreak] = useState(12); // Streak days
  const [streakMultiplier, setStreakMultiplier] = useState(1.2); // Multiplier based on streak
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // Start auction monitor on app mount
  useEffect(() => {
    auctionMonitor.start();
    return () => auctionMonitor.stop();
  }, []);
  
  const handleBuyPoints = () => {
    setCurrentTab("shop");
  };
  
  const handlePurchasePackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsCheckoutOpen(true);
  };
  
  const handleCheckoutClose = async () => {
    setIsCheckoutOpen(false);
    // Refresh wallet after successful purchase
    await refreshWallet();
  };

  const handleViewAuction = (auctionId: string) => {
    setSelectedAuctionId(auctionId);
    setCurrentTab("auction-detail");
  };

  const handleBackToAuctions = () => {
    setSelectedAuctionId(null);
    setCurrentTab("auctions");
  };

  const handleAdminAccess = () => {
    if (isAdminAuthed) {
      setCurrentTab("admin");
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthed(true);
    setCurrentTab("admin");
  };
  
  const renderContent = () => {
    switch (currentTab) {
      case "home":
        return <HomePage onNavigate={setCurrentTab} onBuyPoints={handleBuyPoints} />;
      case "shop":
        return <PointsShopPage onPurchase={handlePurchasePackage} />;
      case "competitions":
        return <CompetitionsPage />;
      case "quiz":
        return <QuizPage />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "profile":
        return <ProfilePage onNavigate={setCurrentTab} />;
      case "rewards":
        return <RewardsPage />;
      case "noisemeter":
        return <NoiseMeterPage />;
      case "challenges":
        return <DailyChallengesPage />;
      case "spinwheel":
        return <SpinWheelPage />;
      case "squad":
        return <SquadBuilderPage />;
      case "teambattles":
        return <TeamBattlesPage />;
      case "watchparty":
        return <WatchPartyPage />;
      case "referral":
        return <ReferralPage />;
      case "achievements":
        return <AchievementsPage />;
      case "battlepass":
        return <BattlePassPage />;
      case "bracket":
        return <BracketPage />;
      case "auctions":
        return <AuctionsPage onViewAuction={handleViewAuction} />;
      case "auction-detail":
        return selectedAuctionId ? (
          <AuctionDetailPage 
            auctionId={selectedAuctionId}
            onBack={handleBackToAuctions}
          />
        ) : (
          <AuctionsPage onViewAuction={handleViewAuction} />
        );
      case "admin":
        return isAdminAuthed ? (
          <AdminPage />
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Accesso non autorizzato</p>
          </div>
        );
      case "partner":
        return profile?.role === 'partner' || profile?.role === 'admin' ? (
          <PartnerDashboard />
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Accesso riservato ai partner</p>
          </div>
        );
      default:
        return <HomePage onNavigate={setCurrentTab} onBuyPoints={handleBuyPoints} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0A1020] dark">
      {/* Desktop Navigation */}
      <DesktopNav 
        currentTab={currentTab} 
        onTabChange={setCurrentTab}
        onBuyPoints={handleBuyPoints}
      />
      
      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <Header 
          onBuyPoints={handleBuyPoints}
          onNavigate={setCurrentTab}
          showLogo={true}
          userStreak={userStreak}
          streakMultiplier={streakMultiplier}
        />
        
        {/* Page Content */}
        <main className="container mx-auto px-4 py-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav currentTab={currentTab} onTabChange={setCurrentTab} />
      
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCheckoutClose}
        package={selectedPackage}
        currentBalance={wallet?.balance_points || 0}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />
      
      {/* Toast Notifications */}
      <Toaster position="top-right" />
      
      {/* Debug Panel - Remove in production */}
      <DebugPanel />

      {/* Admin Access Button (Hidden - Double click logo to access) */}
      <div
        className="fixed bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity"
        onDoubleClick={handleAdminAccess}
        style={{ width: '40px', height: '40px', cursor: 'pointer' }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}