import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booted, setBooted] = useState(false);

  // Khi app load, thử fetch user từ session
  useEffect(() => {
    const hydrate = async () => {
      try {
        // Gọi API /api/user để kiểm tra session
        const { data } = await api.get("/api/user");
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
  const login = async (email, password) => {
    // 1. Lấy CSRF cookie trước
    await api.get("/sanctum/csrf-cookie");

    // 2. Gửi yêu cầu login
    await api.post("/login", {
      email: String(email).trim().toLowerCase(),
      password: String(password).trim(),
    });

    // 3. Sau khi login thành công, gọi lại /api/user để lấy thông tin
    const { data } = await api.get("/api/user");
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
    const { data } = await api.get("/api/user");
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
    <AuthCtx.Provider value={{ user, booted, login, logout, register }}>
      {children}
    </AuthCtx.Provider>
  );
}