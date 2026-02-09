import axiosInstance from './axiosInstance';
import tokenManager from '../utils/tokenManager';

export const adminAPI = {
  // Get overview stats
  getOverview: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/api/superadmin/overview', { params });
      return response.data;
    } catch (error) {
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

  // Additional specific stage filters
  getAllLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    return adminAPI.getLeadsByStage(null, limit, skip, extraFilters);
  },

  getDMStageLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    const params = { limit, skip, stage: 'DM', ...extraFilters };
    const response = await axiosInstance.get('/api/superadmin/leads', { params });
    return response.data;
  },

  getLQStageLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    return adminAPI.getLeadsByStage('LQ', limit, skip, extraFilters);
  },

  getManagerStageLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    return adminAPI.getLeadsByStage('MANAGER', limit, skip, extraFilters);
  },

  getDoneStageLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    return adminAPI.getLeadsByStage('DONE', limit, skip, extraFilters);
  },

  getRejectedStageLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    return adminAPI.getLeadsByStage('REJECTED', limit, skip, extraFilters);
  },

  // Get performance metrics for a specific role
  getPerformance: async (role, extraParams = {}) => {
    try {
      const params = { role, ...extraParams };
      const response = await axiosInstance.get('/api/superadmin/performance', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all leads with comprehensive filtering by stage and role
  getAllLeadsByRole: async (limit = 20, skip = 0, filters = {}) => {
    const params = { limit, skip, ...filters };
    const response = await axiosInstance.get('/api/superadmin/leads', { params });
    return response.data;
  },

  // Debug function to see what stages actually exist
  getStagesDebug: async () => {
    try {
      const response = await axiosInstance.get('/api/superadmin/leads', { params: { limit: 1000, skip: 0 } });
      if (response.data.success) {
        const stages = [...new Set(response.data.leads?.map(l => l.stage) || [])];
        const stageBreakdown = response.data.leads?.reduce((acc, lead) => {
          acc[lead.stage] = (acc[lead.stage] || 0) + 1;
          return acc;
        }, {});
        const dmLeads = response.data.leads?.filter(l => l.stage === 'DM') || [];
        return { stages, stageBreakdown, total: response.data.leads?.length, dmCount: dmLeads.length };
      }
    } catch (error) {
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
