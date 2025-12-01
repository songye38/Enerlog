import Api from "./Api";
import type { AxiosError } from "axios";
import type { EnergyLevel } from "../types/EnergyLevel";

export interface TagOut {
    id: string;
    title: string;
    tag_type: "mental" | "body";
    created_at?: string;
    updated_at?: string;
}

// 사용자 기록용 태그 (선택 횟수 + 에너지 레벨 포함)
export interface UserTagOut extends TagOut {
    energy_level: number;      // 필수
    selected_count: number;    // 필수
}


export interface UserTagsResponse {
    tags: UserTagOut[];
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
export async function fetchUserTagsRecorded(): Promise<{ tags: UserTagOut[] }> {
  try {
    const res = await Api.get<UserTagOut[]>("/energy/user_tags_recorded", {
      withCredentials: true,
    });

    return { tags: res.data }; // 그대로 UserTagOut 배열로 반환
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const msg = axiosError.response?.data?.detail || "사용자 태그 조회 실패";
    throw new Error(msg);
  }
}

/*----------------------------------------------
 * ✅ 에너지 레벨 + 타입별로 그룹화
 ----------------------------------------------*/
export function groupTagsByEnergyAndType(tags: UserTagOut[]) {
    return tags.reduce<Record<number, { body: UserTagOut[]; mental: UserTagOut[] }>>(
        (acc, tag) => {
            const level = tag.energy_level; // 항상 존재
            if (!acc[level]) acc[level] = { body: [], mental: [] };
            acc[level][tag.tag_type].push(tag);
            return acc;
        },
        {}
    );
}