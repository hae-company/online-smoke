export type CigaretteType = "regular" | "ecig";

export const INHALE_THRESHOLD = 0.08;
export const CIGARETTE_BURN_SPEED = 0.003; // per frame while inhaling
export const CIGARETTE_IDLE_BURN = 0.0002; // very slow idle burn
export const SMOKE_PARTICLE_COUNT = 30;

export const CIGARETTE_CONFIG = {
  regular: {
    label: "일반담배",
    filterColor: "#c4883c",
    paperColor: "#f5f0e8",
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
