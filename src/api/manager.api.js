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

    // Get leads that were approved for rejection (REJECTED stage)
    getApprovedRejections: async (params = {}) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.get('/api/manager/rejections-approved', {
            params,
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        return response.data;
    },

    // Request lead rejection (Sent to Super Admin)
    requestRejection: async (leadId, comment) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post(`/api/manager/leads/${leadId}/reqRejection`, { comment }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Accept or Reject a lead (If needed for other purposes)
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
    markAsPaid: async (leadId, amount, comment) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post(`/api/manager/leads/${leadId}/payment-status`, { amount, comment }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Get manager stats
    getStats: async (params = {}) => {
        const token = tokenManager.getToken();
        const user = tokenManager.getUser();
        const managerId = params.managerId || user?._id || user?.id;
        const response = await axiosInstance.get(`/api/manager/leads/stats/${managerId}`, {
            params,
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default managerAPI;
