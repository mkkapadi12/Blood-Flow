import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socket";
import {
  getDispatcherSingleRequest,
  pickupDispatcherRequest,
} from "@/store/features/dispatcher/dispatcher.slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const SingleRequest = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentRequest, loading } = useSelector((state) => state.dispatcher);

  useEffect(() => {
    if (id) {
      dispatch(getDispatcherSingleRequest(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!id) return;

    socket.emit("join-request", id);

    const refreshRequest = (payload) => {
      if (String(payload?.requestId) === String(id)) {
        dispatch(getDispatcherSingleRequest(id));
      }
    };

    socket.on("status_update", refreshRequest);
    socket.on("arrival_update", refreshRequest);

    return () => {
      socket.emit("leave-request", id);
      socket.off("status_update", refreshRequest);
      socket.off("arrival_update", refreshRequest);
    };
  }, [dispatch, id]);

  const onPickup = async () => {
    const toastId = toast.loading("Marking request in-transit...");
    try {
      const result = await dispatch(pickupDispatcherRequest(id)).unwrap();
      toast.success(result?.msg || "Marked in-transit", { id: toastId });
      dispatch(getDispatcherSingleRequest(id));
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to update status",
        { id: toastId },
      );
    }
  };

  if (loading && !currentRequest) {
    return <p className="text-sm text-gray-500">Loading request details...</p>;
  }

  if (!currentRequest) {
    return <p className="text-sm text-gray-500">Request not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Request Details
          </h1>
          <Button asChild variant="outline">
            <Link to="/dispatcher/dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
          <p className="text-sm text-gray-600">
            Requester:{" "}
            <span className="font-medium text-gray-900">
              {currentRequest.requester?.name || "Unknown"}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Contact:{" "}
            <span className="font-medium text-gray-900">
              {currentRequest.requester?.email || "N/A"}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Type:{" "}
            <span className="font-medium text-gray-900">
              {currentRequest.type}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Blood Group:{" "}
            <span className="font-medium text-gray-900">
              {currentRequest.bloodGroup || "N/A"}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Units:{" "}
            <span className="font-medium text-gray-900">
              {currentRequest.units}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Hospital:{" "}
            <span className="font-medium text-gray-900">
              {currentRequest.hospital}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Status:{" "}
            <span className="font-medium text-gray-900">
              {currentRequest.status}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Delivery PIN:{" "}
            <span className="font-medium text-gray-900">
              {currentRequest.deliveryPin}
            </span>
          </p>
          {currentRequest.status === "in-transit" && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
              Share this PIN with requester. They will verify it to complete
              delivery.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onPickup}
            disabled={loading || currentRequest.status !== "accepted"}
          >
            Picked Up
          </Button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Status History
          </h3>
          <div className="space-y-2">
            {(currentRequest.statusHistory || []).map((history) => (
              <div
                key={history._id}
                className="rounded-lg bg-gray-50 p-2 text-xs text-gray-700"
              >
                {history.newStatus} •{" "}
                {new Date(history.timestamp).toLocaleString()}
              </div>
            ))}
            {(currentRequest.statusHistory || []).length === 0 && (
              <p className="text-xs text-gray-500">No status updates yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleRequest;
