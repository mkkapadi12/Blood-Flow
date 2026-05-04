import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllHospitals,
  getNearbyHospitals,
  searchHospitals,
} from "@/store/features/hospitals/hospital.slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Building2,
  AlertTriangle,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";

const Hospitals = () => {
  const { hospitals, loading } = useSelector((state) => state.hospital);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [nearbyActive, setNearbyActive] = useState(false);

  useEffect(() => {
    // Initial fetch
    dispatch(getAllHospitals({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setNearbyActive(false);
      dispatch(searchHospitals(searchQuery));
    } else {
      dispatch(getAllHospitals({ page: 1, limit: 100 }));
    }
  };

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    toast.info("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setNearbyActive(true);
        setSearchQuery("");
        dispatch(
          getNearbyHospitals({ lat: latitude, lng: longitude, radius: 8000 }),
        );
        toast.success("Found nearby hospitals");
      },
      (error) => {
        toast.error(
          "Unable to retrieve your location. Please check browser permissions.",
        );
        console.error(error);
      },
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setNearbyActive(false);
    dispatch(getAllHospitals({ page: 1, limit: 100 }));
  };

  const sortedHospitals = useMemo(() => {
    if (!hospitals || !Array.isArray(hospitals)) return [];

    return [...hospitals].sort((a, b) => {
      if (sortBy === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "name-desc") {
        return (b.name || "").localeCompare(a.name || "");
      } else if (sortBy === "city-asc") {
        return (a.city || "").localeCompare(b.city || "");
      }
      return 0;
    });
  }, [hospitals, sortBy]);

  return (
    <div className="p-4 md:p-6 w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-orange-400" />
            Hospitals Network
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Find nearby hospitals or search by name and address
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="flex flex-1 w-full gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hospitals by name, city, or address..."
                  className="w-full pl-10 bg-gray-950 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                />
              </div>
              <Button
                type="submit"
                variant="default"
                className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
              >
                Search
              </Button>
            </form>

            <div className="flex w-full md:w-auto items-center gap-2 shrink-0">
              <Button
                type="button"
                onClick={handleFindNearby}
                variant="outline"
                className={`flex-1 md:flex-none gap-2 ${nearbyActive ? "bg-blue-600 border-blue-500 text-white hover:bg-blue-700" : "bg-gray-950 border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800"}`}
              >
                <MapPin className="w-4 h-4" />
                Find Nearby
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] bg-gray-950 border-gray-800 text-white">
                  <ArrowUpDown className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-white">
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="city-asc">City (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchQuery || nearbyActive) && (
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing results for{" "}
                {nearbyActive ? (
                  <span className="font-semibold text-blue-400">
                    Nearby Location
                  </span>
                ) : (
                  <span className="font-semibold text-orange-400">
                    "{searchQuery}"
                  </span>
                )}
              </p>
              <Button
                onClick={handleClearFilters}
                variant="link"
                className="text-gray-400 hover:text-white h-auto p-0"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hospital Countng */}

      <Card className="bg-gray-900 border-gray-800">
        <CardContent>
          <p className="text-sm text-gray-400">
            Total Hospitals: {sortedHospitals.length}
          </p>
        </CardContent>
      </Card>

      {/* Hospital List */}
      {loading ? (
        <div className="flex items-center justify-center p-12 min-h-[400px]">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : sortedHospitals.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800 text-center py-12">
          <CardContent>
            <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Hospitals Found
            </h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-6">
              We couldn't find any hospitals matching your current search
              criteria.
            </p>
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
            >
              Clear Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedHospitals.map((hospital) => (
            <Card
              key={hospital._id}
              className="bg-gray-900 border-gray-800 text-white overflow-hidden hover:border-gray-700 transition-colors"
            >
              <CardHeader className="pb-3 border-b border-gray-800/50">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
                    {hospital.name}
                  </CardTitle>
                  {hospital.rohiniCode && (
                    <Badge
                      variant="outline"
                      className="shrink-0 bg-blue-500/10 text-blue-400 border-blue-500/20 px-2 py-0.5 text-[10px] uppercase font-mono"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-200">
                      {hospital.city}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {hospital.address}
                    </p>
                  </div>
                </div>
                {hospital.rohiniCode && (
                  <div className="flex items-center gap-3 pt-2">
                    <Building2 className="w-4 h-4 text-gray-500 shrink-0" />
                    <p className="text-xs text-gray-400">
                      Rohini Code:{" "}
                      <span className="font-mono text-gray-300">
                        {hospital.rohiniCode}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hospitals;
