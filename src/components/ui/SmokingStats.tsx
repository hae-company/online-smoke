"use client";

import { useState, useEffect } from "react";
import { useSmoking } from "../providers/SmokingProvider";

export default function SmokingStats() {
  const { webcamReady, burnProgress, chainCount, puffCount, startTime, isInhaling, phase, cigaretteType, brand, ecigBrand, liquid } = useSmoking();
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
    <>
      {/* Top: cigarette count */}
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 text-white">
        <span className="text-2xl">{cigaretteType === "ecig" ? "💨" : "🚬"}</span>
        <span className="text-lg font-light tracking-wider">
          {cigaretteType === "ecig" ? ecigBrand.name : brand.name} · {chainCount + 1}개비째
        </span>
        <span className="text-white/40 text-sm">|</span>
        <span className="text-sm text-white/60">{puffCount}모금</span>
        {cigaretteType === "ecig" && ecigBrand.shape !== "heated" && (
          <>
            <span className="text-white/40 text-sm">|</span>
            <span className="text-xs text-white/50 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: liquid.color }} />
              {liquid.name}
            </span>
          </>
        )}
      </div>

      {/* Bottom stats */}
      <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-5 text-white/60 text-xs">
        {phase === "smoking" && (
          <>
            <div className="flex items-center gap-2">
              <span>남은 양</span>
              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${(1 - burnProgress) * 100}%`,
                    backgroundColor: burnProgress > 0.8 ? "#ff6644" : "#66aaff",
                  }}
                />
              </div>
            </div>
            <span>{min}:{sec.toString().padStart(2, "0")}</span>
            {isInhaling && (
              <span className="text-orange-400 animate-pulse">흡입 중</span>
            )}
          </>
        )}

        {phase === "finished" && (
          <span className="text-yellow-300 animate-pulse">
            입을 다물고 1초 유지 → 새 담배 꺼내기
          </span>
        )}

        {phase === "pack" && (
          <span className="text-green-300 animate-pulse">
            입을 벌려서 담배를 물어보세요
          </span>
        )}
      </div>
    </>
  );
}
