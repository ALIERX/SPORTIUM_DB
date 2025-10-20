import { PointsPackageCard } from "./PointsPackageCard";
import { Info } from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { HeroBanner } from "./HeroBanner";

interface PointsShopPageProps {
  onPurchase: (pkg: any) => void;
}

export function PointsShopPage({ onPurchase }: PointsShopPageProps) {
  // Data from point_packages table
  const packages = [
    {
      id: "pkg_100",
      points: 100,
      price: 0.89,
      listPrice: 0.99,
      tag: undefined,
    },
    {
      id: "pkg_500",
      points: 500,
      price: 4.04,
      listPrice: 4.49,
      tag: undefined,
    },
    {
      id: "pkg_1050",
      points: 1050,
      price: 8.09,
      listPrice: 8.99,
      tag: "MOST POPULAR" as const,
      isPopular: true,
    },
    {
      id: "pkg_1600",
      points: 1600,
      price: 12.14,
      listPrice: 13.49,
      tag: undefined,
    },
    {
      id: "pkg_2800",
      points: 2800,
      price: 19.79,
      listPrice: 21.99,
      tag: undefined,
    },
    {
      id: "pkg_5900",
      points: 5900,
      price: 40.94,
      listPrice: 45.49,
      tag: undefined,
    },
    {
      id: "pkg_12000",
      points: 12000,
      price: 79.19,
      listPrice: 87.99,
      tag: "BEST VALUE" as const,
      isBestValue: true,
    },
  ];
  
  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Hero Banner */}
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1661450279873-01fe386873d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFkaXVtJTIwYXRtb3NwaGVyZSUyMG5pZ2h0fGVufDF8fHx8MTc1OTg2MzMzNHww&ixlib=rb-4.1.0&q=80&w=1080"
        title="Fans Points Shop"
        subtitle="Ricarica il tuo saldo e sblocca premi esclusivi, card leggendarie e sfide speciali"
        badge="BEST VALUE"
        height="small"
      />
      
      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {packages.map((pkg) => (
          <PointsPackageCard 
            key={pkg.id} 
            package={pkg} 
            onPurchase={onPurchase}
          />
        ))}
      </div>
      
      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-[#2B2F3A]/30 rounded-lg border border-white/10 flex gap-3">
        <Info className="w-5 h-5 text-[#A9AFBC] flex-shrink-0 mt-0.5" />
        <div className="space-y-2 text-sm text-[#A9AFBC]">
          <p>
            Gli acquisti sono definitivi e non rimborsabili. I Fans Points non hanno valore monetario reale.
          </p>
          <div className="flex gap-4">
            <button className="text-[#00E0FF] hover:underline">
              Termini e Condizioni
            </button>
            <button className="text-[#00E0FF] hover:underline">
              Politica Rimborsi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}