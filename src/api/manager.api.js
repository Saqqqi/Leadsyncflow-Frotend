import axiosInstance from './axiosInstance';
import tokenManager from '../utils/tokenManager';

export const managerAPI = {
    // Get leads assigned to the current Manager
    getMyLeads: async (params = {}) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.get('/api/manager/leads', {
            params,
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Accept or Reject a lead
    submitDecision: async (leadId, decision, comment) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post(`/api/manager/leads/${leadId}/decision`, { decision, comment }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Add a general comment
    addComment: async (leadId, comment) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post(`/api/manager/leads/${leadId}/comment`, { comment }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Mark lead as PAID
    markAsPaid: async (leadId) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post(`/api/manager/leads/${leadId}/payment-status`, { status: 'PAID' }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default managerAPI;
