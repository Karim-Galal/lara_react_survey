import axios from "axios";
import router from "./router";

const axiosClient = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    // "Content-Type": "multipart/form-data",
    "Content-Type": "application/json",

  },
  // Accept: "application/json",
});

axiosClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem("token");
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.error("Unauthorized! Redirecting to login...");
      router.navigate("/login");
      return error;
    }
    throw error;
  }
);

export default axiosClient;
