import {
  getRequesterProfile,
  getMyRequesterRequests,
} from "@/store/features/requester/requester.slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Activity,
  Truck,
  AlertTriangle,
  PlusCircle,
  ChevronRight,
  Clock,
} from "lucide-react";
import CreateRequestForm from "@/pages/requester/components/CreateRequestForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getUrgencyColor } from "@/lib/utils";

const RequesterDashboard = () => {
  const { requester, myRequests, loading } = useSelector(
    (state) => state.requester,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRequesterProfile());
    dispatch(getMyRequesterRequests());
  }, [dispatch]);

  const totalRequests = myRequests.length;
  const inTransitRequests = myRequests.filter(
    (r) => r.status === "in-transit",
  ).length;
  const criticalRequests = myRequests.filter(
    (r) => r.urgency === "critical" && r.status !== "delivered",
  ).length;
  const recentRequests = myRequests.slice(0, 3);

  return (
    <div className="p-4 md:p-6 w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome, {requester?.name || "Requester"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your emergency blood requests and track their status.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Link to="/requester/requests" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              View All Requests
            </Link>
          </Button>
          <CreateRequestForm>
            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </CreateRequestForm>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Requests
                </p>
                <p className="text-3xl font-bold mt-1 text-white">
                  {totalRequests}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                <Activity className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">In Transit</p>
                <p className="text-3xl font-bold mt-1 text-blue-400">
                  {inTransitRequests}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Critical Active
                </p>
                <p className="text-3xl font-bold mt-1 text-red-400">
                  {criticalRequests}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Requests</h2>
          {myRequests.length > 0 && (
            <Link
              to="/requester/requests"
              className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : recentRequests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
            <Activity className="w-8 h-8 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No requests yet
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              You haven't created any emergency blood requests.
            </p>
            <CreateRequestForm>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create First Request
              </Button>
            </CreateRequestForm>
          </div>
        ) : (
          <div className="grid gap-3">
            {recentRequests.map((request) => (
              <Card
                key={request._id}
                className="bg-gray-900 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 shrink-0">
                      <span className="font-bold text-red-400 text-lg">
                        {request.bloodGroup || request.type}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white line-clamp-1">
                          {request.hospital}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase shrink-0 ${getUrgencyColor(request.urgency)}`}
                        >
                          {request.urgency}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        {request.units} Unit{request.units > 1 ? "s" : ""} •{" "}
                        <Clock className="w-3 h-3 ml-1" />{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <Badge
                        variant="outline"
                        className={`px-2.5 py-1 text-xs uppercase font-semibold ${getStatusColor(request.status)}`}
                      >
                        {request.status}
                      </Badge>
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                      >
                        <Link to={`/requester/requests/${request._id}`}>
                          Details <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequesterDashboard;
