import React from "react";
import { Bell, Search, Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/");
  };

  return (
    <header className="w-full flex items-center justify-between bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 py-3 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-3 w-full max-w-lg">
        {/* Burger Button (Mobile) */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-gray-600 hover:text-[#800000] transition"
        >
          <Menu size={22} />
        </button>

        {/* Search Bar */}
        <div className="hidden sm:flex items-center gap-3 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <Search className="text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent w-full text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-[#800000] transition">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info + Logout */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#800000] text-white flex items-center justify-center text-sm font-medium">
            {user?.firstname?.[0] || "U"}
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-800">
              {user ? `${user.firstname} ${user.lastname}` : "Guest"}
            </span>
            <span className="text-xs text-gray-500">{user?.role || "User"}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#800000] transition"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
