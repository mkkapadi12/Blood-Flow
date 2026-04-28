import axios from "axios";

const API = "http://localhost:3000/api";

const privateAPI = axios.create({
  baseURL: API,
});

privateAPI.interceptors.request.use((config) => {
  if (config.headers?.Authorization) {
    return config;
  }

  const requesterToken = localStorage.getItem("requestertestToken");
  const dispatcherToken = localStorage.getItem("dispatchertestToken");

  const token = requesterToken || dispatcherToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default privateAPI;
