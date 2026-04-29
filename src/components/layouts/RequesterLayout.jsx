import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getRequesterProfile,
  logout,
  getMyRequesterRequests,
} from "@/store/features/requester/requester.slice";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
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

  useEffect(() => {
    dispatch(getRequesterProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!requester?._id) return;

    socket.emit("join-requester", requester._id);

    const onStatusUpdate = (payload) => {
      toast.info(`Request status updated to: ${payload.status}`);
      dispatch(getMyRequesterRequests());
    };

    const onArrivalUpdate = (payload) => {
      toast.info("Your request has arrived! Please verify the PIN.");
      dispatch(getMyRequesterRequests());
    };

    socket.on("status_update", onStatusUpdate);
    socket.on("arrival_update", onArrivalUpdate);

    return () => {
      socket.off("status_update", onStatusUpdate);
      socket.off("arrival_update", onArrivalUpdate);
    };
  }, [dispatch, requester?._id]);

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
