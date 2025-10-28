import React, { useState } from "react";
import { Truck, Mail, Lock } from "lucide-react";
import axios from "axios";

export default function AgentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      // Check if user is an agent
      if (res.data.user.role !== "agent") {
        setError("Tài khoản này không phải là Agent!");
        setLoading(false);
        return;
      }

      // Save token and user info
      localStorage.setItem("agentToken", res.data.token);
      localStorage.setItem("agentUser", JSON.stringify(res.data.user));

      window.location.href = "/agent/dashboard";
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Sai email hoặc mật khẩu!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* LEFT IMAGE / ILLUSTRATION */}
      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center">
        <div className="text-center text-white px-10">
          <Truck className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">
            CourierXpress Agent Portal
          </h1>
          <p className="text-blue-100 leading-relaxed text-lg">
            Kết nối – Giao hàng – Thành công cùng CourierXpress. Truy cập để
            nhận và quản lý đơn hàng của bạn.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/679/679720.png"
            alt="Delivery illustration"
            className="w-72 mx-auto mt-8 opacity-90"
          />
        </div>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="flex w-full md:w-1/2 justify-center items-center">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-10 mx-4">
          <div className="flex justify-center mb-4">
            <Truck className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Đăng nhập Agent
          </h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                <Mail className="inline w-4 h-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                placeholder="agent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                <Lock className="inline w-4 h-4 mr-1" />
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-5">
            Quên mật khẩu?{" "}
            <a href="/agent/reset" className="text-blue-600 hover:underline">
              Khôi phục tại đây
            </a>
          </p>

          <p className="text-sm text-center text-gray-500 mt-3">
            Chưa có tài khoản?{" "}
            <a
              href="/agent/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Đăng ký trở thành Agent
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
