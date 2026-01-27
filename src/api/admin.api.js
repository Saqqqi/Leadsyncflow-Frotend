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
    
    console.groupCollapsed(`%c🔍 Frontend: Fetching Leads by Stage: ${stage || 'ALL'}`, 'color: #3b82f6; font-weight: bold; font-size: 12px;');
    console.log('%c📤 Frontend Sending Params:', 'color: #60a5fa; font-weight: bold;', params);
    console.log('%c🌐 Full URL:', 'color: #60a5fa; font-weight: bold;', `/api/superadmin/leads?${new URLSearchParams(params).toString()}`);
    
    const response = await axiosInstance.get('/api/superadmin/leads', { params });
    
    console.log('%c📥 Backend Response:', 'color: #60a5fa; font-weight: bold;', response.data);
    console.log('%c📊 Response Summary:', 'color: #60a5fa; font-weight: bold;', {
      total: response.data.total,
      returned: response.data.leads?.length,
      stages: [...new Set(response.data.leads?.map(l => l.stage) || [])]
    });
    console.groupEnd();
    
    return response.data;
  },

  // Specific shortcuts for each role stage - FIXED TO FETCH SPECIFIC DATA
  getManagerLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    // Only fetch MANAGER, DONE, REJECTED stages for managers
    return adminAPI.getLeadsByStage('MANAGER', limit, skip, extraFilters);
  },
  
  getLeadQualifierLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    // Only fetch LQ stage leads for lead qualifiers
    return adminAPI.getLeadsByStage('LQ', limit, skip, extraFilters);
  },
  
  getVerifierLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    // Only fetch DM stage leads for verifiers
    return adminAPI.getLeadsByStage('DM', limit, skip, extraFilters);
  },
  
  getDataMinerLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    // Only fetch DM stage leads for data miners (not all leads)
    return adminAPI.getLeadsByStage('DM', limit, skip, extraFilters);
  },

  // Additional specific stage filters
  getAllLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    return adminAPI.getLeadsByStage(null, limit, skip, extraFilters);
  },

  getDMStageLeads: async (limit = 20, skip = 0, extraFilters = {}) => {
    const params = { limit, skip, stage: 'DM', ...extraFilters };
    
    console.groupCollapsed('%c🔍 Fetching DM Stage Leads', 'color: #3b82f6; font-weight: bold; font-size: 12px;');
    console.log('%cParams:', 'color: #60a5fa; font-weight: bold;', params);
    console.log('%cURL will be:', 'color: #60a5fa; font-weight: bold;', `/api/superadmin/leads?${new URLSearchParams(params).toString()}`);
    
    const response = await axiosInstance.get('/api/superadmin/leads', { params });
    
    console.log('%cResponse:', 'color: #60a5fa; font-weight: bold;', response.data);
    console.log('%cLeads count:', 'color: #60a5fa; font-weight: bold;', response.data.leads?.length);
    console.log('%cStages in response:', 'color: #60a5fa; font-weight: bold;', [...new Set(response.data.leads?.map(l => l.stage) || [])]);
    console.groupEnd();
    
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
      
      console.groupCollapsed(`%c📈 Frontend: Performance API: ${role}`, 'color: #10b981; font-weight: bold; font-size: 12px;');
      console.log('%c📤 Frontend Sending Params:', 'color: #34d399; font-weight: bold;', params);
      console.log('%c🌐 Full URL:', 'color: #34d399; font-weight: bold;', `/api/superadmin/performance?${new URLSearchParams(params).toString()}`);
      
      const response = await axiosInstance.get('/api/superadmin/performance', { params });
      
      console.log('%c📥 Backend Response:', 'color: #34d399; font-weight: bold;', response.data);
      console.log('%c📊 Performance Summary:', 'color: #34d399; font-weight: bold;', {
        role: response.data.role,
        userCount: response.data.rows?.length,
        users: response.data.rows?.map(r => ({ name: r.name, metrics: r.metrics }))
      });
      console.groupEnd();
      
      return response.data;
    } catch (error) {
      console.error(`❌ Performance API Error (${role}):`, error);
      throw error;
    }
  },

  // Get all leads with comprehensive filtering by stage and role
  getAllLeadsByRole: async (limit = 20, skip = 0, filters = {}) => {
    const params = { limit, skip, ...filters };
    
    // 🎯 Special logging for DM and LQ stages
    const isDMRequest = filters.stage === 'DM';
    const isLQRequest = filters.stage === 'LQ';
    
    console.groupCollapsed(
      isDMRequest ? '%c🛠️ Frontend: Fetching Data Miner Leads (created by Data Minors)' : 
      isLQRequest ? '%c🎯 Frontend: Fetching Lead Qualifier Leads (processed by Lead Qualifiers)' :
      '%c🔍 Frontend: Fetching All Leads by Role', 
      isDMRequest ? 'color: #3b82f6; font-weight: bold; font-size: 12px;' : 
      isLQRequest ? 'color: #8b5cf6; font-weight: bold; font-size: 12px;' :
      'color: #f59e0b; font-weight: bold; font-size: 12px;'
    );
    console.log('%c📤 Frontend Sending Params:', 'color: #fbbf24; font-weight: bold;', params);
    console.log('%c🌐 Full URL:', 'color: #fbbf24; font-weight: bold;', `/api/superadmin/leads?${new URLSearchParams(params).toString()}`);
    
    const response = await axiosInstance.get('/api/superadmin/leads', { params });
    
    console.log('%c📥 Backend Response:', 'color: #fbbf24; font-weight: bold;', response.data);
    
    if (isDMRequest) {
      console.log('%c🛠️ Data Miner Leads Summary:', 'color: #3b82f6; font-weight: bold;', {
        total: response.data.total,
        returned: response.data.leads?.length,
        sampleLeads: response.data.leads?.slice(0, 3).map(l => ({
          name: l.name,
          createdBy: l.createdBy?.name,
          stage: l.stage,
          emailCount: l.emails?.length || 0,
          phoneCount: l.phones?.length || 0
        }))
      });
    } else if (isLQRequest) {
      console.log('%c🎯 Lead Qualifier Leads Summary:', 'color: #8b5cf6; font-weight: bold;', {
        total: response.data.total,
        returned: response.data.leads?.length,
        sampleLeads: response.data.leads?.slice(0, 3).map(l => ({
          name: l.name,
          lqStatus: l.lqStatus,
          lqUpdatedBy: l.lqUpdatedBy?.name,
          stage: l.stage,
          assignedTo: l.assignedTo?.name,
          commentCount: l.comments?.length || 0
        }))
      });
    } else {
      console.log('%c� Response Summary:', 'color: #fbbf24; font-weight: bold;', {
        total: response.data.total,
        returned: response.data.leads?.length,
        stages: [...new Set(response.data.leads?.map(l => l.stage) || [])],
        stageBreakdown: response.data.leads?.reduce((acc, lead) => {
          acc[lead.stage] = (acc[lead.stage] || 0) + 1;
          return acc;
        }, {})
      });
    }
    console.groupEnd();
    
    return response.data;
  },

  // Make user a super admin
  makeSuperAdmin: async (userId) => {
    const response = await axiosInstance.patch(`/api/superadmin/users/${userId}/make-super-admin`);
    return response.data;
  },
};

export default adminAPI;
