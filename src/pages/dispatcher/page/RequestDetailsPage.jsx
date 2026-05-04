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
import {
  ArrowLeft,
  Clock,
  MapPin,
  Activity,
  ShieldCheck,
  Droplet,
  Building2,
  Truck,
  AlertTriangle,
  User,
  Mail,
  Smartphone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { openLiveLocation } from "@/lib/utils";

const RequestDetailsPage = () => {
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
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentRequest) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
          <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-4" />
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
            <Link to="/dispatcher/dashboard">Back to Dashboard</Link>
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
      case "searching":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      default:
        return "text-gray-400 bg-gray-800 border-gray-700";
    }
  };

  return (
    <div className="p-4 md:p-6 w-full mx-auto space-y-6">
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
          <Link to="/dispatcher/requests" className="flex items-center gap-2">
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
                <Activity className="w-5 h-5 text-orange-400" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-800 border-b border-gray-800">
                <div className="p-5 space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </p>
                  <p className="text-xl font-bold text-orange-400">
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
                    Hospital Name
                  </p>
                  <p className="text-sm font-medium text-white mt-1">
                    {currentRequest?.hospital?.name}
                  </p>
                </div>
              </div>
              <div className="p-5 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital Address
                  </p>
                  <p className="text-sm font-medium text-white mt-1">
                    {currentRequest?.hospital?.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="pb-4 border-b border-gray-800">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" />
                Requester Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">Name:</span>
                <span className="text-white font-medium">
                  {currentRequest.requester?.name || "Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">Contact:</span>
                <span className="text-white font-medium">
                  {currentRequest.requester?.email || "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery PIN display for in-transit requests */}
          {(currentRequest.status === "in-transit" ||
            currentRequest.status === "accepted") && (
            <Card className="bg-orange-500/5 border-orange-500/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-orange-400">
                  <ShieldCheck className="w-5 h-5" />
                  Delivery Verification PIN
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Share this PIN with the requester upon arrival. They will use
                  it to complete the delivery process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 flex items-center justify-center">
                  <span className="text-3xl tracking-[0.5em] font-mono font-bold text-white ml-3">
                    {currentRequest.deliveryPin || "----"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="pb-4 border-b border-gray-800">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Truck className="w-5 h-5 text-gray-400" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={onPickup}
                  disabled={loading || currentRequest.status !== "accepted"}
                  className={`w-full ${currentRequest.status === "accepted" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 text-gray-500"}`}
                >
                  {loading ? "Processing..." : "Mark as Picked Up"}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Only available when status is "Accepted".
                </p>
              </div>

              {currentRequest.location?.lat && currentRequest.location?.lng && (
                <div className="pt-4 border-t border-gray-800">
                  <Button
                    onClick={() =>
                      openLiveLocation(
                        currentRequest.location.lat,
                        currentRequest.location.lng,
                      )
                    }
                    variant="outline"
                    className="w-full border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View Live Location
                  </Button>
                </div>
              )}
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
                        {history?.newStatus?.replace("-", " ")}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(history?.timestamp).toLocaleString()}
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

export default RequestDetailsPage;
