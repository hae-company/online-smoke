"use client";

import { useState } from "react";
import { useSmoking } from "../providers/SmokingProvider";
import { BRANDS, ECIG_BRANDS, LIQUIDS, type BrandConfig, type EcigBrandConfig, type LiquidConfig } from "@/lib/constants";

export default function CigaretteSelector() {
  const {
    cigaretteType, setCigaretteType,
    brand, setBrand, ecigBrand, setEcigBrand, liquid, setLiquid,
    webcamReady, setBurnProgress, setPuffCount, setPhase,
  } = useSmoking();
  const [open, setOpen] = useState(false);

  if (!webcamReady) return null;

  const reset = () => {
    setBurnProgress(0);
    setPuffCount(0);
    setPhase("smoking");
    setOpen(false);
  };

  const selectBrand = (b: BrandConfig) => {
    setBrand(b);
    setCigaretteType("regular");
    reset();
  };

  const selectEcig = (b: EcigBrandConfig) => {
    setEcigBrand(b);
    setCigaretteType("ecig");
    reset();
  };

  const selectLiquid = (l: LiquidConfig) => {
    setLiquid(l);
  };

  return (
    <div className="fixed top-3 right-3 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded-xl text-xs backdrop-blur-xl border border-white/15 bg-black/50 text-white flex items-center gap-2 hover:bg-black/70 transition-all shadow-lg"
      >
        {cigaretteType === "ecig" ? (
          <>
            <span className="w-2.5 h-4 rounded-sm" style={{ backgroundColor: ecigBrand.bodyColor, border: `1px solid ${ecigBrand.accentColor}` }} />
            <span>{ecigBrand.name}</span>
          </>
        ) : (
          <>
            <span className="w-2.5 h-4 rounded-sm" style={{ backgroundColor: brand.packColor, borderBottom: `2px solid ${brand.packAccent}` }} />
            <span>{brand.name}</span>
          </>
        )}
        <span className="text-white/30 text-[9px]">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-1 rounded-xl backdrop-blur-xl bg-black/80 border border-white/10 overflow-hidden w-52 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="px-3 pt-2 pb-1 text-[9px] text-white/20 uppercase tracking-[0.15em]">일반담배</div>
          {BRANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => selectBrand(b)}
              className={`w-full px-3 py-2 flex items-center gap-2.5 text-left transition-all ${
                cigaretteType === "regular" && brand.id === b.id ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <div className="w-5 h-7 rounded-[2px] flex-shrink-0 shadow-sm"
                style={{ background: `linear-gradient(150deg, ${b.packColor2}, ${b.packColor})`, borderBottom: `2px solid ${b.packAccent}` }}
              />
              <div>
                <div className="text-[11px] text-white">{b.name}</div>
                <div className="text-[9px] text-white/30">{b.flavor}</div>
              </div>
            </button>
          ))}

          <div className="mx-2 my-1 border-t border-white/5" />
          <div className="px-3 pt-1 pb-1 text-[9px] text-white/20 uppercase tracking-[0.15em]">전자담배</div>
          {ECIG_BRANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => selectEcig(b)}
              className={`w-full px-3 py-2 flex items-center gap-2.5 text-left transition-all ${
                cigaretteType === "ecig" && ecigBrand.id === b.id ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <div className="w-5 h-7 rounded-[2px] flex-shrink-0 flex items-end justify-center pb-0.5 shadow-sm"
                style={{ background: `linear-gradient(180deg, ${b.bodyColor2}, ${b.bodyColor})` }}
              >
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: b.ledColor, boxShadow: `0 0 3px ${b.ledColor}` }} />
              </div>
              <div>
                <div className="text-[11px] text-white">{b.name}</div>
                <div className="text-[9px] text-white/30">{b.flavor}</div>
              </div>
            </button>
          ))}

          {/* Liquid selector — only for non-heated e-cigs */}
          {cigaretteType === "ecig" && ecigBrand.shape !== "heated" && (
            <>
              <div className="mx-2 my-1 border-t border-white/5" />
              <div className="px-3 pt-1 pb-1 text-[9px] text-white/20 uppercase tracking-[0.15em]">액상</div>
              <div className="px-2 pb-2 flex flex-wrap gap-1">
                {LIQUIDS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => selectLiquid(l)}
                    className={`px-2 py-1 rounded-full text-[9px] border transition-all ${
                      liquid.id === l.id
                        ? "border-white/30 text-white bg-white/10"
                        : "border-white/5 text-white/40 hover:text-white/60"
                    }`}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: l.color }} />
                    {l.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
