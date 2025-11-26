import { useState, useEffect, type ReactNode } from "react";
import Api from "../api/Api"; // axios 인스턴스
import { AuthContext } from "./AuthContext";
import { logoutUser } from "../api/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(() => {
    return sessionStorage.getItem("userName");
  });

  const login = (userName: string) => {
    setUser(userName);
    sessionStorage.setItem("userName", userName);
  };

  const logout = async () => {
    try {
      await logoutUser(); // ✅ 서버에도 로그아웃 요청
    } catch (err) {
      console.error("서버 로그아웃 실패 (무시 가능):", err);
    } finally {
      setUser(null);
      sessionStorage.removeItem("userName");
    }
  };

  useEffect(() => {
    console.log("AuthProvider에서 useeffect로 초기화 할 때 함수 실행 전 user",user);
    const restoreUser = async () => {
      try {
        const res = await Api.get("/users/me");
        setUser(res.data.name);
        sessionStorage.setItem("userName", res.data.name);
        console.log("restoreUser를 통해서 /me에 요청보내고 세팅 완료 setUser 완료")
      } catch {
        setUser(null);
        sessionStorage.removeItem("userName");
      }
    };

    restoreUser();
  }, []); // ✅ 빈 배열 → 마운트 시 1회만 실행

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
