import React, { useState } from "react";
import { Bell, LogOut, Edit2, Camera } from "lucide-react";
import { useAuth } from "../../auth";

export default function AgentHeader() {
  // Get agent info from localStorage
  const agentUser = JSON.parse(localStorage.getItem("agentUser") || "{}");
  const [name, setName] = useState(agentUser.name || "Agent");
  const [avatar, setAvatar] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const { logout } = useAuth();

  // Get first letter for default avatar
  const firstLetter = name ? name[0].toUpperCase() : "A";

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle name change
  const handleNameChange = (e) => setName(e.target.value);
  const saveName = () => {
    setEditingName(false);
    // Optionally, update backend here
    localStorage.setItem("agentUser", JSON.stringify({ ...agentUser, name }));
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="flex items-center justify-between bg-white border-b px-6 py-3 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-700">Agent Dashboard</h1>

      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          {/* Avatar: show uploaded or default letter */}
          <label className="relative cursor-pointer group">
            {avatar ? (
              <img
                src={avatar}
                alt="Agent Avatar"
                className="w-9 h-9 rounded-full object-cover border"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-lg font-bold text-white border">
                {firstLetter}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{ width: "100%", height: "100%" }}
            />
            <span className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow group-hover:block hidden">
              <Camera size={16} className="text-gray-600" />
            </span>
          </label>

          {/* Name: editable */}
          {editingName ? (
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={saveName}
              className="border rounded px-2 py-1 text-gray-700 font-medium w-24"
              autoFocus
            />
          ) : (
            <span className="text-gray-700 font-medium flex items-center">
              {name}
              <button
                className="ml-1 text-gray-400 hover:text-blue-600"
                onClick={() => setEditingName(true)}
                title="Edit name"
                type="button"
              >
                <Edit2 size={16} />
              </button>
            </span>
          )}

          {/* Logout button */}
          <button
            className="ml-2 px-2 py-1 rounded bg-gray-100 hover:bg-red-100 text-gray-600 flex items-center gap-1"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
