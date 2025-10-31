import React, { useState } from "react";
import { Truck, Mail, Lock, User } from "lucide-react";
import axios from "axios";

export default function CustomerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Invalid Password!");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "customer",
      });
      // Save token and redirect to dashboard
      localStorage.setItem("customerToken", res.data.token);
      localStorage.setItem("customerUser", JSON.stringify(res.data.user));
      alert("Đăng ký thành công! Chào mừng bạn đến với CourierXpress.");
      window.location.href = "/customer/dashboard";
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(", "));
      } else {
        setError("Fail. Please try again!");
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
            Become Customer of CourierXpress
          </h1>
          <p className="text-blue-100 leading-relaxed text-lg">
            Join our professional delivery team. Earn flexible income and grow
            your career with us.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2769/2769339.png"
            alt="Customer illustration"
            className="w-72 mx-auto mt-8 opacity-90"
          />
        </div>
      </div>

      {/* RIGHT REGISTRATION FORM */}
      <div className="flex w-full md:w-1/2 justify-center items-center">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-10 mx-4">
          <div className="flex justify-center mb-4">
            <Truck className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Register Customer
          </h2>

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                <User className="inline w-4 h-4 mr-1" />
                Fullname
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your fullname..."
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                <Mail className="inline w-4 h-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="customer@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                <Lock className="inline w-4 h-4 mr-1" />
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters..."
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                <Lock className="inline w-4 h-4 mr-1" />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password..."
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-5">
            Already have an account?{" "}
            <a
              href="/customer/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login here
            </a>
          </p>

          <p className="text-xs text-center text-gray-400 mt-4">
            By registering, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
