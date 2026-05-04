import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MapPin, Activity, Droplet, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createRequesterRequest } from "@/store/features/requester/requester.slice";

const CreateRequestForm = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.requester);
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      bloodType: "",
      unitsRequired: "",
      hospitalAddress: "",
      urgencyLevel: "normal",
      lat: "",
      lng: "",
    },
  });

  const onUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser");
      return;
    }

    const toastId = toast.loading("Fetching current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("lat", String(position.coords.latitude), {
          shouldValidate: true,
        });
        form.setValue("lng", String(position.coords.longitude), {
          shouldValidate: true,
        });
        toast.success("Location added", { id: toastId });
      },
      () => {
        toast.error("Unable to fetch location", { id: toastId });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  const onSubmit = async (data) => {
    const payload = {
      bloodType: data.bloodType.trim(),
      unitsRequired: Number(data.unitsRequired),
      hospitalName: data.hospitalName.trim(),
      hospitalAddress: data.hospitalAddress.trim(),
      urgencyLevel: data.urgencyLevel,
    };

    const hasLat = data.lat !== "";
    const hasLng = data.lng !== "";
    if (hasLat && hasLng) {
      payload.location = {
        lat: Number(data.lat),
        lng: Number(data.lng),
      };
    }

    const toastId = toast.loading("Creating emergency request...");
    try {
      const result = await dispatch(createRequesterRequest(payload)).unwrap();
      toast.success(result?.msg || "Request created successfully", {
        id: toastId,
      });

      const requestId = result?.request?._id;
      form.reset({
        bloodType: "",
        unitsRequired: "",
        hospitalName: "",
        hospitalAddress: "",
        urgencyLevel: "normal",
        lat: "",
        lng: "",
      });

      setOpen(false);

      if (requestId) {
        navigate(`/requester/requests/${requestId}`);
      }
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to create request",
        { id: toastId },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-800 text-white p-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent opacity-100 pointer-events-none" />

        <div className="relative z-10 p-6 space-y-6">
          <DialogHeader className="border-b border-gray-800 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-white">
              <PlusCircle className="w-5 h-5 text-red-400" />
              Create Emergency Request
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill the details below to create a blood request. Dispatchers will
              be notified immediately.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="bloodType"
                  className="text-gray-300 flex items-center gap-1.5"
                >
                  <Droplet className="w-3.5 h-3.5 text-red-400" />
                  Blood Type
                </Label>
                <select
                  id="bloodType"
                  {...form.register("bloodType", {
                    required: "Blood type is required",
                  })}
                  className="h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                >
                  <option value="" className="bg-gray-900">
                    Select blood type
                  </option>
                  <option value="A+" className="bg-gray-900">
                    A+
                  </option>
                  <option value="A-" className="bg-gray-900">
                    A-
                  </option>
                  <option value="B+" className="bg-gray-900">
                    B+
                  </option>
                  <option value="B-" className="bg-gray-900">
                    B-
                  </option>
                  <option value="AB+" className="bg-gray-900">
                    AB+
                  </option>
                  <option value="AB-" className="bg-gray-900">
                    AB-
                  </option>
                  <option value="O+" className="bg-gray-900">
                    O+
                  </option>
                  <option value="O-" className="bg-gray-900">
                    O-
                  </option>
                </select>
                {form.formState.errors.bloodType && (
                  <p className="text-xs text-red-400 mt-1">
                    {form.formState.errors.bloodType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="unitsRequired"
                  className="text-gray-300 flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  Units Required
                </Label>
                <Input
                  id="unitsRequired"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 2"
                  className="h-10 border-gray-800 bg-gray-950 text-white placeholder:text-gray-600 focus-visible:ring-red-500/50 focus-visible:border-red-500/50"
                  {...form.register("unitsRequired", {
                    required: "Units required is mandatory",
                    min: {
                      value: 1,
                      message: "Units required must be at least 1",
                    },
                    valueAsNumber: true,
                  })}
                />
                {form.formState.errors.unitsRequired && (
                  <p className="text-xs text-red-400 mt-1">
                    {form.formState.errors.unitsRequired.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="hospitalName"
                className="text-gray-300 flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-red-400" />
                Hospital Name
              </Label>
              <Input
                id="hospitalName"
                type="text"
                placeholder="Hospital / clinic full name"
                className="h-10 border-gray-800 bg-gray-950 text-white placeholder:text-gray-600 focus-visible:ring-red-500/50 focus-visible:border-red-500/50"
                {...form.register("hospitalName", {
                  required: "Hospital name is required",
                })}
              />
              {form.formState.errors.hospitalName && (
                <p className="text-xs text-red-400 mt-1">
                  {form.formState.errors.hospitalName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="hospitalAddress"
                className="text-gray-300 flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-red-400" />
                Hospital Address
              </Label>
              <Input
                id="hospitalAddress"
                type="text"
                placeholder="Hospital / clinic full address"
                className="h-10 border-gray-800 bg-gray-950 text-white placeholder:text-gray-600 focus-visible:ring-red-500/50 focus-visible:border-red-500/50"
                {...form.register("hospitalAddress", {
                  required: "Hospital address is required",
                })}
              />
              {form.formState.errors.hospitalAddress && (
                <p className="text-xs text-red-400 mt-1">
                  {form.formState.errors.hospitalAddress.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgencyLevel" className="text-gray-300">
                Urgency Level
              </Label>
              <select
                id="urgencyLevel"
                {...form.register("urgencyLevel", {
                  required: "Urgency level is required",
                })}
                className="h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              >
                <option value="normal" className="bg-gray-900">
                  Normal
                </option>
                <option value="critical" className="bg-gray-900">
                  Critical
                </option>
              </select>
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  Location Coordinates (Optional)
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onUseCurrentLocation}
                  className="h-8 border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Use Current Location
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  className="h-10 border-gray-800 bg-gray-950 text-white placeholder:text-gray-600 focus-visible:ring-red-500/50 focus-visible:border-red-500/50"
                  {...form.register("lat")}
                />
                <Input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  className="h-10 border-gray-800 bg-gray-950 text-white placeholder:text-gray-600 focus-visible:ring-red-500/50 focus-visible:border-red-500/50"
                  {...form.register("lng")}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
              disabled={loading}
            >
              {loading ? "Creating request..." : "Create Request"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRequestForm;
