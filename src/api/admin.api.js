import axiosInstance from './axiosInstance';
import tokenManager from '../utils/tokenManager';

export const adminAPI = {
  // Get all pending requests
  getPendingRequests: async () => {
    const token = tokenManager.getToken();
    const response = await axiosInstance.get('/api/admin/requests/pending', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Approve a pending request
  approveRequest: async (requestId, role) => {
    const response = await axiosInstance.patch(`/api/admin/requests/${requestId}/approve`, { role });
    return response.data;
  },

  // Reject a pending request
  rejectRequest: async (requestId) => {
    const response = await axiosInstance.delete(`/api/admin/requests/${requestId}/reject`);
    return response.data;
  },

  // Make user a super admin
  makeSuperAdmin: async (userId) => {
    const response = await axiosInstance.patch(`/api/admin/users/${userId}/make-super-admin`);
    return response.data;
  },
};

export default adminAPI;
