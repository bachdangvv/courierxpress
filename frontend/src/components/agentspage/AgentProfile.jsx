import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";

export default function AgentProfile() {

  // const [noti,setNoti]=useState([]);
  // const [plac,setPlac]=useState({data:[]});
  // const [loc,setLoca]=useState({data:[]});
  // const [stat,setStat]=useState({data:[]});
  // const [avai,setAvai]=useState({data:[]});

  // const load = async ()=> {
  //   const [n, p, l, s, a] = await Promise.all([
  //     api.get('/agent/notifications'),
  //     api.get('/agent/placed'),
  //     api.get('/agent/couriers/{courier}/location'),
  //     api.get('/agent/couriers/{courier}/status'),
  //     api.get('/agent/availability')
  //   ]);
  //   setNoti(n.data.data); setPlac(p.data); setLoca(l.data); 
  //   setStat(s.data); setAvai(a.data);
  // };

  // useEffect(()=>{ load(); },[]);

  // useEffect(() => {
  //   if (!echo || !user?.agent?.id) return;
  //   const ch = echo.private(`agent.${user.agent.id}`)
  //     .listen(".status.updated", load)
  //     .listen(".courier.location", load);
  //   return () => {
  //     try { ch.stopListening(".status.updated").stopListening(".courier.location"); } catch { }
  //   };
  // }, [echo, user]);

  useEffect(() => {
    // Load agent data from localStorage
    const agentUser = localStorage.getItem("agentUser");
    if (agentUser) {
      try {
        const user = JSON.parse(agentUser);
        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          avatar: user.avatar || "",
        });
      } catch (e) {
        console.error("Error loading agent data:", e);
      }
    }
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thông tin đã được cập nhật!");
    // TODO: Call API to update profile
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-blue-600" />
              )}
            </div>
            <button className="absolute bottom-4 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-xl font-semibold">{profile.name}</h3>
          <p className="text-gray-500 text-sm">Agent ID: #AG-001</p>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="text-green-600 font-semibold">Đang hoạt động</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Đánh giá:</span>
              <span className="text-yellow-600 font-semibold">⭐ 4.8/5</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Chỉnh sửa thông tin</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Nhập họ tên..."
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="agent@example.com"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Email không thể thay đổi
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Phone className="inline w-4 h-4 mr-1" />
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="0123 456 789"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Địa chỉ
              </label>
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                rows="3"
                placeholder="Nhập địa chỉ của bạn..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Lưu thay đổi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
