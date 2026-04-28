import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  LogOut,
  X,
  Droplets,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/requester/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Requests",
    to: "/requester/requests",
    icon: ClipboardList,
  },
  {
    label: "New Request",
    to: "/requester/new-request",
    icon: PlusCircle,
  },
];

const RequesterSidebar = ({ sidebarOpen, setSidebarOpen, requester, handleLogout }) => {
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
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/15 border border-red-500/30">
            <Droplets className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="font-bold text-white tracking-tight leading-none">
              BloodFlow
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
              Requester
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
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
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
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
                        ? "text-red-400"
                        : "text-gray-500 group-hover:text-gray-300"
                    )}
                  />
                  <span>{label}</span>
                  {isActive && (
                    <ChevronRight className="w-3 h-3 ml-auto text-red-400/60" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800/60">
            <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-red-400">
                {requester?.name?.[0]?.toUpperCase() || "R"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {requester?.name || "Requester"}
              </p>
              <p className="text-[11px] text-gray-500 truncate">
                {requester?.email || ""}
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

export default RequesterSidebar;
