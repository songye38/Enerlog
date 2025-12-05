// src/api/behave.ts
import Api from "./Api";
import type { AxiosError } from "axios";
import type { EnergyLevel } from "../types/EnergyLevel";


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

export interface BehaveResponse {
    id: string;
    user_id: string;
    before_energy: EnergyLevel;
    after_energy?: EnergyLevel;
    before_description?: string;
    after_description?: string;
    status: string;
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

