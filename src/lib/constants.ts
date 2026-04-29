export type CigaretteType = "regular" | "ecig";
export type SmokingPhase = "smoking" | "finished" | "pack" | "grabbing";

export interface BrandConfig {
  id: string;
  name: string;
  packColor: string;
  packColor2: string;
  packAccent: string;
  filterColor: string;
  filterTip: string;
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
  shape: "pod" | "disposable" | "heated";
  width: number;
  height: number;
  depth: number;
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

// 요즘 유행하는 전자담배: 일회용 디스포저블, 팟 시스템, 궐련형
export const ECIG_BRANDS: EcigBrandConfig[] = [
  {
    id: "elfba",
    name: "엘프바",
    bodyColor: "#e8b4f8",
    bodyColor2: "#d48ce8",
    accentColor: "#f0d0ff",
    ledColor: "#ffffff",
    mouthpieceColor: "#f5f5f5",
    shape: "disposable",
    width: 0.14,
    height: 1.1,
    depth: 0.06,
    flavor: "일회용 디스포저블 5000모금",
    metalness: 0.1,
    roughness: 0.7,
  },
  {
    id: "releks",
    name: "리렉스",
    bodyColor: "#1a1a1a",
    bodyColor2: "#2a2a2a",
    accentColor: "#ff4444",
    ledColor: "#ff0000",
    mouthpieceColor: "#111",
    shape: "pod",
    width: 0.12,
    height: 1.0,
    depth: 0.05,
    flavor: "슬림 팟 시스템",
    metalness: 0.8,
    roughness: 0.1,
  },
  {
    id: "icoss",
    name: "아이코쓰",
    bodyColor: "#d5cdc0",
    bodyColor2: "#c0b8a8",
    accentColor: "#c9a84c",
    ledColor: "#ff8800",
    mouthpieceColor: "#e8e0d0",
    shape: "heated",
    width: 0.1,
    height: 1.2,
    depth: 0.1,
    flavor: "궐련형 가열식",
    metalness: 0.3,
    roughness: 0.5,
  },
  {
    id: "lilli",
    name: "릴리",
    bodyColor: "#f5f5f5",
    bodyColor2: "#e0e0e0",
    accentColor: "#00bcd4",
    ledColor: "#00e5ff",
    mouthpieceColor: "#ddd",
    shape: "heated",
    width: 0.09,
    height: 1.0,
    depth: 0.09,
    flavor: "궐련형 미니",
    metalness: 0.4,
    roughness: 0.4,
  },
];

export interface LiquidConfig {
  id: string;
  name: string;
  color: string;
  opacity: number;
}

export const LIQUIDS: LiquidConfig[] = [
  { id: "grape", name: "포도 아이스", color: "#8833cc", opacity: 0.6 },
  { id: "mango", name: "망고 스무디", color: "#ffaa22", opacity: 0.55 },
  { id: "mint", name: "더블 민트", color: "#44ddaa", opacity: 0.5 },
  { id: "tobacco", name: "클래식 타바코", color: "#886633", opacity: 0.65 },
  { id: "strawberry", name: "딸기 크림", color: "#ff4466", opacity: 0.55 },
  { id: "blueberry", name: "블루베리 블라스트", color: "#3355dd", opacity: 0.6 },
];

export const INHALE_THRESHOLD = 0.08;
export const PUFFS_PER_CIGARETTE = 10;
export const PUFFS_PER_ECIG_CHARGE = 20;

export const CIGARETTE_BURN_PER_FRAME = 1 / (PUFFS_PER_CIGARETTE * 60);
export const ECIG_BURN_PER_FRAME = 1 / (PUFFS_PER_ECIG_CHARGE * 60);
export const IDLE_BURN = 0.00005;
