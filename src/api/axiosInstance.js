import axios from 'axios';
import tokenManager from '../utils/tokenManager';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://leadsyncflow-2.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  Promise.reject
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
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
