import React from "react";
import { Menu, Bell } from "lucide-react";

const RequesterHeader = ({ setSidebarOpen, requester }) => {
  return (
    <header className="flex items-center gap-4 px-4 lg:px-6 h-14 bg-gray-900/80 backdrop-blur border-b border-gray-800 shrink-0">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-gray-400 hover:text-white p-1 rounded"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-white truncate">
          Welcome back, {requester?.name?.split(" ")[0] || "Requester"}
        </h1>
        <p className="text-[11px] text-gray-500 hidden sm:block">
          Track your emergency requests in real-time
        </p>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] font-medium text-emerald-400 hidden sm:block">
          Live
        </span>
      </div>

      <button className="relative text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
        <Bell className="w-4 h-4" />
      </button>
    </header>
  );
};

export default RequesterHeader;
