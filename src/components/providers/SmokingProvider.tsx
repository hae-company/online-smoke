"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import type { CigaretteType } from "@/lib/constants";
import type { FaceLandmark } from "@/lib/landmarks";

interface SmokingState {
  // Webcam
  webcamReady: boolean;
  setWebcamReady: (v: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;

  // Face detection
  landmarks: FaceLandmark[] | null;
  setLandmarks: (l: FaceLandmark[] | null) => void;
  isInhaling: boolean;
  setIsInhaling: (v: boolean) => void;

  // Cigarette
  cigaretteType: CigaretteType;
  setCigaretteType: (t: CigaretteType) => void;
  burnProgress: number; // 0 = fresh, 1 = fully burned
  setBurnProgress: (p: number) => void;
  chainCount: number;
  setChainCount: (c: number) => void;

  // Timer
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
  const [burnProgress, setBurnProgress] = useState(0);
  const [chainCount, setChainCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  return (
    <SmokingContext.Provider
      value={{
        webcamReady,
        setWebcamReady,
        videoRef,
        landmarks,
        setLandmarks,
        isInhaling,
        setIsInhaling,
        cigaretteType,
        setCigaretteType,
        burnProgress,
        setBurnProgress,
        chainCount,
        setChainCount,
        startTime,
        setStartTime,
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
