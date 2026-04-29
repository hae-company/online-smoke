export type CigaretteType = "regular" | "ecig";

// Phase flow: smoking → finished → pack/refill → grabbing → smoking
export type SmokingPhase = "smoking" | "finished" | "pack" | "grabbing";

export const INHALE_THRESHOLD = 0.08;
export const PUFFS_PER_CIGARETTE = 10;
export const PUFFS_PER_ECIG_CHARGE = 20;

// Burn per puff: 1/10 = 0.1 per puff, spread over ~60 frames of inhaling
export const CIGARETTE_BURN_PER_FRAME = 1 / (PUFFS_PER_CIGARETTE * 60);
export const ECIG_BURN_PER_FRAME = 1 / (PUFFS_PER_ECIG_CHARGE * 60);
export const IDLE_BURN = 0.00005; // barely burns when idle

// Pinch detection: thumb tip to index tip distance threshold
export const PINCH_THRESHOLD = 0.06;

export const CIGARETTE_CONFIG = {
  regular: {
    label: "일반담배",
    filterColor: "#c4883c",
    paperColor: "#f0ebe0",
    emberColor: "#ff4400",
    smokeColor: "#cccccc",
  },
  ecig: {
    label: "전자담배",
    bodyColor: "#2a2a2a",
    tipColor: "#4488ff",
    vaporColor: "#ffffff",
    ledColor: "#00aaff",
  },
} as const;
