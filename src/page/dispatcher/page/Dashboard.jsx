import {
  acceptDispatcherRequest,
  getAllDispatcherRequests,
  getMyDispatcherRequests,
  getDispatcherProfile,
  pickupDispatcherRequest,
} from "@/store/features/dispatcher/dispatcher.slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { dispatcher, allrequests, myrequests } = useSelector(
    (state) => state.dispatcher,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDispatcherProfile());
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {dispatcher?.name}'s Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Searching requests: {allrequests.length}
          </p>
          <p className="text-sm text-gray-600">
            My requests: {myrequests.length}
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">My Requests</h2>
          {myrequests.map((request) => (
            <div
              key={request._id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {request.bloodGroup || request.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.hospital} • {request.units} unit(s)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                    {request.status}
                  </span>
                  {request.status === "accepted" && (
                    <Button size="sm" onClick={() => onPickup(request._id)}>
                      Pickup
                    </Button>
                  )}
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/dispatcher/requests/${request._id}`}>Open</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {myrequests.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
              No assigned requests yet.
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Searching Requests
          </h2>
          {allrequests.map((request) => (
            <div
              key={request._id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {request.bloodGroup || request.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.hospital} • {request.units} unit(s)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    {request.status}
                  </span>
                  <Button size="sm" onClick={() => onAccept(request._id)}>
                    Accept
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/dispatcher/requests/${request._id}`}>Open</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {allrequests.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
              No searching requests available right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
