import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getDispatcherProfile,
  logout,
  getAllDispatcherRequests,
  getMyDispatcherRequests,
} from "@/store/features/dispatcher/dispatcher.slice";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
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

  useEffect(() => {
    dispatch(getDispatcherProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!dispatcher?._id) return;

    socket.emit("join-dispatcher");

    const onNewRequest = (request) => {
      toast.info(`New request available from ${request.hospital || "Hospital"}`);
      dispatch(getAllDispatcherRequests());
    };

    const onStatusUpdate = (payload) => {
      dispatch(getAllDispatcherRequests());
      dispatch(getMyDispatcherRequests());
    };

    socket.on("new_request", onNewRequest);
    socket.on("status_update", onStatusUpdate);

    return () => {
      socket.off("new_request", onNewRequest);
      socket.off("status_update", onStatusUpdate);
    };
  }, [dispatch, dispatcher?._id]);

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
