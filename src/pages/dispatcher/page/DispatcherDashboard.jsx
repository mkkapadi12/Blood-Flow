import {
  getAllDispatcherRequests,
  getMyDispatcherRequests,
  getDispatcherProfile,
} from "@/store/features/dispatcher/dispatcher.slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  Search,
  ClipboardList,
  Settings,
} from "lucide-react";

const DispatcherDashboard = () => {
  const { dispatcher, allrequests, myrequests } = useSelector(
    (state) => state.dispatcher,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDispatcherProfile());
    dispatch(getAllDispatcherRequests());
    dispatch(getMyDispatcherRequests());
  }, [dispatch]);


  return (
    <div className="p-4 md:p-6 w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome, {dispatcher?.name || "Dispatcher"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage blood deliveries and active searching requests.
          </p>
        </div>
        <Button
          asChild
          className="bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white border border-orange-500/20"
        >
          <Link to="/dispatcher/requests" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            View All Requests
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gray-900 border-gray-800 text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Available Requests
                </p>
                <p className="text-3xl font-bold mt-1 text-orange-400">
                  {allrequests.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Search className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  My Deliveries
                </p>
                <p className="text-3xl font-bold mt-1 text-blue-400">
                  {myrequests.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-800 hover:border-orange-500/50 transition-colors cursor-pointer group">
            <Link to="/dispatcher/requests" className="block p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Search className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white group-hover:text-orange-400 transition-colors">Browse Requests</h3>
                  <p className="text-sm text-gray-400 mt-1">Find new deliveries</p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <Link to="/dispatcher/requests" className="block p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Truck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">My Deliveries</h3>
                  <p className="text-sm text-gray-400 mt-1">Manage active tasks</p>
                </div>
              </div>
            </Link>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800 hover:border-gray-500/50 transition-colors cursor-pointer group">
            <Link to="/dispatcher/Settings" className="block p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                  <Settings className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h3 className="font-medium text-white group-hover:text-gray-300 transition-colors">Settings</h3>
                  <p className="text-sm text-gray-400 mt-1">Update profile & preferences</p>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DispatcherDashboard;
