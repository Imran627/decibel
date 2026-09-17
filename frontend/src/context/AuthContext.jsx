import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("hrm_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.me();
      setUser(res.data.data);
    } catch {
      localStorage.removeItem("hrm_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const { token, user } = res.data.data;
    localStorage.setItem("hrm_token", token);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("hrm_token");
      setUser(null);
    }
  };

  const can = (permission) => {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    return user.permissions?.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
