import axios from "axios";
import { API_URL } from "@/config/env";
import {
  REQUESTER_TOKEN_KEY,
  DISPATCHER_TOKEN_KEY,
} from "@/config/storage-keys";

export const publicAPI = axios.create({ baseURL: API_URL });

export const privateAPI = axios.create({ baseURL: API_URL });

privateAPI.interceptors.request.use((config) => {
  if (config.headers?.Authorization) return config;
  const token =
    localStorage.getItem(REQUESTER_TOKEN_KEY) ||
    localStorage.getItem(DISPATCHER_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
