import { getRequesterProfile } from "@/store/features/requester/requester.slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateRequest from "@/page/requester/components/createRequest";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { requester } = useSelector((state) => state.requester);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRequesterProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {requester?.name || "Requester"}
          </h1>
          <Button asChild variant="outline">
            <Link to="/requester/requests">My Requests</Link>
          </Button>
        </div>
        <CreateRequest />
      </div>
    </div>
  );
};

export default Dashboard;
