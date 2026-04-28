import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createRequesterRequest } from "@/store/features/requester/requester.slice";

const CreateRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.requester);

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
        hospitalAddress: "",
        urgencyLevel: "normal",
        lat: "",
        lng: "",
      });

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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Emergency Request</CardTitle>
        <CardDescription>
          Fill the details below to create a blood request.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <select
                id="bloodType"
                {...form.register("bloodType", {
                  required: "Blood type is required",
                })}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {form.formState.errors.bloodType && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.bloodType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitsRequired">Units Required</Label>
              <Input
                id="unitsRequired"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 2"
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
                <p className="text-sm text-red-500">
                  {form.formState.errors.unitsRequired.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalAddress">Hospital Address</Label>
            <Input
              id="hospitalAddress"
              type="text"
              placeholder="Hospital / clinic full address"
              {...form.register("hospitalAddress", {
                required: "Hospital address is required",
              })}
            />
            {form.formState.errors.hospitalAddress && (
              <p className="text-sm text-red-500">
                {form.formState.errors.hospitalAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgencyLevel">Urgency Level</Label>
            <select
              id="urgencyLevel"
              {...form.register("urgencyLevel", {
                required: "Urgency level is required",
              })}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="normal">Normal</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Location Coordinates (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                onClick={onUseCurrentLocation}
              >
                Use Current Location
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                type="number"
                step="any"
                placeholder="Latitude"
                {...form.register("lat")}
              />
              <Input
                type="number"
                step="any"
                placeholder="Longitude"
                {...form.register("lng")}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating request..." : "Create Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRequest;
