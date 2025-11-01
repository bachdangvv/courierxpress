import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booted, setBooted] = useState(false);

  // Khi app load, thử fetch user từ session
  useEffect(() => {
    if (user) {
    setBooted(true);
    return;
  }
  
    const currentPath = window.location.pathname;
    const skipHydrate =
      currentPath.startsWith("/agent/login") ||
      currentPath.startsWith("/customer/login") ||
      currentPath.startsWith("/login");

    if (skipHydrate) {
      setBooted(true);
      return;
    }

    const hydrate = async () => {
      try {
        // Gọi API /api/user để kiểm tra session
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setBooted(true);
      }
    };
    hydrate();
  }, []);

  // Login (Sanctum cookie)
  const agentlogin = async (email, password) => {
  await api.get("/sanctum/csrf-cookie");
  await api.post("/agent/login", {
    email: String(email).trim().toLowerCase(),
    password: String(password).trim(),
  });
  const { data } = await api.get("/auth/me");
  setUser(data);
  return data;
};

const customerlogin = async (email, password) => {
  await api.get("/sanctum/csrf-cookie");
  await api.post("/customer/login", {
    email: String(email).trim().toLowerCase(),
    password: String(password).trim(),
  });
  const { data } = await api.get("/auth/me");
  setUser(data);
  return data;
};

const adminlogin = async (email, password) => {
  await api.get("/sanctum/csrf-cookie");
  await api.post("/login", {
    email: String(email).trim().toLowerCase(),
    password: String(password).trim(),
  });
  const { data } = await api.get("/auth/me");
  setUser(data);
  return data;
};

  // Register
  const register = async ({ name, email, password, role }) => {
    await api.get("/sanctum/csrf-cookie");
    await api.post("/register", {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password).trim(),
      role: role || "customer",
    });
    const { data } = await api.get("/auth/me");
    setUser(data);
    return data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, booted, adminlogin, agentlogin, customerlogin, logout, register }}>
      {children}
    </AuthCtx.Provider>
  );
}