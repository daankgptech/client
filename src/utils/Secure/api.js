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

// Optional: Add an interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle logout logic here if needed
      console.error("Unauthorized - Redirecting to login...");
    }
    return Promise.reject(error);
  }
);