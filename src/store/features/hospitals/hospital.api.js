import { publicAPI } from "@/lib/axios";

export const HospitalAPI = {
  getAllHospitals: async ({ page, limit }) => {
    const response = await publicAPI.get(
      `/hospital?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getNearbyHospitals: async ({ lat, lng, radius = 5000 }) => {
    const response = await publicAPI.get(
      `/hospital/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
    );
    return response.data;
  },

  searchHospitals: async (query) => {
    const response = await publicAPI.get(`/hospital/search?q=${query}`);
    return response.data;
  },

  getSingleHospital: async (id) => {
    const response = await publicAPI.get(`/hospital/${id}`);
    return response.data;
  },
};
