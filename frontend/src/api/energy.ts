import Api from "./Api";
import type { AxiosError } from "axios";
import type { EnergyLevel } from "../types/EnergyLevel";

export interface TagOut {
  id: string;
  title: string;
  type: "mental" | "body";
  energy_level?: number;
  selected_count?: number;
  created_at?: string;
  updated_at?: string;
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

/*----------------------------------------------
 * ✅ 전체 사용자 기록 태그 가져오기
 ----------------------------------------------*/
export async function fetchUserTagsRecorded(): Promise<UserTagsResponse> {
  try {
    const res = await Api.get("/user_tags_recorded", {
      withCredentials: true, // 인증 쿠키 포함
    });

    return { tags: res.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const msg =
      axiosError.response?.data?.detail ||
      "사용자 태그 조회 실패";
    throw new Error(msg);
  }
}

/*----------------------------------------------
 * ✅ 에너지 레벨 + 타입별로 그룹화
 ----------------------------------------------*/
export function groupTagsByEnergyAndType(tags: TagOut[]) {
  return tags.reduce<Record<number, { body: TagOut[]; mental: TagOut[] }>>(
    (acc, tag) => {
      // energy_level이 없으면 건너뜀
      if (tag.energy_level === undefined) return acc;

      const level = tag.energy_level;
      if (!acc[level]) acc[level] = { body: [], mental: [] };
      acc[level][tag.type].push(tag);
      return acc;
    },
    {}
  );
}