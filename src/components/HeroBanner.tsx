import { ImageWithFallback } from "./figma/ImageWithFallback";
import { HexagonPattern } from "./HexagonPattern";

interface HeroBannerProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaAction?: () => void;
  badge?: string;
  height?: "small" | "medium" | "large";
}

export function HeroBanner({
  imageUrl,
  title,
  subtitle,
  ctaText,
  ctaAction,
  badge,
  height = "medium"
}: HeroBannerProps) {
  const heights = {
    small: "h-40 md:h-48",
    medium: "h-56 md:h-72",
    large: "h-72 md:h-96"
  };

  return (
    <div className={`relative ${heights[height]} rounded-2xl overflow-hidden group cursor-pointer`}>
      {/* Background Image */}
      <ImageWithFallback
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1020] via-[#0A1020]/60 to-transparent" />
      
      {/* Hexagon Pattern Overlay */}
      <HexagonPattern opacity={0.1} />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        {badge && (
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#A7FF1A] text-[#0A1020] text-xs uppercase tracking-wider">
              {badge}
            </span>
          </div>
        )}
        
        <h3 className="text-2xl md:text-3xl mb-2">{title}</h3>
        
        {subtitle && (
          <p className="text-[#A9AFBC] mb-4 max-w-2xl">{subtitle}</p>
        )}
        
        {ctaText && ctaAction && (
          <button
            onClick={ctaAction}
            className="self-start px-6 py-2.5 rounded-xl bg-[#A7FF1A] text-[#0A1020] hover:bg-[#8FE000] transition-all duration-200 glow-neon"
          >
            {ctaText}
          </button>
        )}
      </div>
    </div>
  );
}
