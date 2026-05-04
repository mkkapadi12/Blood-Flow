import {
  getAllDispatcherRequests,
  getMyDispatcherRequests,
  acceptDispatcherRequest,
  pickupDispatcherRequest,
} from "@/store/features/dispatcher/dispatcher.slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Clock,
  Search,
  Truck,
  Check,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { getStatusColor, getUrgencyColor } from "@/lib/utils";

const AllRequestes = () => {
  const { allrequests, myrequests, loading } = useSelector(
    (state) => state.dispatcher,
  );
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("available"); // 'available' or 'my'

  useEffect(() => {
    dispatch(getAllDispatcherRequests());
    dispatch(getMyDispatcherRequests());
  }, [dispatch]);

  const onAccept = async (requestId) => {
    const toastId = toast.loading("Accepting request...");
    try {
      const result = await dispatch(
        acceptDispatcherRequest(requestId),
      ).unwrap();
      toast.success(result?.msg || "Request accepted", { id: toastId });
      dispatch(getAllDispatcherRequests());
      dispatch(getMyDispatcherRequests());
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error?.message || "Accept failed",
        { id: toastId },
      );
    }
  };

  const onPickup = async (requestId) => {
    const toastId = toast.loading("Marking request in-transit...");
    try {
      const result = await dispatch(
        pickupDispatcherRequest(requestId),
      ).unwrap();
      toast.success(result?.msg || "Request marked in-transit", {
        id: toastId,
      });
      dispatch(getMyDispatcherRequests());
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error?.message || "Pickup failed",
        { id: toastId },
      );
    }
  };

  const displayedRequests =
    activeTab === "available" ? allrequests : myrequests;

  return (
    <div className="p-4 md:p-6 w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Manage Requests
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse available requests or track your assigned deliveries.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <Link to="/dispatcher/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1 max-w-md">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "available"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("available")}
        >
          Available ({allrequests.length})
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "my"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("my")}
        >
          My Deliveries ({myrequests.length})
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && displayedRequests.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 mb-4">
            {activeTab === "available" ? (
              <Search className="w-6 h-6 text-gray-500" />
            ) : (
              <Truck className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {activeTab === "available"
              ? "No available requests"
              : "No assigned deliveries"}
          </h3>
          <p className="text-sm text-gray-400">
            {activeTab === "available"
              ? "There are currently no hospitals searching for drivers."
              : "You haven't accepted any requests yet."}
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {displayedRequests.map((request) => (
          <Card
            key={request._id}
            className="bg-gray-900 border-gray-800 overflow-hidden group hover:border-gray-700 transition-all duration-300"
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1 p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
                          activeTab === "available"
                            ? "bg-orange-500/10 border-orange-500/20"
                            : "bg-blue-500/10 border-blue-500/20"
                        }`}
                      >
                        <span
                          className={`font-bold ${activeTab === "available" ? "text-orange-400" : "text-blue-400"}`}
                        >
                          {request.bloodGroup || request.type}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">
                            {request?.hospital?.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase tracking-wider ${getUrgencyColor(request.urgency)}`}
                          >
                            {request.urgency}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5" />
                          {request.units} Unit{request.units > 1 ? "s" : ""} •{" "}
                          <Clock className="w-3 h-3 ml-1" />{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`md:hidden px-2.5 py-1 text-xs uppercase font-semibold ${getStatusColor(request.status)}`}
                    >
                      {request.status}
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-950/50 p-5 border-t md:border-t-0 md:border-l border-gray-800 flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 min-w-[200px]">
                  <Badge
                    variant="outline"
                    className={`hidden md:inline-flex px-3 py-1 text-xs uppercase font-semibold ${getStatusColor(request.status)}`}
                  >
                    {request.status}
                  </Badge>

                  <div className="flex w-full gap-2">
                    {activeTab === "available" ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => onAccept(request._id)}
                      >
                        <Check className="w-4 h-4 mr-1" /> Accept
                      </Button>
                    ) : (
                      request.status === "accepted" && (
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => onPickup(request._id)}
                        >
                          <Truck className="w-4 h-4 mr-1" /> Pickup
                        </Button>
                      )
                    )}
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border-0 group-hover:bg-gray-700 transition-colors"
                    >
                      <Link
                        to={`/dispatcher/requests/${request._id}`}
                        className="flex items-center justify-center gap-1"
                      >
                        Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllRequestes;
