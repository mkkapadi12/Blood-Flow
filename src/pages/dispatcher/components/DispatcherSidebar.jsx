import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  X,
  Droplets,
  ChevronRight,
  Radio,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dispatcher/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "All Requests",
    to: "/dispatcher/requests",
    icon: ClipboardList,
  },
  {
    label: "Settings",
    to: "/dispatcher/Settings",
    icon: Settings,
  },
];

const DispatcherSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  dispatcher,
  pendingCount,
  handleLogout,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/30">
            <Droplets className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="font-bold text-white tracking-tight leading-none">
              BloodFlow
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
              Dispatcher
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live badge */}
        <div className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/8 border border-orange-500/15">
          <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span className="text-xs font-medium text-orange-400">
            Dispatch Active
          </span>
          {pendingCount > 0 && (
            <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-[10px] font-bold text-white">
              {pendingCount > 9 ? "9+" : pendingCount}
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      isActive
                        ? "text-orange-400"
                        : "text-gray-500 group-hover:text-gray-300"
                    )}
                  />
                  <span>{label}</span>
                  {label === "All Requests" && pendingCount > 0 && (
                    <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400 border border-orange-500/30">
                      {pendingCount}
                    </span>
                  )}
                  {isActive && !pendingCount && (
                    <ChevronRight className="w-3 h-3 ml-auto text-orange-400/60" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800/60">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-orange-400">
                {dispatcher?.name?.[0]?.toUpperCase() || "D"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {dispatcher?.name || "Dispatcher"}
              </p>
              <p className="text-[11px] text-gray-500 truncate">
                {dispatcher?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/8 border border-transparent hover:border-red-500/15 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default DispatcherSidebar;
