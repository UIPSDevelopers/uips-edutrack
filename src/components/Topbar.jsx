import React from "react";
import { Bell, Search, Menu } from "lucide-react";

export default function Topbar({ onToggleSidebar }) {
  return (
    <header className="w-full flex items-center justify-between bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 py-3 sticky top-0 z-30">
      <div className="flex items-center gap-3 w-full max-w-lg">
        {/* Burger Button for Mobile */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-gray-600 hover:text-[#800000] transition"
        >
          <Menu size={22} />
        </button>

        <div className="hidden sm:flex items-center gap-3 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <Search className="text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent w-full text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-gray-500 hover:text-[#800000] transition">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#800000] text-white flex items-center justify-center text-sm font-medium">
            A
          </div>
          <span className="text-sm text-gray-700 font-medium hidden sm:block">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
