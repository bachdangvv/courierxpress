import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import api from "../api";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault(); // prevent native form submit to :5173
    setErr("");

    // ⬇️ Temporary debug first
    await api
      .post("/debug/echo", { email, password })
      .then((r) => console.log("🔍 Backend received:", r.data))
      .catch((err) =>
        console.error("Debug error:", err?.response?.data || err)
      );

    try {
      const u = await login(email, password);
      // role-based redirect
      if (u.role === "admin") {
        nav("/admin-dashboard", { replace: true });
      } else {
        nav("/" + u.role, { replace: true });
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Login failed";
      setErr(msg);
      console.error("Login error", e?.response?.data || e);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{ maxWidth: 360, margin: "4rem auto", display: "grid", gap: 12 }}
    >
      <h2>Login</h2>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <button type="submit">Login</button>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
    </form>
  );
}
