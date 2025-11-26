import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const Api = axios.create({
  baseURL: "https://api.enerlog.kr",
  withCredentials: true, // ✅ 쿠키 자동 전송
});

// 이제 요청 인터셉터에서 Authorization 헤더 삽입 필요 없음
// 왜냐면 서버가 쿠키에서 access_token 확인

// 👇 응답 인터셉터 (4단계)
Api.interceptors.response.use(
  (response) => response, // 성공 시 그대로 리턴
  async (error) => {
    const originalRequest = error.config;

    // 액세스 토큰 만료 (401 Unauthorized) + 재시도 안 했을 때
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // refresh_token은 httponly 쿠키에 있으므로 그대로 withCredentials 사용
        const res = await axios.post(
          "https://api.enerlog.kr/users/refresh",
          {},
          { withCredentials: true }
        );

        console.log("에러 방지용",res);
        
        return Api(originalRequest); // 원래 요청 재시도
      } catch (refreshError) {
        console.error("리프레시 토큰도 만료됨");
        // 로그아웃 처리
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ✅ 로그인 상태 복원 + 세션 저장
export const useRestoreUser = () => {

  console.log("useRestoreUser 제일 상단 부분",useRestoreUser);
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) return; // 이미 로그인 상태면 restore 호출 안 함

    Api.get("/users/me")
      .then((res) => {
        setUser(res.data.name);
        sessionStorage.setItem("userName", res.data.name);
      })
      .catch(() => {
        setUser(null);
        sessionStorage.removeItem("userName");
      });
  }, [user, setUser]); // 의존성에 setUser도 추가
};

export default Api;