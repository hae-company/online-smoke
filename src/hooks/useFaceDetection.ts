"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSmoking } from "@/components/providers/SmokingProvider";
import { calculateMAR, type FaceLandmark } from "@/lib/landmarks";
import { INHALE_THRESHOLD } from "@/lib/constants";

export function useFaceDetection() {
  const { videoRef, webcamReady, setLandmarks, setIsInhaling } = useSmoking();
  const landmarkerRef = useRef<ReturnType<typeof Object> | null>(null);
  const rafRef = useRef<number>(0);
  const marSmoothRef = useRef(0);

  const initLandmarker = useCallback(async () => {
    const vision = await import("@mediapipe/tasks-vision");
    const { FaceLandmarker, FilesetResolver } = vision;

    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    });

    landmarkerRef.current = landmarker;
  }, []);

  const detect = useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current as {
      detectForVideo: (
        video: HTMLVideoElement,
        timestamp: number
      ) => { faceLandmarks: FaceLandmark[][] };
    } | null;

    if (!video || !landmarker || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detect);
      return;
    }

    const result = landmarker.detectForVideo(video, performance.now());

    if (result.faceLandmarks && result.faceLandmarks.length > 0) {
      const face = result.faceLandmarks[0];
      setLandmarks(face);

      const mar = calculateMAR(face);
      // Smooth MAR to avoid jitter
      marSmoothRef.current = marSmoothRef.current * 0.7 + mar * 0.3;
      setIsInhaling(marSmoothRef.current > INHALE_THRESHOLD);
    } else {
      setLandmarks(null);
      setIsInhaling(false);
    }

    rafRef.current = requestAnimationFrame(detect);
  }, [videoRef, setLandmarks, setIsInhaling]);

  useEffect(() => {
    if (!webcamReady) return;

    initLandmarker().then(() => {
      rafRef.current = requestAnimationFrame(detect);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [webcamReady, initLandmarker, detect]);
}
