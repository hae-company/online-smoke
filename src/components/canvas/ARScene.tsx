"use client";

import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useSmoking } from "../providers/SmokingProvider";
import Cigarette from "./Cigarette";

export default function ARScene() {
  const { webcamReady, videoRef } = useSmoking();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);

  // Draw webcam video to a canvas (mirrored)
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

        // Mirror horizontally for selfie view
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        // Cover the screen (maintain aspect ratio)
        const videoAspect = video.videoWidth / video.videoHeight;
        const screenAspect = canvas.width / canvas.height;
        let drawW, drawH, drawX, drawY;

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
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, [webcamReady, videoRef]);

  if (!webcamReady) return null;

  return (
    <div className="fixed inset-0">
      {/* Webcam video layer */}
      <canvas
        ref={videoCanvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 3D overlay layer (transparent) */}
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[2, 2, 5]} intensity={1} />
        <Cigarette />
      </Canvas>
    </div>
  );
}
