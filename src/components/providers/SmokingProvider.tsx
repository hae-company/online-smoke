"use client";

import { createContext, useContext, useState, useRef, type ReactNode } from "react";
import type { CigaretteType, SmokingPhase, BrandConfig, EcigBrandConfig, LiquidConfig } from "@/lib/constants";
import { BRANDS, ECIG_BRANDS, LIQUIDS } from "@/lib/constants";
import type { FaceLandmark } from "@/lib/landmarks";

interface SmokingState {
  webcamReady: boolean;
  setWebcamReady: (v: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  landmarks: FaceLandmark[] | null;
  setLandmarks: (l: FaceLandmark[] | null) => void;
  isInhaling: boolean;
  setIsInhaling: (v: boolean) => void;
  cigaretteType: CigaretteType;
  setCigaretteType: (t: CigaretteType) => void;
  brand: BrandConfig;
  setBrand: (b: BrandConfig) => void;
  ecigBrand: EcigBrandConfig;
  setEcigBrand: (b: EcigBrandConfig) => void;
  liquid: LiquidConfig;
  setLiquid: (l: LiquidConfig) => void;
  burnProgress: number;
  setBurnProgress: (p: number) => void;
  chainCount: number;
  setChainCount: (c: number) => void;
  puffCount: number;
  setPuffCount: (n: number) => void;
  phase: SmokingPhase;
  setPhase: (p: SmokingPhase) => void;
  startTime: number | null;
  setStartTime: (t: number | null) => void;
}

const SmokingContext = createContext<SmokingState | null>(null);

export function SmokingProvider({ children }: { children: ReactNode }) {
  const [webcamReady, setWebcamReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [landmarks, setLandmarks] = useState<FaceLandmark[] | null>(null);
  const [isInhaling, setIsInhaling] = useState(false);
  const [cigaretteType, setCigaretteType] = useState<CigaretteType>("regular");
  const [brand, setBrand] = useState<BrandConfig>(BRANDS[0]);
  const [ecigBrand, setEcigBrand] = useState<EcigBrandConfig>(ECIG_BRANDS[0]);
  const [liquid, setLiquid] = useState<LiquidConfig>(LIQUIDS[0]);
  const [burnProgress, setBurnProgress] = useState(0);
  const [chainCount, setChainCount] = useState(0);
  const [puffCount, setPuffCount] = useState(0);
  const [phase, setPhase] = useState<SmokingPhase>("smoking");
  const [startTime, setStartTime] = useState<number | null>(null);

  return (
    <SmokingContext.Provider
      value={{
        webcamReady, setWebcamReady, videoRef,
        landmarks, setLandmarks, isInhaling, setIsInhaling,
        cigaretteType, setCigaretteType,
        brand, setBrand, ecigBrand, setEcigBrand, liquid, setLiquid,
        burnProgress, setBurnProgress,
        chainCount, setChainCount,
        puffCount, setPuffCount,
        phase, setPhase,
        startTime, setStartTime,
      }}
    >
      {children}
    </SmokingContext.Provider>
  );
}

export function useSmoking() {
  const ctx = useContext(SmokingContext);
  if (!ctx) throw new Error("useSmoking must be used within SmokingProvider");
  return ctx;
}
