import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { HexagonPattern } from "./HexagonPattern";
import logoImage from "figma:asset/ce7b0ec8e185fed3574ef2b6517369f59fa12071.png";

interface PointsPackage {
  id: string;
  points: number;
  price: number;
  listPrice: number;
  tag?: "MOST POPULAR" | "BEST VALUE";
  isPopular?: boolean;
  isBestValue?: boolean;
}

interface PointsPackageCardProps {
  package: PointsPackage;
  onPurchase: (pkg: PointsPackage) => void;
}

export function PointsPackageCard({ package: pkg, onPurchase }: PointsPackageCardProps) {
  const discount = Math.round(((pkg.listPrice - pkg.price) / pkg.listPrice) * 100);
  const hasTag = pkg.tag || pkg.isPopular || pkg.isBestValue;
  
  return (
    <div className="relative group">
      {/* Tag Badge */}
      {hasTag && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge 
            className={`${
              pkg.tag === "MOST POPULAR" || pkg.isPopular
                ? "bg-[#A7FF1A] text-[#0A1020] glow-neon"
                : "bg-[#00E0FF] text-[#0A1020] glow-cyan"
            } border-0 px-3 py-1 uppercase tracking-wider`}
          >
            {pkg.tag || (pkg.isPopular ? "MOST POPULAR" : "BEST VALUE")}
          </Badge>
        </div>
      )}
      
      {/* Card */}
      <div className="relative bg-gradient-to-br from-[#111318] via-[#111318] to-[#2B2F3A] rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:border-[#A7FF1A]/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#A7FF1A]/20">
        <HexagonPattern />
        
        {/* Header - Points Amount */}
        <div className="relative p-6 pb-4 text-center border-b border-white/10">
          <div className="space-y-1">
            <div className="text-4xl text-[#A7FF1A]">{pkg.points.toLocaleString()}</div>
            <div className="text-sm text-[#A9AFBC] uppercase tracking-wide">Fans Points</div>
          </div>
        </div>
        
        {/* Body - Logo */}
        <div className="relative p-8 flex items-center justify-center">
          <img 
            src={logoImage} 
            alt="SPORTIUM" 
            className="w-32 h-32 object-contain opacity-60 group-hover:opacity-80 transition-opacity"
          />
        </div>
        
        {/* Footer - Pricing */}
        <div className="relative p-6 pt-4 space-y-4 bg-black/20">
          <div className="flex items-end justify-center gap-2">
            <span className="text-3xl text-white">€{pkg.price.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-lg text-[#A9AFBC] line-through mb-1">
                €{pkg.listPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {discount > 0 && (
            <div className="text-center">
              <Badge variant="outline" className="bg-[#2B2F3A] text-[#A7FF1A] border-[#A7FF1A]/30">
                -{discount}% Oggi
              </Badge>
            </div>
          )}
          
          <Button 
            onClick={() => onPurchase(pkg)}
            className="w-full bg-[#A7FF1A] hover:bg-[#8FE515] text-[#0A1020] glow-neon transition-all duration-200"
          >
            Acquista
          </Button>
        </div>
        
        {/* Data Binding Annotation */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-[#00E0FF]/10 backdrop-blur-sm border border-[#00E0FF]/30 rounded px-2 py-1 text-xs text-[#00E0FF]">
            point_packages
          </div>
        </div>
      </div>
    </div>
  );
}