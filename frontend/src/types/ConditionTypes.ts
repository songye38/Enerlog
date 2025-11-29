import type { ColorSecondary } from "./Colors";
import type { TagOut } from "../api/energy";
export type ConditionType = "recentEnergy" | "recoveryIndex" | "actRage";


export interface TagData {
  label: string;
  count?: number;
  isSelected?: boolean; // 🔹 선택 상태 추가
  originalTag?: TagOut;    // 🔹 원본 태그 정보 (서버 전송용)
}

export interface ConditionSection {
  title: string;       // ex: "나의 신체상태는?"
  tags: TagData[];     // ex: [{label: "...", count: 12}, ...]
}

export interface ConditionListPayload {
  description?: string;         // 전체를 설명하는 문구 (optional)
  sections: ConditionSection[]; // 여러 개의 섹션
}

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
