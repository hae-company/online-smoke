"use client";

import Image from "next/image";
import { useSmoking } from "../providers/SmokingProvider";
import { useWebcam } from "@/hooks/useWebcam";

export default function StartScreen() {
  const { webcamReady, setStartTime } = useSmoking();
  const { start } = useWebcam();

  if (webcamReady) return null;

  const handleStart = async () => {
    await start();
    setStartTime(Date.now());
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      <Image
        src="/logo-dark.svg"
        alt="hae02y"
        width={100}
        height={69}
        className="mb-8 opacity-50"
      />
      <h1 className="text-4xl font-light tracking-[0.2em] text-white/90 mb-3">
        ONLINE SMOKE
      </h1>
      <p className="text-sm text-white/40 mb-10">
        웹캠으로 담배피기 시뮬레이터
      </p>
      <button
        onClick={handleStart}
        className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm tracking-wider hover:bg-white/20 transition-all"
      >
        시작하기
      </button>
      <p className="text-[10px] text-white/20 mt-4">
        카메라 접근 권한이 필요합니다
      </p>
    </div>
  );
}
