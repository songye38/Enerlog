
import Api from "./Api";
import type { AxiosError } from "axios";


export interface RegisterPayload {
  nickname: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserOut {
  id: number;
  name: string;
  email: string;
  created_at: string;
}


/*----------------------------------------------

 * ✅ 회원가입

 ----------------------------------------------*/
export async function registerUser(payload: RegisterPayload): Promise<UserOut> {
  try {
    const res = await Api.post("users/register", payload);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>; // 서버 에러 타입 지정
    const msg = axiosError.response?.data?.detail || "회원가입 실패";
    throw new Error(msg);
  }
}

/*----------------------------------------------

 * ✅ 로그인

 ----------------------------------------------*/
export async function loginUser(payload: LoginPayload): Promise<UserOut> {
  try {
    const res = await Api.post("users/login", payload);
    return res.data; // Axios는 인터셉터가 이미 withCredentials 포함, 401 자동 처리
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>; // 서버 에러 타입 지정
    const msg = axiosError.response?.data?.detail || "로그인 실패";
    throw new Error(msg);
  }
}

/*----------------------------------------------

 * ✅ 로그아웃

 ----------------------------------------------*/
export async function logoutUser(): Promise<{ msg: string }> {
  try {
    const res = await Api.post("users/logout");
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>; // 서버 에러 타입 지정
    const msg = axiosError.response?.data?.detail || "로그아웃 실패";
    throw new Error(msg);
  }
}

