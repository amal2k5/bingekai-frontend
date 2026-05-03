import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000 - 10000; 
  } catch {
    return false;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((access, refresh, userData) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));

    setToken(access);
    setUser(userData);
  }, []);

const logout = useCallback(() => {
  console.log("=== LOGOUT CALLED ===");
  console.trace(); 
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  setToken(null);
  setUser(null);
}, []);

const isAuthenticated = !!(token || localStorage.getItem("refresh"));

  const value = useMemo(() => ({
    token,
    user,
    login,
    logout,
    isAuthenticated,  
  }), [token, user, login, logout, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}