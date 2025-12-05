import { createContext } from "react";

export interface AuthContextType {
  user: string | null;
  loading: boolean;                 // ✅ 추가
  login: (userName: string, token?: string) => void;
  logout: () => void;
  setUser: (name: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
