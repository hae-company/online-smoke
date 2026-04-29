export type CigaretteType = "regular" | "ecig";
export type SmokingPhase = "smoking" | "finished" | "pack" | "grabbing";

export interface BrandConfig {
  id: string;
  name: string;
  packColor: string;
  packAccent: string;
  filterColor: string;
  paperColor: string;
  thickness: number; // 1 = normal
  flavor: string;
}

export const BRANDS: BrandConfig[] = [
  {
    id: "dunshil",
    name: "던쉴",
    packColor: "#1a237e",
    packAccent: "#c9a84c",
    filterColor: "#c8924a",
    paperColor: "#f0ebe0",
    thickness: 1,
    flavor: "클래식 풀 플레이버",
  },
  {
    id: "maildseven",
    name: "마일드나인",
    packColor: "#1565c0",
    packAccent: "#e0e0e0",
    filterColor: "#e0c9a0",
    paperColor: "#f5f2ec",
    thickness: 0.9,
    flavor: "부드러운 라이트",
  },
  {
    id: "malporo",
    name: "말뽀로",
    packColor: "#c62828",
    packAccent: "#fff",
    filterColor: "#d4a050",
    paperColor: "#f0ebe0",
    thickness: 1.05,
    flavor: "진한 레드",
  },
  {
    id: "essae",
    name: "에쎄이",
    packColor: "#4a148c",
    packAccent: "#ce93d8",
    filterColor: "#bfa07a",
    paperColor: "#f8f4ef",
    thickness: 0.75,
    flavor: "슬림 퍼플",
  },
  {
    id: "rejjong",
    name: "레쫑",
    packColor: "#004d40",
    packAccent: "#80cbc4",
    filterColor: "#a0d0a0",
    paperColor: "#f0ebe0",
    thickness: 0.85,
    flavor: "프레쉬 멘솔",
  },
  {
    id: "deeseu",
    name: "디쓰",
    packColor: "#212121",
    packAccent: "#757575",
    filterColor: "#333333",
    paperColor: "#e8e8e8",
    thickness: 0.8,
    flavor: "다크 슬림",
  },
];

export const INHALE_THRESHOLD = 0.08;
export const PUFFS_PER_CIGARETTE = 10;
export const PUFFS_PER_ECIG_CHARGE = 20;

export const CIGARETTE_BURN_PER_FRAME = 1 / (PUFFS_PER_CIGARETTE * 60);
export const ECIG_BURN_PER_FRAME = 1 / (PUFFS_PER_ECIG_CHARGE * 60);
export const IDLE_BURN = 0.00005;

export const PINCH_THRESHOLD = 0.06;

export const ECIG_CONFIG = {
  label: "전자담배",
  bodyColor: "#2a2a2a",
  ledColor: "#00aaff",
} as const;
