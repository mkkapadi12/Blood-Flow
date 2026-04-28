import { Button } from "@/components/ui/button";
import { getMyRequesterRequests } from "@/store/features/requester/requester.slice";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const MyRequests = () => {
  const dispatch = useDispatch();
  const { myRequests, loading } = useSelector((state) => state.requester);

  useEffect(() => {
    dispatch(getMyRequesterRequests());
  }, [dispatch]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">My Requests</h2>
        <Button asChild variant="outline">
          <Link to="/requester/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading requests...</p>}

      {!loading && myRequests.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
          You have not created any requests yet.
        </div>
      )}

      {myRequests.map((request) => (
        <div
          key={request._id}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                {request.bloodGroup || request.type}
              </p>
              <p className="text-sm text-gray-600">
                {request.hospital} • {request.units} unit(s)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {request.status}
              </span>
              <Button asChild size="sm">
                <Link to={`/requester/requests/${request._id}`}>View</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyRequests;
