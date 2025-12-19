import axios from "axios";
import { APP_KEYS, APP_ROUTES } from "./keys";
import { localStorageUtil } from "./utils";

// Get the API URL from environment variables
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Create a basic axios instance for user API calls (no auth)
export const public_api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create an axios instance for walker API calls (with auth)
export const private_api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach Bearer token from localStorage
private_api.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorageUtil.getItem(APP_KEYS.TOKEN);
      if (token && typeof token === 'string') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
const handleResponseError = (error: any) => {
  if (error.response) {
    // Handle specific error status codes
    if (error.response.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      if (typeof window !== "undefined") {
        localStorageUtil.removeItem(APP_KEYS.TOKEN);
        localStorageUtil.removeItem(APP_KEYS.USER);
        // Force redirect to login to break loop and reset state
        if (window.location.pathname !== APP_ROUTES.LOGIN && window.location.pathname !== APP_ROUTES.REGISTER) {
          window.location.href = APP_ROUTES.LOGIN;
        }
      }
    }
  }
  return Promise.reject(error);
};

public_api.interceptors.response.use(
  (response) => response,
  handleResponseError
);
private_api.interceptors.response.use(
  (response) => response,
  handleResponseError
);


