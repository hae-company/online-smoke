"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSmoking } from "@/components/providers/SmokingProvider";

export function useWebcam() {
  const { setWebcamReady, videoRef } = useSmoking();
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      streamRef.current = stream;

      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      await video.play();
      videoRef.current = video;
      setWebcamReady(true);
    } catch (err) {
      console.error("Webcam denied:", err);
    }
  }, [setWebcamReady, videoRef]);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }
    setWebcamReady(false);
  }, [setWebcamReady, videoRef]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { start, stop };
}
