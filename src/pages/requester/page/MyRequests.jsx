import { Button } from "@/components/ui/button";
import { getMyRequesterRequests } from "@/store/features/requester/requester.slice";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Clock, MapPin, Activity, ChevronRight, LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const MyRequests = () => {
  const dispatch = useDispatch();
  const { myRequests, loading } = useSelector((state) => state.requester);

  useEffect(() => {
    dispatch(getMyRequesterRequests());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "in-transit":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "accepted":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  const getUrgencyColor = (urgency) => {
    if (urgency?.toLowerCase() === "critical") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }
    return "bg-gray-800 text-gray-400 border-gray-700";
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            My Requests
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track and manage your emergency blood requests.
          </p>
        </div>
        <Button asChild variant="outline" className="border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white">
          <Link to="/requester/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && myRequests.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 mb-4">
            <Activity className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No requests yet</h3>
          <p className="text-sm text-gray-400 mb-6">
            You haven't created any blood requests yet.
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
            <Link to="/requester/dashboard">Create New Request</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {myRequests.map((request) => (
          <Card key={request._id} className="bg-gray-900 border-gray-800 overflow-hidden group hover:border-gray-700 transition-all duration-300">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center">
                {/* Left Section - Primary Info */}
                <div className="flex-1 p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20">
                        <span className="font-bold text-red-400">{request.bloodGroup || request.type}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">Blood Request</h3>
                          <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5" />
                          {request.units} Unit{request.units > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className={`md:hidden px-2.5 py-1 text-xs uppercase font-semibold ${getStatusColor(request.status)}`}>
                      {request.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[200px] sm:max-w-xs">{request.hospital}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Action */}
                <div className="bg-gray-950/50 p-5 border-t md:border-t-0 md:border-l border-gray-800 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 min-w-[200px]">
                  <Badge variant="outline" className={`hidden md:inline-flex px-3 py-1 text-xs uppercase font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </Badge>
                  
                  <Button asChild size="sm" className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white border-0 group-hover:bg-red-500/10 group-hover:text-red-400 transition-colors">
                    <Link to={`/requester/requests/${request._id}`} className="flex items-center justify-center gap-2">
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;
