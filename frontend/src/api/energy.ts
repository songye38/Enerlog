import Api from "./Api";
import type { AxiosError } from "axios";
import type { EnergyLevel } from "../types/EnergyLevel";

export interface TagOut {
  id: string;
  title: string;
  type: "mental" | "body";
  created_at: string;
  updated_at: string;
}

export interface UserTagsResponse {
  tags: TagOut[];
}

/*----------------------------------------------
 * ✅ 에너지 레벨 기반 사용자 태그 가져오기
 ----------------------------------------------*/
export async function fetchUserTags(energyLevel: EnergyLevel) {
    try {
        const res = await Api.get("/energy/tags", {
            params: { energy_level: energyLevel },
            withCredentials: true, // 인증 쿠키 포함
        });

        return res.data; // { tags: [...] }
    } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const msg =
            axiosError.response?.data?.detail ||
            "사용자 태그 조회 실패";
        throw new Error(msg);
    }
}