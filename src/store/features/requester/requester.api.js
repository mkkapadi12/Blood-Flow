import { REQUESTER_TOKEN_KEY } from "@/config/storage-keys";
import { privateAPI, publicAPI } from "@/lib/axios";

export const requesterAPI = {
  register: async (data) => {
    const response = await publicAPI.post(`/requester/register`, data);
    return response.data;
  },

  login: async (data) => {
    const response = await publicAPI.post(`/requester/login`, data);
    return response.data;
  },

  requesterProfile: async () => {
    const token = localStorage.getItem(REQUESTER_TOKEN_KEY);
    const response = await privateAPI.get(`/requester/profile`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  createRequest: async (data) => {
    const token = localStorage.getItem(REQUESTER_TOKEN_KEY);
    const response = await privateAPI.post(`/requests`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  getMyRequests: async () => {
    const token = localStorage.getItem(REQUESTER_TOKEN_KEY);
    const response = await privateAPI.get(`/requests/my`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  getSingleRequest: async (requestId) => {
    const token = localStorage.getItem(REQUESTER_TOKEN_KEY);
    const response = await privateAPI.get(`/requests/${requestId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  verifyPin: async ({ requestId, pin }) => {
    const token = localStorage.getItem(REQUESTER_TOKEN_KEY);
    const response = await privateAPI.post(
      `/requests/${requestId}/verify-pin`,
      { pin },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return response.data;
  },
};
