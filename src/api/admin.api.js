import axiosInstance from './axiosInstance';
import tokenManager from '../utils/tokenManager';

export const adminAPI = {
  // Get overview stats
  getOverview: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/api/superadmin/overview', { params });
      console.groupCollapsed('%c📊 Admin Overview API', 'color: #8b5cf6; font-weight: bold; font-size: 12px;');
      console.log('%cPayload:', 'color: #a78bfa; font-weight: bold;', response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.error('❌ Overview API Error:', error);
      throw error;
    }
  },

  // Get all pending requests
  getPendingRequests: async () => {
    const token = tokenManager.getToken();
    const response = await axiosInstance.get('/api/superadmin/requests/pending', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Approve a pending request
  approveRequest: async (requestId, role) => {
    const response = await axiosInstance.patch(`/api/superadmin/requests/${requestId}/approve`, { role });
    return response.data;
  },

  // Reject a pending request
  rejectRequest: async (requestId) => {
    const response = await axiosInstance.delete(`/api/superadmin/requests/${requestId}/reject`);
    return response.data;
  },

  // Generic helper to fetch leads by stage with pagination
  getLeadsByStage: async (stage, limit = 20, skip = 0, extraFilters = {}) => {
    const params = { limit, skip, ...extraFilters };
    if (stage) params.stage = stage;
    const response = await axiosInstance.get('/api/superadmin/leads', { params });
    return response.data;
  },

  // Specific shortcuts for each role stage
  getManagerLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    return adminAPI.getLeadsByStage('MANAGER', limit, skip, extraFilters);
  },
  getLeadQualifierLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    return adminAPI.getLeadsByStage('LQ', limit, skip, extraFilters);
  },
  getVerifierLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    return adminAPI.getLeadsByStage('DM', limit, skip, extraFilters);
  },
  getDataMinerLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    return adminAPI.getLeadsByStage('DM', limit, skip, extraFilters);
  },

  // Get performance metrics for a specific role
  getPerformance: async (role, extraParams = {}) => {
    try {
      const params = { role, ...extraParams };
      const response = await axiosInstance.get('/api/superadmin/performance', { params });
      console.groupCollapsed(`%c📈 Performance API: ${role}`, 'color: #10b981; font-weight: bold; font-size: 12px;');
      console.log('%cData:', 'color: #34d399; font-weight: bold;', response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.error(`❌ Performance API Error (${role}):`, error);
      throw error;
    }
  },

  // Make user a super admin
  makeSuperAdmin: async (userId) => {
    const response = await axiosInstance.patch(`/api/superadmin/users/${userId}/make-super-admin`);
    return response.data;
  },
};

export default adminAPI;
