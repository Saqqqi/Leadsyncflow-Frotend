import { useState, useEffect, useCallback, useRef } from 'react';
import { lqAPI } from '../../../api/lead-qualifier.api';

export const useLeadManager = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [leadsError, setLeadsError] = useState(null);

    // Use refs to prevent redundant/parallel overlapping fetches
    const isFetchingLeads = useRef(false);

    const fetchLeads = useCallback(async (force = false) => {
        if (isFetchingLeads.current && !force) return;

        try {
            isFetchingLeads.current = true;
            setLoading(true);
            const response = await lqAPI.getMyLeads(20, 0);
            if (response.success) {
                setLeads(response.leads || []);
                setLeadsError(null);
            } else {
                setLeadsError(response.message || "Failed to fetch leads");
            }
        } catch (err) {
            console.error("Fetch leads error:", err);
            setLeadsError("Network error while fetching leads");
        } finally {
            isFetchingLeads.current = false;
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

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
                            createdDate: new Date().toISOString()
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

    const assignLeadManager = async (leadId, selectedEmails, selectedPhones) => {
        try {
            const response = await lqAPI.submitToMyManager(leadId, selectedEmails, selectedPhones);
            if (response.success) {
                setLeads(prev => prev.filter(l => l._id !== leadId));
                return true;
            }
        } catch (err) {
            console.error("Submit to manager error:", err);
            return false;
        }
        return false;
    };

    return {
        leads,
        loading,
        error: leadsError, // Main error for UI
        updateLeadStatus,
        addLeadComment,
        assignLeadManager,
        refreshLeads: () => fetchLeads(true)
    };
};
