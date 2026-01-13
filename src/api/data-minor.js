import axiosInstance from './axiosInstance';
import tokenManager from '../utils/tokenManager';

export const dataMinorAPI = {
    // Get stats for the logged-in Data Minor
    getMyStats: async () => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.get('/api/dm/stats', {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    },

    // Check for duplicate leads in real-time
    checkDuplicates: async ({ email, phone }) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.get('/api/dm/duplicates/check', {
            params: { email, phone },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Submit a new lead
    submitLead: async (leadData) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post('/api/dm/leads', leadData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Verifier Endpoints
    getVerifierLeads: async (limit = 20, skip = 0) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.get('/api/verifier/leads', {
            params: { limit, skip },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    updateLeadEmailStatus: async (leadId, emailData) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.patch(`/api/verifier/leads/${leadId}/emails/status`, emailData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

};

export default dataMinorAPI;
