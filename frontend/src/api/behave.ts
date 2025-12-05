// src/api/behave.ts
import Api from "./Api";
import type { AxiosError } from "axios";
import type { EnergyLevel } from "../types/EnergyLevel";
import type { TagOut } from "./energy";


export interface TagPayload {
    id?: string; // preset tag면 id 있음
    title: string;
    type: "body" | "mental";
}

export interface BehaveCreatePayload {
    before_energy: EnergyLevel;
    before_description?: string;
    status: "emotion_recorded" | "activity_pending" | "completed";
    user_tags?: TagPayload[];
    preset_tags?: TagPayload[];
}

export interface BehaveCompletePayload {
    after_energy: EnergyLevel;
    after_description?: string;
    status: "emotion_recorded" | "activity_pending" | "completed";
    user_tags?: TagPayload[];
    preset_tags?: TagPayload[];
}

export interface BehaveResponse {
    id: string;
    user_id: string;
    before_energy: EnergyLevel;
    after_energy?: EnergyLevel;
    before_description?: string;
    after_description?: string;
    status: string;
}

export interface BehaveCompleteResponse {
    id: string;

    before_energy: EnergyLevel | null;
    after_energy: EnergyLevel | null;

    before_description: string | null;
    after_description: string | null;

    mental_before: TagOut[];
    mental_after: TagOut[];
    body_before: TagOut[];
    body_after: TagOut[];
}



export interface RecentPendingBehaveResponse {
  behave_id: string;
  user_id: string;
  activity_id?: string;
  activity_template_id?: string;
  title: string;
  created_at: string; // ISO string
  before_energy: EnergyLevel;
}


/*----------------------------------------------
 * ✅ Behave 생성
 ----------------------------------------------*/
export async function createBehave(payload: BehaveCreatePayload): Promise<BehaveResponse> {
    try {
        const res = await Api.post("/behave/", payload, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const msg = axiosError.response?.data?.detail || "Behave 생성 실패";
        throw new Error(msg);
    }
}


/*----------------------------------------------
 * ✅ 선택한 activity_id / activity_template_id로 Behave 업데이트
 ----------------------------------------------*/
export async function updateBehaveWithActivity(
    behaveId: string,
    activity: { id: string; type: "user" | "template" }
): Promise<BehaveResponse> {
    try {
        const payload =
            activity.type === "user"
                ? { activity_id: activity.id }
                : { activity_template_id: activity.id };

        const res = await Api.patch(
            `/behave/${behaveId}/select-activity`,
            payload,
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const msg = axiosError.response?.data?.detail || "활동 선택 저장 실패";
        throw new Error(msg);
    }
}

/*-----------------------------------------------------------------
 * ✅ 24시간 내 진행 대기 상태(activity_pending)인 behave들을 받아오는 함수
 -----------------------------------------------------------------*/
export async function fetchRecentPendingBehaves(): Promise<RecentPendingBehaveResponse[]> {
  try {
    const res = await Api.get("/behave/recent-pending", { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch recent pending behaves:", error);
    return [];
  }
}


/*----------------------------------------------
 * ✅ Behave 완료(After 단계 업데이트)
 ----------------------------------------------*/
export async function completeBehave(
    behaveId: string,
    payload: BehaveCompletePayload
): Promise<BehaveCompleteResponse> {
    try {
        const res = await Api.patch(`/behave/${behaveId}/complete`, payload, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const msg = axiosError.response?.data?.detail || "Behave 업데이트 실패";
        throw new Error(msg);
    }
}
