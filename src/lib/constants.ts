export type CigaretteType = "regular" | "ecig";
export type SmokingPhase = "smoking" | "finished" | "pack" | "grabbing";

export interface BrandConfig {
  id: string;
  name: string;
  packColor: string;
  packColor2: string; // gradient or secondary
  packAccent: string;
  filterColor: string;
  filterTip: string; // mouth-end color
  paperColor: string;
  bandColor: string;
  bandColor2: string;
  thickness: number;
  flavor: string;
}

export interface EcigBrandConfig {
  id: string;
  name: string;
  bodyColor: string;
  bodyColor2: string;
  accentColor: string;
  ledColor: string;
  mouthpieceColor: string;
  shape: "stick" | "pod" | "box";
  flavor: string;
  metalness: number;
  roughness: number;
}

export const BRANDS: BrandConfig[] = [
  {
    id: "dunshil",
    name: "던쉴",
    packColor: "#0d1b4a",
    packColor2: "#1a237e",
    packAccent: "#c9a84c",
    filterColor: "#c8924a",
    filterTip: "#b8823a",
    paperColor: "#f0ebe0",
    bandColor: "#c9a84c",
    bandColor2: "#a07830",
    thickness: 1,
    flavor: "클래식 풀 플레이버",
  },
  {
    id: "maildseven",
    name: "마일드나인",
    packColor: "#1565c0",
    packColor2: "#42a5f5",
    packAccent: "#e8eaf6",
    filterColor: "#e8d5b0",
    filterTip: "#d5c49a",
    paperColor: "#f8f6f0",
    bandColor: "#90caf9",
    bandColor2: "#64b5f6",
    thickness: 0.9,
    flavor: "부드러운 스카이 블루",
  },
  {
    id: "malporo",
    name: "말뽀로",
    packColor: "#b71c1c",
    packColor2: "#d32f2f",
    packAccent: "#ffffff",
    filterColor: "#d4a050",
    filterTip: "#c49040",
    paperColor: "#f0ebe0",
    bandColor: "#ffffff",
    bandColor2: "#e0e0e0",
    thickness: 1.05,
    flavor: "레드 오리지널",
  },
  {
    id: "essae",
    name: "에쎄이",
    packColor: "#4a148c",
    packColor2: "#7b1fa2",
    packAccent: "#ce93d8",
    filterColor: "#c0a080",
    filterTip: "#b09070",
    paperColor: "#f8f4ef",
    bandColor: "#ce93d8",
    bandColor2: "#ab47bc",
    thickness: 0.72,
    flavor: "슬림 퍼플 1mg",
  },
  {
    id: "rejjong",
    name: "레쫑",
    packColor: "#004d40",
    packColor2: "#00695c",
    packAccent: "#80cbc4",
    filterColor: "#90b890",
    filterTip: "#80a880",
    paperColor: "#f0ebe0",
    bandColor: "#4db6ac",
    bandColor2: "#26a69a",
    thickness: 0.85,
    flavor: "프레쉬 멘솔",
  },
  {
    id: "deeseu",
    name: "디쓰",
    packColor: "#1a1a1a",
    packColor2: "#2d2d2d",
    packAccent: "#616161",
    filterColor: "#2a2a2a",
    filterTip: "#1a1a1a",
    paperColor: "#e0e0e0",
    bandColor: "#444",
    bandColor2: "#333",
    thickness: 0.78,
    flavor: "다크 카본 슬림",
  },
];

export const ECIG_BRANDS: EcigBrandConfig[] = [
  {
    id: "icoss",
    name: "아이코쓰",
    bodyColor: "#e8e0d0",
    bodyColor2: "#d5cdc0",
    accentColor: "#c9a84c",
    ledColor: "#ff8800",
    mouthpieceColor: "#f5f0e8",
    shape: "stick",
    flavor: "히츠 스틱형",
    metalness: 0.3,
    roughness: 0.6,
  },
  {
    id: "lilli",
    name: "릴리",
    bodyColor: "#1a1a2e",
    bodyColor2: "#16213e",
    accentColor: "#00bcd4",
    ledColor: "#00e5ff",
    mouthpieceColor: "#333",
    shape: "pod",
    flavor: "미니 팟형",
    metalness: 0.7,
    roughness: 0.15,
  },
  {
    id: "glory",
    name: "글로리",
    bodyColor: "#263238",
    bodyColor2: "#37474f",
    accentColor: "#ff6d00",
    ledColor: "#ff9100",
    mouthpieceColor: "#455a64",
    shape: "box",
    flavor: "인덕션 히팅",
    metalness: 0.6,
    roughness: 0.2,
  },
  {
    id: "julie",
    name: "줄리",
    bodyColor: "#37474f",
    bodyColor2: "#455a64",
    accentColor: "#78909c",
    ledColor: "#ffffff",
    mouthpieceColor: "#546e7a",
    shape: "stick",
    flavor: "슬릭 팟 시스템",
    metalness: 0.85,
    roughness: 0.08,
  },
];

export const INHALE_THRESHOLD = 0.08;
export const PUFFS_PER_CIGARETTE = 10;
export const PUFFS_PER_ECIG_CHARGE = 20;

export const CIGARETTE_BURN_PER_FRAME = 1 / (PUFFS_PER_CIGARETTE * 60);
export const ECIG_BURN_PER_FRAME = 1 / (PUFFS_PER_ECIG_CHARGE * 60);
export const IDLE_BURN = 0.00005;
