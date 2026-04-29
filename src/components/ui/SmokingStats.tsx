"use client";

import { useState, useEffect } from "react";
import { useSmoking } from "../providers/SmokingProvider";

export default function SmokingStats() {
  const { webcamReady, burnProgress, chainCount, startTime, isInhaling } = useSmoking();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (!webcamReady) return null;

  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 text-white/60 text-xs">
      {/* Burn progress bar */}
      <div className="flex items-center gap-2">
        <span>남은 양</span>
        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-400 transition-all duration-100"
            style={{ width: `${(1 - burnProgress) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <span>{min}:{sec.toString().padStart(2, "0")}</span>

      {/* Chain count */}
      <span>{chainCount + 1}개비째</span>

      {/* Inhaling indicator */}
      {isInhaling && (
        <span className="text-orange-400 animate-pulse">흡입 중</span>
      )}
    </div>
  );
}
