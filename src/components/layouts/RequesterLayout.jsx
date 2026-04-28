import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/features/requester/requester.slice";
import RequesterSidebar from "@/pages/requester/components/RequesterSidebar";
import RequesterHeader from "@/pages/requester/components/RequesterHeader";

const RequesterLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { requester } = useSelector((state) => state.requester);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/requester/login");
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <RequesterSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        requester={requester}
        handleLogout={handleLogout}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <RequesterHeader
          setSidebarOpen={setSidebarOpen}
          requester={requester}
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

export default RequesterLayout;
