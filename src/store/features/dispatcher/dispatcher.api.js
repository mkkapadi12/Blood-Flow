import { DISPATCHER_TOKEN_KEY } from "@/config/storage-keys";
import { privateAPI, publicAPI } from "@/lib/axios";

export const dispatcherAPI = {
  register: async (data) => {
    const response = await publicAPI.post(`/dispatcher/register`, data);
    return response.data;
  },

  login: async (data) => {
    const response = await publicAPI.post(`/dispatcher/login`, data);
    return response.data;
  },

  dispatcherProfile: async () => {
    const token = localStorage.getItem(DISPATCHER_TOKEN_KEY);
    const response = await privateAPI.get(`/dispatcher/profile`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  getAllRequests: async () => {
    const token = localStorage.getItem(DISPATCHER_TOKEN_KEY);
    const response = await privateAPI.get(`/dispatcher/get-all-requests`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  getMyRequests: async () => {
    const token = localStorage.getItem(DISPATCHER_TOKEN_KEY);
    const response = await privateAPI.get(`/dispatcher/get-my-requests`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  getSingleRequest: async (requestId) => {
    const token = localStorage.getItem(DISPATCHER_TOKEN_KEY);
    const response = await privateAPI.get(`/dispatcher/requests/${requestId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  acceptRequest: async (requestId) => {
    const token = localStorage.getItem(DISPATCHER_TOKEN_KEY);
    const response = await privateAPI.put(
      `/volunteer/${requestId}/accept`,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return response.data;
  },

  pickupRequest: async (requestId) => {
    const token = localStorage.getItem(DISPATCHER_TOKEN_KEY);
    const response = await privateAPI.put(
      `/volunteer/${requestId}/pickup`,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return response.data;
  },

  deliverRequest: async (requestId) => {
    const token = localStorage.getItem(DISPATCHER_TOKEN_KEY);
    const response = await privateAPI.put(
      `/volunteer/${requestId}/deliver`,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return response.data;
  },
};
