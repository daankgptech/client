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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops explicitly on the refresh endpoint itself
    if (originalRequest.url === '/auth/refresh') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we are already refreshing, seamlessly queue the current request.
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest); // Retry original request
      } catch (err) {
        processQueue(err, null);
        console.error("Session expired completely. Proceed to sign in.");
        // We do not hard-redirect here; AuthContext relies on catching 401s
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);