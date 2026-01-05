import axiosInstance from './axiosInstance';

export const authAPI = {

  signup: async (userData) => {
    const response = await axiosInstance.post('/api/auth/signup', userData);
    return response.data;
  },

 
  login: async (credentials) => {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    return response.data;
  },


  logout: async () => {
    const response = await axiosInstance.post('/api/auth/logout');
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data;
  },
  
};

export default authAPI;