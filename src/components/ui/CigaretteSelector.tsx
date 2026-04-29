"use client";

import { useState } from "react";
import { useSmoking } from "../providers/SmokingProvider";
import { BRANDS, ECIG_BRANDS, type BrandConfig, type EcigBrandConfig } from "@/lib/constants";

export default function CigaretteSelector() {
  const {
    cigaretteType, setCigaretteType,
    brand, setBrand, ecigBrand, setEcigBrand,
    webcamReady, setBurnProgress, setPuffCount, setPhase,
  } = useSmoking();
  const [open, setOpen] = useState(false);

  if (!webcamReady) return null;

  const selectBrand = (b: BrandConfig) => {
    setBrand(b);
    setCigaretteType("regular");
    setBurnProgress(0);
    setPuffCount(0);
    setPhase("smoking");
    setOpen(false);
  };

  const selectEcig = (b: EcigBrandConfig) => {
    setEcigBrand(b);
    setCigaretteType("ecig");
    setBurnProgress(0);
    setPuffCount(0);
    setPhase("smoking");
    setOpen(false);
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="px-5 py-2.5 rounded-2xl text-sm backdrop-blur-xl border border-white/15 bg-black/50 text-white flex items-center gap-2.5 hover:bg-black/70 transition-all shadow-lg"
      >
        {cigaretteType === "ecig" ? (
          <>
            <span className="w-3 h-5 rounded-sm inline-block" style={{ backgroundColor: ecigBrand.bodyColor, border: `1px solid ${ecigBrand.accentColor}` }} />
            {ecigBrand.name}
          </>
        ) : (
          <>
            <span className="w-3.5 h-5 rounded-sm inline-block" style={{ backgroundColor: brand.packColor, borderBottom: `2px solid ${brand.packAccent}` }} />
            {brand.name}
          </>
        )}
        <span className="text-white/30 text-[10px]">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-2 rounded-2xl backdrop-blur-xl bg-black/80 border border-white/10 overflow-hidden w-60 shadow-2xl max-h-[70vh] overflow-y-auto">
          {/* Regular */}
          <div className="px-4 pt-3 pb-1 text-[10px] text-white/25 uppercase tracking-[0.2em]">일반담배</div>
          {BRANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => selectBrand(b)}
              className={`w-full px-3 py-2.5 flex items-center gap-3 text-left transition-all ${
                cigaretteType === "regular" && brand.id === b.id
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="w-7 h-10 rounded-[3px] flex-shrink-0 relative overflow-hidden shadow-md"
                style={{ background: `linear-gradient(135deg, ${b.packColor2}, ${b.packColor})` }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-2.5" style={{ backgroundColor: b.packAccent, opacity: 0.8 }} />
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: b.packAccent }} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] text-white font-medium">{b.name}</div>
                <div className="text-[10px] text-white/35 truncate">{b.flavor}</div>
              </div>
            </button>
          ))}

          <div className="mx-3 my-1 border-t border-white/5" />

          {/* E-cig */}
          <div className="px-4 pt-2 pb-1 text-[10px] text-white/25 uppercase tracking-[0.2em]">전자담배</div>
          {ECIG_BRANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => selectEcig(b)}
              className={`w-full px-3 py-2.5 flex items-center gap-3 text-left transition-all ${
                cigaretteType === "ecig" && ecigBrand.id === b.id
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="w-7 h-10 rounded-[3px] flex-shrink-0 flex items-center justify-center shadow-md"
                style={{ background: `linear-gradient(180deg, ${b.bodyColor2}, ${b.bodyColor})` }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: b.ledColor, boxShadow: `0 0 4px ${b.ledColor}` }} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] text-white font-medium">{b.name}</div>
                <div className="text-[10px] text-white/35 truncate">{b.flavor}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
