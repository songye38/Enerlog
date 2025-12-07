// src/api/energyStatsApi.ts
import Api from "./Api";
import type { AxiosError } from "axios";

export interface EnergyStatsResponse {
  average_energy?: number | null;
  change?: number | null;
  ratio?: number | null;
}

/*----------------------------------------------
 * ✅ 최근 3일 평균 에너지 상태
 ----------------------------------------------*/
export async function fetchAverageEnergyLast3Days(): Promise<number | null> {
  try {
    const res = await Api.get<EnergyStatsResponse>("/stats/energy/average-3days",{
      withCredentials: true,
    });
    return res.data.average_energy ?? null;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const msg = axiosError.response?.data?.detail || "최근 3일 평균 에너지 조회 실패";
    throw new Error(msg);
  }
}

/*----------------------------------------------
 * ✅ 지난 3일간 에너지 변화량
 ----------------------------------------------*/
export async function fetchEnergyChangeLast3Days(): Promise<number | null> {
  try {
    const res = await Api.get<EnergyStatsResponse>("/stats/energy/change-3days",{
      withCredentials: true,
    });
    return res.data.change ?? null;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const msg = axiosError.response?.data?.detail || "지난 3일 에너지 변화량 조회 실패";
    throw new Error(msg);
  }
}

/*----------------------------------------------
 * ✅ 지난 3일간 실행 → 기록 이어진 비율
 ----------------------------------------------*/
export async function fetchExecuteToRecordRatioLast3Days(): Promise<number | null> {
  try {
    const res = await Api.get<EnergyStatsResponse>("/stats/execute-to-record-ratio-3days",{
      withCredentials: true,
    });
    return res.data.ratio ?? null;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const msg = axiosError.response?.data?.detail || "실행 → 기록 비율 조회 실패";
    throw new Error(msg);
  }
}
