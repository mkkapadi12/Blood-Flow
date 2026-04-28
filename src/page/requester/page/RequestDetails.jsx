import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socket } from "@/lib/socket";
import {
  getRequesterSingleRequest,
  verifyRequesterDeliveryPin,
} from "@/store/features/requester/requester.slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const RequestDetails = () => {
  const steps = ["searching", "accepted", "in-transit", "delivered"];
  const dispatch = useDispatch();
  const { id } = useParams();
  const [pin, setPin] = useState("");

  const { currentRequest, loading } = useSelector((state) => state.requester);

  useEffect(() => {
    if (id) {
      dispatch(getRequesterSingleRequest(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!id) return;

    socket.emit("join-request", id);

    const refreshRequest = (payload) => {
      if (String(payload?.requestId) === String(id)) {
        dispatch(getRequesterSingleRequest(id));
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

  const onVerifyPin = async (event) => {
    event.preventDefault();
    if (!pin.trim()) {
      toast.error("Please enter the 4-digit PIN");
      return;
    }

    const toastId = toast.loading("Verifying PIN...");
    try {
      const result = await dispatch(
        verifyRequesterDeliveryPin({ requestId: id, pin: pin.trim() }),
      ).unwrap();
      toast.success(result?.msg || "Delivery confirmed", { id: toastId });
      setPin("");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Verification failed",
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
        <Button asChild variant="outline">
          <Link to="/requester/requests">Back to My Requests</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
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
          Urgency:{" "}
          <span className="font-medium text-gray-900">
            {currentRequest.urgency}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Status:{" "}
          <span className="font-medium text-gray-900">
            {currentRequest.status}
          </span>
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Live Status
        </h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {steps.map((step, index) => {
            const currentIndex = steps.indexOf(currentRequest.status);
            const isActive = index <= currentIndex;

            return (
              <div
                key={step}
                className={`rounded-lg border px-3 py-2 text-center text-xs font-medium ${
                  isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-gray-50 text-gray-500"
                }`}
              >
                {step}
              </div>
            );
          })}
        </div>
      </div>

      {currentRequest.status === "in-transit" && (
        <form
          onSubmit={onVerifyPin}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3"
        >
          <h3 className="text-sm font-semibold text-gray-900">
            Confirm Delivery PIN
          </h3>
          <Input
            type="text"
            maxLength={4}
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            placeholder="Enter 4-digit PIN"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify PIN"}
          </Button>
        </form>
      )}

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
  );
};

export default RequestDetails;
