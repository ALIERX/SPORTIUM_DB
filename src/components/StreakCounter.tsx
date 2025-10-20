import { Flame } from "lucide-react";

interface StreakCounterProps {
  days: number;
  multiplier: number;
}

export function StreakCounter({ days, multiplier }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
      <Flame className="w-4 h-4 text-orange-500" />
      <div className="flex items-center gap-1">
        <span className="text-white">{days}</span>
        <span className="text-xs text-[#A9AFBC]">giorni</span>
      </div>
      <div className="h-3 w-px bg-white/20" />
      <span className="text-xs text-[#A7FF1A]">x{multiplier}</span>
    </div>
  );
}
