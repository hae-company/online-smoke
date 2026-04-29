"use client";

import dynamic from "next/dynamic";
import { SmokingProvider } from "@/components/providers/SmokingProvider";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import StartScreen from "@/components/ui/StartScreen";
import CigaretteSelector from "@/components/ui/CigaretteSelector";
import SmokingStats from "@/components/ui/SmokingStats";
import Footer from "@/components/ui/Footer";

const ARScene = dynamic(() => import("@/components/canvas/ARScene"), {
  ssr: false,
});

function FaceDetector() {
  useFaceDetection();
  return null;
}

export default function Home() {
  return (
    <SmokingProvider>
      <StartScreen />
      <FaceDetector />
      <ARScene />
      <CigaretteSelector />
      <SmokingStats />
      <Footer />
    </SmokingProvider>
  );
}
