import axiosInstance from './axiosInstance';
import tokenManager from '../utils/tokenManager';

export const lqAPI = {
    // Get leads assigned to the current Lead Qualifier
    getMyLeads: async (limit = 20, skip = 0) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.get('/api/lq/leads', {
            params: { limit, skip },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Update the status of a lead (IN_CONVERSATION, DEAD, QUALIFIED)
    updateStatus: async (leadId, lqStatus) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.patch(`/api/lq/leads/${leadId}/status`, { lqStatus }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Add a comment to a lead
    addComment: async (leadId, text) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post(`/api/lq/leads/${leadId}/comment`, { text }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Submit lead to the assigned Manager (multi-contact)
    submitToMyManager: async (leadId, selectedEmails = [], selectedPhones = []) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post(
            `/api/lq/leads/${leadId}/submit-to-manager`,
            { selectedEmails, selectedPhones },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    }
};

export default lqAPI;
