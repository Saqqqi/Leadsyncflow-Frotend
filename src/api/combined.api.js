import axiosInstance from './axiosInstance';

// Combined API for Data Miner and Lead Qualifier leads
export const combinedAPI = {
  // Get all leads (Data Miner + Lead Qualifier) with role-based filtering
  getAllLeadsCombined: async (limit = 1000, skip = 0, filters = {}) => {
    const params = { limit, skip, ...filters };
    
    console.groupCollapsed('%c🔍 Combined API: Fetching All Leads', 'color: #8b5cf6; font-weight: bold; font-size: 12px;');
    console.log('%c📤 Combined API Params:', 'color: #a78bfa; font-weight: bold;', params);
    console.log('%c🌐 Full URL:', 'color: #a78bfa; font-weight: bold;', `/api/superadmin/leads?${new URLSearchParams(params).toString()}`);
    
    const response = await axiosInstance.get('/api/superadmin/leads', { params });
    
    console.log('%c📥 Combined API Response:', 'color: #a78bfa; font-weight: bold;', response.data);
    console.log('%c📊 Combined API Summary:', 'color: #a78bfa; font-weight: bold;', {
      total: response.data.total,
      returned: response.data.leads?.length,
      dataMinerLeads: response.data.leads?.filter(l => !l.lqUpdatedBy).length,
      leadQualifierLeads: response.data.leads?.filter(l => l.lqUpdatedBy).length,
      stages: [...new Set(response.data.leads?.map(l => l.stage) || [])],
      lqStatuses: [...new Set(response.data.leads?.map(l => l.lqStatus).filter(Boolean) || [])]
    });
    console.groupEnd();
    
    return response.data;
  },

  // Get leads by specific role (DM or LQ)
  getLeadsByRole: async (role, limit = 1000, skip = 0, filters = {}) => {
    const params = { limit, skip, stage: role, ...filters };
    
    console.groupCollapsed(`%c🔍 Combined API: Fetching ${role} Leads`, 'color: #8b5cf6; font-weight: bold; font-size: 12px;');
    console.log('%c📤 Role-based Params:', 'color: #a78bfa; font-weight: bold;', params);
    
    const response = await axiosInstance.get('/api/superadmin/leads', { params });
    
    console.log(`%c📥 ${role} Leads Response:`, 'color: #a78bfa; font-weight: bold;', response.data);
    console.groupEnd();
    
    return response.data;
  }
};
