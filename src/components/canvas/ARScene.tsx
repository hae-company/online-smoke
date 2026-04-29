"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useSmoking } from "../providers/SmokingProvider";
import Cigarette from "./Cigarette";
import { MOUTH_LEFT, MOUTH_RIGHT, UPPER_LIP_TOP, LOWER_LIP_BOTTOM } from "@/lib/landmarks";

export default function ARScene() {
  const { webcamReady, videoRef, landmarks } = useSmoking();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const [showDebug, setShowDebug] = useState(true);

  // Hide debug circles after 3 seconds of first face detection
  const debugTimerStarted = useRef(false);
  useEffect(() => {
    if (landmarks && !debugTimerStarted.current) {
      debugTimerStarted.current = true;
      setTimeout(() => setShowDebug(false), 3000);
    }
  }, [landmarks]);

  useEffect(() => {
    if (!webcamReady) return;

    const canvas = videoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        const videoAspect = video.videoWidth / video.videoHeight;
        const screenAspect = canvas.width / canvas.height;
        let drawW: number, drawH: number, drawX: number, drawY: number;

        if (screenAspect > videoAspect) {
          drawW = canvas.width;
          drawH = canvas.width / videoAspect;
          drawX = 0;
          drawY = (canvas.height - drawH) / 2;
        } else {
          drawH = canvas.height;
          drawW = canvas.height * videoAspect;
          drawX = (canvas.width - drawW) / 2;
          drawY = 0;
        }

        ctx.drawImage(video, drawX, drawY, drawW, drawH);
        ctx.restore();

        // Debug overlay — only first 3 seconds
        if (showDebug && landmarks && landmarks.length > 0) {
          const lm = landmarks;
          const toScreen = (l: { x: number; y: number }) => ({
            x: (1 - l.x) * canvas.width,
            y: l.y * canvas.height,
          });

          const mLeft = toScreen(lm[MOUTH_LEFT]);
          const mRight = toScreen(lm[MOUTH_RIGHT]);
          const mTop = toScreen(lm[UPPER_LIP_TOP]);
          const mBottom = toScreen(lm[LOWER_LIP_BOTTOM]);

          const cx = (mLeft.x + mRight.x) / 2;
          const cy = (mTop.y + mBottom.y) / 2;
          const radius = Math.abs(mRight.x - mLeft.x) / 2 + 5;

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(0, 255, 100, 0.6)";
          ctx.lineWidth = 2;
          ctx.stroke();

          [mLeft, mRight, mTop, mBottom].forEach((pt) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 50, 50, 0.8)";
            ctx.fill();
          });
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, [webcamReady, videoRef, landmarks, showDebug]);

  if (!webcamReady) return null;

  return (
    <div className="fixed inset-0">
      <canvas ref={videoCanvasRef} className="absolute inset-0 w-full h-full" />
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 5]} intensity={1.8} />
        <pointLight position={[-2, 1, 4]} intensity={0.8} color="#ffddaa" />
        <pointLight position={[0, -2, 3]} intensity={0.4} color="#aaccff" />
        <Cigarette />
      </Canvas>
    </div>
  );
}
