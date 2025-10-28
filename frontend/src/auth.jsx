// src/auth.jsx (core parts)
import { createContext, useContext, useEffect, useState } from "react";
import api, { setToken } from "./api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booted, setBooted] = useState(false);

  // boot: attach token if present, then fetch /auth/me
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);

    const hydrate = async () => {
      if (!t) {
        setBooted(true);
        return;
      } // no token => unauthenticated
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user || data); // support both shapes
      } catch (err) {
        // 401 -> token invalid/expired; clear silently (do NOT call /logout)
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setBooted(true);
      }
    };
    hydrate();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email: String(email).trim().toLowerCase(),
      password: String(password).trim(),
    });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user; // let caller redirect by role
  };

  // Register function for agents and customers
  const register = async ({ name, email, password, role }) => {
    const { data } = await api.post("/auth/register", {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password).trim(),
      role: role || "customer",
    });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, booted, login, logout, register }}>
      {children}
    </AuthCtx.Provider>
  );
}
