import { useState, useMemo } from 'react';
import { isToday, isThisWeek, isPreviousWeeks, isThisMonth } from '../utils/dateHelpers';

export const useLeadFilters = (leads) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('ALL');

    const counts = useMemo(() => {
        const initialCounts = { ALL: 0, PENDING: 0, IN_CONVERSATION: 0, QUALIFIED: 0, DEAD: 0, TODAY: 0, THIS_WEEK: 0, PREVIOUS_WEEKS: 0, THIS_MONTH: 0 };
        return leads.reduce((acc, lead) => {
            const submittedDate = new Date(lead.submittedDate);

            // Status counts
            const status = lead.lqStatus || 'PENDING';
            acc[status] = (acc[status] || 0) + 1;
            acc['ALL'] = (acc['ALL'] || 0) + 1;

            // Date counts
            if (isToday(submittedDate)) acc['TODAY'] = (acc['TODAY'] || 0) + 1;
            if (isThisWeek(submittedDate)) acc['THIS_WEEK'] = (acc['THIS_WEEK'] || 0) + 1;
            if (isPreviousWeeks(submittedDate)) acc['PREVIOUS_WEEKS'] = (acc['PREVIOUS_WEEKS'] || 0) + 1;
            if (isThisMonth(submittedDate)) acc['THIS_MONTH'] = (acc['THIS_MONTH'] || 0) + 1;

            return acc;
        }, initialCounts);
    }, [leads]);

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch = (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (lead.emails?.some(e => (e.value || '').toLowerCase().includes(searchTerm.toLowerCase())));

            const currentStatus = lead.lqStatus || 'PENDING';
            const matchesStatus = activeTab === 'ALL' || currentStatus === activeTab;

            const submittedDate = new Date(lead.submittedDate);
            let matchesDate = true;

            switch (dateFilter) {
                case 'TODAY': matchesDate = isToday(submittedDate); break;
                case 'THIS_WEEK': matchesDate = isThisWeek(submittedDate); break;
                case 'PREVIOUS_WEEKS': matchesDate = isPreviousWeeks(submittedDate); break;
                case 'THIS_MONTH': matchesDate = isThisMonth(submittedDate); break;
                default: matchesDate = true;
            }

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [leads, searchTerm, activeTab, dateFilter]);

    return {
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        dateFilter,
        setDateFilter,
        counts,
        filteredLeads
    };
};
