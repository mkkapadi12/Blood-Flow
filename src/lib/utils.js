import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "in-transit":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "accepted":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-gray-800 text-gray-300 border-gray-700";
  }
};

export const getUrgencyColor = (urgency) => {
  if (urgency?.toLowerCase() === "critical") {
    return "bg-red-500/10 text-red-400 border-red-500/20";
  }
  return "bg-gray-800 text-gray-400 border-gray-700";
};

export const openLiveLocation = (lat, lng) => {
  if (!lat || !lng) return;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank");
};
