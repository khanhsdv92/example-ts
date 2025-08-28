// src/auth/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

type User = { id: number; email: string; name?: string; role?: string } | null;
type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const me = async () => {
    try {
      const res = await API.get("/users/1"); // backend should provide /users/me
      setUser(res.data);
    } catch {
      console.log("Failed to fetch user data");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { me(); }, []);

  const login = async (email: string, password: string) => {
    const res = await API.post("/auth/login", { email, password });
    const { accessToken, refreshToken } = res.data;
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    await me();
  };

  const register = async (email: string, password: string, name?: string) => {
    await API.post("/users", { email, password, name });
    // auto login after register
    await login(email, password);
  };

  const logout = async () => {
    await API.post("/auth/logout"); // backend invalidate refresh tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
