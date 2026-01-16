import { useState, useEffect, useCallback } from 'react';
import { lqAPI } from '../../../api/lead-qualifier.api';

export const useLeadManager = () => {
    const [leads, setLeads] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLeads = useCallback(async () => {
        try {
            setLoading(true);
            const response = await lqAPI.getMyLeads(200, 0);
            if (response.success) {
                setLeads(response.leads || []);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch leads");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchManagers = useCallback(async () => {
        try {
            const response = await lqAPI.getManagers();
            if (response.success && response.managers && response.managers.length > 0) {
                const formattedManagers = response.managers.map(m => ({
                    ...m,
                    _id: m.id || m._id
                }));
                setManagers(formattedManagers);
            } else {
                // Formatting fallback or mock data if needed, but keeping it clean for now
                setManagers([]);
            }
        } catch (err) {
            console.error("Fetch managers error:", err);
            // Fallback for development/demo
            setManagers([
                { _id: 'mock-1', name: 'Zeeshan Manager', email: 'zeeshan@globaldigitsolutions.com' },
                { _id: 'mock-2', name: 'Ayesha Manager', email: 'ayesha@globaldigitsolutions.com' },
                { _id: 'mock-3', name: 'Usman Manager', email: 'usman@globaldigitsolutions.com' }
            ]);
        }
    }, []);

    const updateLeadStatus = async (leadId, newStatus) => {
        if (newStatus === "PENDING") return;
        try {
            const response = await lqAPI.updateStatus(leadId, newStatus);
            if (response.success) {
                setLeads(prev => prev.map(l => l._id === leadId ? { ...l, lqStatus: newStatus } : l));
                return true;
            }
        } catch (err) {
            console.error("Update status error:", err);
            return false;
        }
        return false;
    };

    const addLeadComment = async (leadId, commentText) => {
        try {
            const response = await lqAPI.addComment(leadId, commentText);
            if (response.success) {
                setLeads(prev => prev.map(l => {
                    if (l._id === leadId) {
                        const newComments = [...(l.comments || []), {
                            text: commentText,
                            createdByRole: 'Lead Qualifiers',
                            createdDate: new Date().toISOString().split('T')[0]
                        }];
                        return { ...l, comments: newComments };
                    }
                    return l;
                }));
                return true;
            }
        } catch (err) {
            console.error("Add comment error:", err);
            return false;
        }
        return false;
    };

    const assignLeadManager = async (leadId, managerId, comment, responseType, responseValue) => {
        try {
            const response = await lqAPI.assignToManager(
                leadId,
                managerId,
                comment,
                responseType,
                responseValue
            );
            if (response.success) {
                setLeads(prev => prev.filter(l => l._id !== leadId));
                return true;
            }
        } catch (err) {
            console.error("Assign manager error:", err);
            return false;
        }
        return false;
    };

    useEffect(() => {
        fetchLeads();
        fetchManagers();
    }, [fetchLeads, fetchManagers]);

    return {
        leads,
        managers,
        loading,
        error,
        updateLeadStatus,
        addLeadComment,
        assignLeadManager,
        refreshLeads: fetchLeads
    };
};
