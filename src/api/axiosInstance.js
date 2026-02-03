import axios from 'axios';
import tokenManager from '../utils/tokenManager';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://leadsyncflow-3.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // Increased to 60s for Render cold starts
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Better timeout error handling
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      error.message = 'The server is taking too long to respond. This might be due to a slow connection or the server waking up. Please try again in a few moments.';
    }

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      tokenManager.clearAuthData();
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

Object.freeze(axiosInstance);

export default axiosInstance;
