// MediaPipe Face Mesh landmark indices for mouth
export const UPPER_LIP_TOP = 13;
export const LOWER_LIP_BOTTOM = 14;
export const MOUTH_LEFT = 61;
export const MOUTH_RIGHT = 291;

// Mouth center (for cigarette positioning)
export const MOUTH_CENTER_TOP = 0; // nose tip as reference
export const LIPS_CENTER = 13;

export interface FaceLandmark {
  x: number; // 0-1 normalized
  y: number;
  z: number;
}

export function calculateMAR(landmarks: FaceLandmark[]): number {
  const upperLip = landmarks[UPPER_LIP_TOP];
  const lowerLip = landmarks[LOWER_LIP_BOTTOM];
  const leftCorner = landmarks[MOUTH_LEFT];
  const rightCorner = landmarks[MOUTH_RIGHT];

  const verticalDist = Math.sqrt(
    (upperLip.x - lowerLip.x) ** 2 + (upperLip.y - lowerLip.y) ** 2
  );
  const horizontalDist = Math.sqrt(
    (leftCorner.x - rightCorner.x) ** 2 + (leftCorner.y - rightCorner.y) ** 2
  );

  if (horizontalDist === 0) return 0;
  return verticalDist / horizontalDist;
}

export function getMouthPosition(landmarks: FaceLandmark[]): {
  x: number;
  y: number;
  z: number;
  angle: number;
} {
  const left = landmarks[MOUTH_LEFT];
  const right = landmarks[MOUTH_RIGHT];

  // Cigarette goes at the right corner of the mouth
  const x = right.x;
  const y = right.y;
  const z = right.z;

  // Angle of the mouth line
  const angle = Math.atan2(right.y - left.y, right.x - left.x);

  return { x, y, z, angle };
}
