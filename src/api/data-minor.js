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

    // Batch update all emails for a lead (when Done is clicked)
    updateLeadAllEmails: async (leadId, emailsData) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post(`/api/verifier/leads/${leadId}/update-emails`, {
            emails: emailsData
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    moveLeadToLeadQualifiers: async (leadId) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post(`/api/verifier/leads/${leadId}/distribute-verifier-to-lq`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    distributeVerifierLeadsToLQ: async () => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post('/api/verifier/leads/distribute-verifier-to-lq', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};

export default dataMinorAPI;
