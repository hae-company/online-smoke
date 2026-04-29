"use client";

import { useState } from "react";
import { useSmoking } from "../providers/SmokingProvider";
import { BRANDS, ECIG_CONFIG } from "@/lib/constants";

export default function CigaretteSelector() {
  const { cigaretteType, setCigaretteType, brand, setBrand, webcamReady, setBurnProgress, setPuffCount, setPhase } = useSmoking();
  const [showBrands, setShowBrands] = useState(false);

  if (!webcamReady) return null;

  const handleBrandSelect = (b: typeof BRANDS[number]) => {
    setBrand(b);
    setCigaretteType("regular");
    setBurnProgress(0);
    setPuffCount(0);
    setPhase("smoking");
    setShowBrands(false);
  };

  const handleEcig = () => {
    setCigaretteType("ecig");
    setBurnProgress(0);
    setPuffCount(0);
    setPhase("smoking");
    setShowBrands(false);
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
      {/* Current selection button */}
      <button
        onClick={() => setShowBrands(!showBrands)}
        className="px-5 py-2 rounded-full text-sm backdrop-blur-md border border-white/20 bg-black/40 text-white flex items-center gap-2 hover:bg-black/60 transition-all"
      >
        {cigaretteType === "ecig" ? (
          <>💨 {ECIG_CONFIG.label}</>
        ) : (
          <>
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: brand.packColor }}
            />
            {brand.name}
          </>
        )}
        <span className="text-white/40 text-xs ml-1">{showBrands ? "▲" : "▼"}</span>
      </button>

      {/* Brand dropdown */}
      {showBrands && (
        <div className="mt-2 rounded-2xl backdrop-blur-xl bg-black/70 border border-white/10 overflow-hidden w-56">
          {/* Regular brands */}
          <div className="p-2 text-[10px] text-white/30 uppercase tracking-widest px-4">일반담배</div>
          {BRANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => handleBrandSelect(b)}
              className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-white/10 transition-all ${
                cigaretteType === "regular" && brand.id === b.id ? "bg-white/10" : ""
              }`}
            >
              {/* Mini pack color swatch */}
              <div
                className="w-6 h-8 rounded-sm flex-shrink-0 border border-white/10"
                style={{
                  backgroundColor: b.packColor,
                  boxShadow: `inset 0 -2px 0 ${b.packAccent}`,
                }}
              />
              <div>
                <div className="text-sm text-white">{b.name}</div>
                <div className="text-[10px] text-white/40">{b.flavor}</div>
              </div>
            </button>
          ))}

          {/* E-cig */}
          <div className="border-t border-white/10" />
          <div className="p-2 text-[10px] text-white/30 uppercase tracking-widest px-4">전자담배</div>
          <button
            onClick={handleEcig}
            className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-white/10 transition-all ${
              cigaretteType === "ecig" ? "bg-white/10" : ""
            }`}
          >
            <div className="w-6 h-8 rounded-sm flex-shrink-0 bg-zinc-800 border border-white/10 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
            <div>
              <div className="text-sm text-white">{ECIG_CONFIG.label}</div>
              <div className="text-[10px] text-white/40">충전식 베이프</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
