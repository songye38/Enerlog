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
    user_id : string;
    title : string;
    description : string;
    is_public : false;
    duration_minutes? : number;
    good_point? : string;
    insight? : string;
    energy_level: EnergyLevel; // 0~10 숫자 타입
}

// class ActivityCreate(BaseModel):
//     user_id: UUID
//     title: str
//     description: Optional[str] = None
//     is_public: Optional[bool] = False
//     duration_minutes: Optional[int] = None
//     good_point: Optional[str] = None
//     insight: Optional[str] = None
//         energy_level: EnergyLevelEnum  

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
