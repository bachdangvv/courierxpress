import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, Lock, Save } from "lucide-react";

export default function CustomerProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  // 🔹 Giả sử API có endpoint GET /api/customer/profile
  useEffect(() => {
    axios
      .get("/api/customer/profile")
      .then((res) => setFormData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/customer/profile", formData);
      setMessage("✅ Thông tin cá nhân đã được cập nhật!");
    } catch (err) {
      setMessage("❌ Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("⚠️ Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      await axios.put("/api/customer/change-password", passwordData);
      setMessage("🔒 Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessage("❌ Đổi mật khẩu thất bại.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 mt-[50px]">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <User className="text-gray-600" /> Hồ sơ cá nhân
      </h1>

      {message && (
        <p className="text-center mb-4 text-sm text-gray-700">{message}</p>
      )}

      {/* Form thông tin cá nhân */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Họ và tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Email</label>
          <div className="flex items-center border rounded-lg p-2 bg-gray-50">
            <Mail className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Số điện thoại</label>
          <div className="flex items-center border rounded-lg p-2">
            <Phone className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Địa chỉ</label>
          <div className="flex items-center border rounded-lg p-2">
            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-5 py-2 mt-4 hover:bg-blue-700"
        >
          <Save className="w-4 h-4" /> Lưu thay đổi
        </button>
      </form>

      {/* Form đổi mật khẩu */}
      <hr className="my-8" />
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Lock className="text-gray-600" /> Thay đổi mật khẩu
      </h2>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Mật khẩu hiện tại</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Mật khẩu mới</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-gray-800 text-white rounded-lg px-5 py-2 hover:bg-gray-900"
        >
          <Lock className="w-4 h-4" /> Đổi mật khẩu
        </button>
      </form>
    </div>
  );
}
