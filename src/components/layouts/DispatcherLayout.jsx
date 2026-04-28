import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/features/dispatcher/dispatcher.slice";
import DispatcherSidebar from "@/pages/dispatcher/components/DispatcherSidebar";
import DispatcherHeader from "@/pages/dispatcher/components/DispatcherHeader";

const DispatcherLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dispatcher, allrequests } = useSelector((state) => state.dispatcher);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pendingCount = allrequests?.length || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/dispatcher/login");
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <DispatcherSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        dispatcher={dispatcher}
        pendingCount={pendingCount}
        handleLogout={handleLogout}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DispatcherHeader
          setSidebarOpen={setSidebarOpen}
          dispatcher={dispatcher}
          pendingCount={pendingCount}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DispatcherLayout;
