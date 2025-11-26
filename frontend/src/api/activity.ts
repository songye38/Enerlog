import Api from "./Api";
import type { AxiosError } from "axios";
import type { EnergyLevel } from "../types/EnergyLevel";

export interface ActivityTemplateOut {
  id: string; // UUID
  title: string;
  description?: string;
  duration_minutes?: number;
  good_point?: string;
  insight?: string;
  created_at: string;
  updated_at: string;
  energy_level: EnergyLevel; // 0~10 숫자 타입
}

export interface ActivityCreatePayload {
    title : string;
    description : string;
    is_public : boolean;
    duration_minutes? : string;
    good_point? : string;
    insight? : string;
    energy_level: number; 
}

/*----------------------------------------------
 * ✅ ActivityTemplate 리스트 가져오기
 ----------------------------------------------*/
export async function fetchActivityTemplates(): Promise<ActivityTemplateOut[]> {
  try {
    const res = await Api.get("/activities/templates");
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const msg = axiosError.response?.data?.detail || "ActivityTemplate 조회 실패";
    throw new Error(msg);
  }
}


/*----------------------------------------------
 * ✅ 직접 Activity 만들기
 ----------------------------------------------*/
export async function createActivity(payload: Omit<ActivityCreatePayload, "user_id">) {
    console.log("사용자가 만든 활동 저장 payload 데이터:",payload); // 🔹 여기에 찍기
  try {
    const res = await Api.post("/activities/", payload, {
      withCredentials: true, // ⚡ 인증 쿠키 자동 포함
    });
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const msg = axiosError.response?.data?.detail || "Activity 생성 실패";
    throw new Error(msg);
  }
}