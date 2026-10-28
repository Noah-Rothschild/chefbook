import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  // the Django API's address, e.g. https://chefbook-api.onrender.com (no trailing slash needed)
  baseURL: (import.meta.env.VITE_API_URL || "").replace(/\/+$/, ""),
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
