import React from "react";
import { Menu, Bell } from "lucide-react";

const DispatcherHeader = ({ setSidebarOpen, dispatcher, pendingCount }) => {
  return (
    <header className="flex items-center gap-4 px-4 lg:px-6 h-14 bg-gray-900/80 backdrop-blur border-b border-gray-800 shrink-0">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-gray-400 hover:text-white p-1 rounded"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-white truncate">
          {dispatcher?.name?.split(" ")[0] || "Dispatcher"} — Control Panel
        </h1>
        <p className="text-[11px] text-gray-500 hidden sm:block">
          Manage and dispatch emergency blood requests
        </p>
      </div>

      {/* Pending requests badge */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-[11px] font-medium text-orange-400">
            {pendingCount} pending
          </span>
        </div>
      )}

      {pendingCount === 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-medium text-emerald-400 hidden sm:block">
            All clear
          </span>
        </div>
      )}

      <button className="relative text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
        <Bell className="w-4 h-4" />
        {pendingCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-orange-500 border border-gray-900" />
        )}
      </button>
    </header>
  );
};

export default DispatcherHeader;
