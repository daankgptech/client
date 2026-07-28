import axios from "axios";

// Vite requires environment variables to start with VITE_
// This will automatically use the production URL if available, 
// otherwise it defaults to localhost.
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically attach Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const adminToken =
      localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
    const userToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const token = adminToken || userToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);