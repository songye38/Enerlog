import type { ColorSecondary } from "./Colors";
export type ConditionType = "recentEnergy" | "recoveryIndex" | "actRage";

export interface ConditionInfo {
  title: string;
  description: string;
  bgColor: ColorSecondary; // secondary 컬러 이름으로 저장
}

export const CONDITION_TYPES: Record<ConditionType, ConditionInfo> = {
  recentEnergy: {
    title: "최근 에너지 레벨",
    description: "최근 3일 평균 에너지 상태",
    bgColor: "yellowDefault",
  },
  recoveryIndex: {
    title: "회복 지수",
    description: "지난 3일간의 에너지 변화량",
    bgColor: "pinkDefault",
  },
  actRage: {
    title: "행동 실행률",
    description: "지난 3일간 실행 → 기록으로 이어진 비율",
    bgColor: "skyDefault",
  },
};
