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

    // Assign lead to a Manager
    assignToManager: async (leadId, managerId, commentText = '', responseType, responseValue) => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.post(
            `/api/lq/leads/${leadId}/assign-manager`,
            { managerId, commentText, responseType, responseValue },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    },

    // Get list of managers (needed for assignment)
    getManagers: async () => {
        const token = tokenManager.getToken();
        const response = await axiosInstance.get('/api/lq/managers', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};

export default lqAPI;
