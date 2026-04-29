// MediaPipe Face Mesh landmark indices for mouth
export const UPPER_LIP_TOP = 13;
export const LOWER_LIP_BOTTOM = 14;
export const MOUTH_LEFT = 61;
export const MOUTH_RIGHT = 291;

// Nose for face direction
export const NOSE_TIP = 1;
export const FOREHEAD = 10;
export const CHIN = 152;
export const LEFT_EAR = 234;
export const RIGHT_EAR = 454;

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

/**
 * Convert normalized landmark (0-1) to Three.js world coordinates.
 * Camera at z=5, fov=50 → visible area at z=0:
 *   halfHeight = 5 * tan(25deg) ≈ 2.33
 *   halfWidth = halfHeight * aspect
 * We mirror X for selfie view.
 */
export function landmarkToWorld(
  lm: FaceLandmark,
  aspect: number
): { x: number; y: number; z: number } {
  const camZ = 5;
  const fovRad = (50 / 2) * (Math.PI / 180); // half fov in radians
  const halfH = camZ * Math.tan(fovRad);
  const halfW = halfH * aspect;

  return {
    x: -((lm.x - 0.5) * 2 * halfW), // mirror for selfie
    y: -((lm.y - 0.5) * 2 * halfH),
    z: -lm.z * 2, // depth
  };
}

export function getMouthPosition(
  landmarks: FaceLandmark[],
  aspect: number
): {
  x: number;
  y: number;
  z: number;
  angle: number;
  faceRotY: number; // left-right head turn
  faceRotX: number; // up-down nod
} {
  const left = landmarks[MOUTH_LEFT];
  const right = landmarks[MOUTH_RIGHT];
  const upper = landmarks[UPPER_LIP_TOP];
  const lower = landmarks[LOWER_LIP_BOTTOM];

  // Center of lips
  const cx = (upper.x + lower.x) / 2;
  const cy = (upper.y + lower.y) / 2;
  const cz = (upper.z + lower.z) / 2;

  // Offset toward right corner (cigarette hangs from side)
  const offX = (right.x - cx) * 0.45;
  const offY = (right.y - cy) * 0.45;

  const lm: FaceLandmark = { x: cx + offX, y: cy + offY, z: cz };
  const world = landmarkToWorld(lm, aspect);

  // Mouth angle
  const angle = Math.atan2(right.y - left.y, right.x - left.x);

  // Face rotation from ear-to-ear and forehead-to-chin
  const nose = landmarks[NOSE_TIP];
  const leftEar = landmarks[LEFT_EAR];
  const rightEar = landmarks[RIGHT_EAR];

  // Y rotation (left-right turn): nose z relative to ears
  const faceRotY = (nose.z - (leftEar.z + rightEar.z) / 2) * 5;

  // X rotation (nod): nose y relative to forehead/chin midpoint
  const forehead = landmarks[FOREHEAD];
  const chin = landmarks[CHIN];
  const faceMidY = (forehead.y + chin.y) / 2;
  const faceRotX = (nose.y - faceMidY) * 3;

  return { ...world, angle, faceRotY, faceRotX };
}
