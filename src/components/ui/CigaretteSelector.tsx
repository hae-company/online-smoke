"use client";

import { useSmoking } from "../providers/SmokingProvider";
import { CIGARETTE_CONFIG, type CigaretteType } from "@/lib/constants";

const types: { key: CigaretteType; emoji: string }[] = [
  { key: "regular", emoji: "🚬" },
  { key: "ecig", emoji: "💨" },
];

export default function CigaretteSelector() {
  const { cigaretteType, setCigaretteType, webcamReady, setBurnProgress } = useSmoking();

  if (!webcamReady) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
      {types.map(({ key, emoji }) => (
        <button
          key={key}
          onClick={() => {
            setCigaretteType(key);
            setBurnProgress(0);
          }}
          className={`px-4 py-2 rounded-full text-sm backdrop-blur-md border transition-all
            ${cigaretteType === key
              ? "bg-white/20 border-white/40 text-white"
              : "bg-black/30 border-white/10 text-white/50 hover:text-white/80"
            }`}
        >
          {emoji} {CIGARETTE_CONFIG[key].label}
        </button>
      ))}
    </div>
  );
}
