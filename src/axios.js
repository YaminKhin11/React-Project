import axios from "axios";

const instance = axios.create({
  baseURL: "http://10.103.0.142:8000/api/v1",
});

// Request interceptor
instance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken(); // Refresh token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (error) {
        console.error("Error refreshing token:", error);
        // Handle token refresh error (e.g., redirect to login page)
      }
    }
    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await instance.post("/refresh", { refreshToken });
    const newToken = response.data.accessToken; // Assuming the server returns accessToken
    localStorage.setItem("accessToken", newToken); // Update accessToken in localStorage
    return newToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error; // Propagate error to caller
  }
};

export const axiosInstance = instance;
