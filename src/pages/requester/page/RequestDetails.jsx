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
import {
  ArrowLeft,
  Clock,
  MapPin,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Droplet,
  Building2,
  Truck,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentRequest) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Request Not Found
          </h3>
          <p className="text-gray-400 mb-6">
            The request you are looking for does not exist or has been removed.
          </p>
          <Button
            asChild
            variant="outline"
            className="border-gray-800 text-gray-300"
          >
            <Link to="/requester/requests">Back to Requests</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getUrgencyColor = (urgency) => {
    if (urgency?.toLowerCase() === "critical")
      return "text-red-400 bg-red-500/10 border-red-500/20";
    return "text-gray-300 bg-gray-800 border-gray-700";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "in-transit":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "accepted":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-gray-400 bg-gray-800 border-gray-700";
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            Request Details
            <Badge
              variant="outline"
              className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getStatusColor(currentRequest.status)}`}
            >
              {currentRequest.status}
            </Badge>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            ID:{" "}
            <span className="font-mono text-gray-500">
              {currentRequest._id}
            </span>
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white shrink-0"
        >
          <Link to="/requester/requests" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Requests
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-gray-900 border-gray-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Droplet className="w-32 h-32" />
            </div>
            <CardHeader className="pb-4 border-b border-gray-800">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-400" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-800 border-b border-gray-800">
                <div className="p-5 space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </p>
                  <p className="text-xl font-bold text-red-400">
                    {currentRequest.bloodGroup || "N/A"}
                  </p>
                </div>
                <div className="p-5 space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units Required
                  </p>
                  <p className="text-xl font-bold text-white">
                    {currentRequest.units}{" "}
                    <span className="text-sm text-gray-500 font-normal">
                      unit(s)
                    </span>
                  </p>
                </div>
                <div className="p-5 space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Type
                  </p>
                  <p className="text-sm font-medium text-white capitalize">
                    {currentRequest.type}
                  </p>
                </div>
                <div className="p-5 space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgency
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-1 text-xs uppercase font-semibold ${getUrgencyColor(currentRequest.urgency)}`}
                  >
                    {currentRequest.urgency}
                  </Badge>
                </div>
              </div>
              <div className="p-5 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital Address
                  </p>
                  <p className="text-sm font-medium text-white mt-1">
                    {currentRequest.hospital}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery PIN form for in-transit requests */}
          {currentRequest.status === "in-transit" && (
            <Card className="bg-red-500/5 border-red-500/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-red-400">
                  <ShieldCheck className="w-5 h-5" />
                  Confirm Delivery
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Provide the 4-digit PIN to the driver upon successful
                  delivery.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onVerifyPin} className="flex gap-3">
                  <Input
                    type="text"
                    maxLength={4}
                    value={pin}
                    onChange={(event) => setPin(event.target.value)}
                    placeholder="Enter PIN"
                    className="flex-1 bg-gray-950 border-gray-800 text-white placeholder:text-gray-500 text-center tracking-widest font-mono text-lg"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white min-w-[120px]"
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Status & History */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="pb-4 border-b border-gray-800">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Truck className="w-5 h-5 text-gray-400" />
                Live Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-gray-800 before:to-gray-900">
                {steps.map((step, index) => {
                  const currentIndex = steps.indexOf(currentRequest.status);
                  const isCompleted = index < currentIndex;
                  const isActive = index === currentIndex;
                  const isFuture = index > currentIndex;

                  return (
                    <div
                      key={step}
                      className="relative flex items-center gap-4"
                    >
                      <div
                        className={`
                        flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 z-10 bg-gray-900
                        ${isCompleted ? "border-emerald-500 text-emerald-500" : ""}
                        ${isActive ? "border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : ""}
                        ${isFuture ? "border-gray-700 text-gray-600" : ""}
                      `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-red-500 animate-pulse" : "bg-transparent"}`}
                          />
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium uppercase tracking-wide ${isActive ? "text-white" : isCompleted ? "text-gray-300" : "text-gray-600"}`}
                        >
                          {step.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="pb-4 border-b border-gray-800">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {(currentRequest.statusHistory || []).map((history, i) => (
                  <div key={history._id} className="flex gap-3 relative">
                    {i !== (currentRequest.statusHistory || []).length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-[-16px] w-0.5 bg-gray-800" />
                    )}
                    <div className="w-[22px] h-[22px] rounded-full bg-gray-800 border-2 border-gray-900 shrink-0 mt-0.5 flex items-center justify-center" />
                    <div>
                      <p className="text-sm font-medium text-gray-300 capitalize">
                        {history.newStatus.replace("-", " ")}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(history.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(currentRequest.statusHistory || []).length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No timeline updates yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
