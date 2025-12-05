import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const Api = axios.create({
  baseURL: "https://api.enerlog.kr",
  withCredentials: true, // 쿠키 자동 전송
});

// 응답 인터셉터
Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 액세스 토큰 만료 (401) + 재시도 안 했을 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh_token은 httponly 쿠키 사용 → 그대로 요청
        const res = await axios.post(
          "https://api.enerlog.kr/users/refresh",
          {},
          { withCredentials: true }
        );
        console.log("res",res);

        return Api(originalRequest); // 원래 요청 재시도
      } catch (refreshError) {
        console.error("리프레시 토큰 만료 → 강제 로그아웃 처리");

        // 1) 클라이언트 상태 초기화
        sessionStorage.removeItem("userName");

        // 2) SPA 내에서 로그인 페이지로 이동하도록 이벤트 발생
        window.dispatchEvent(new CustomEvent("forceLogout"));

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ✅ 로그인 상태 복원 + 세션 저장
export const useRestoreUser = () => {
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) return; // 이미 로그인 상태면 복원 호출 안 함

    Api.get("/users/me")
      .then((res) => {
        if (res.data?.name) {
          setUser(res.data.name);
          sessionStorage.setItem("userName", res.data.name);
        }
      })
      .catch(() => {
        setUser(null);
        sessionStorage.removeItem("userName");
      });
  }, [user, setUser]);
};

export default Api;
