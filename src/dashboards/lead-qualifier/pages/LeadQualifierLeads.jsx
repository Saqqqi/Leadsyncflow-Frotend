import React, { useState, useEffect, useMemo } from 'react';
import { lqAPI } from '../../../api/lead-qualifier.api';

export default function LeadQualifierLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('ALL');
    const [managers, setManagers] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [assignComment, setAssignComment] = useState('');
    const [selectedManagerId, setSelectedManagerId] = useState('');
    const [responseType, setResponseType] = useState('EMAIL');
    const [responseValue, setResponseValue] = useState('');
    const [expandedLeadId, setExpandedLeadId] = useState(null);
    const [copiedEmailIndex, setCopiedEmailIndex] = useState(null);
    const [copiedPhoneIndex, setCopiedPhoneIndex] = useState(null);
    const [dateFilter, setDateFilter] = useState('ALL');

    const getStartOfWeek = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start of week
        return new Date(d.setDate(diff));
    };

    const getEndOfWeek = (date) => {
        const startOfWeek = getStartOfWeek(date);
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + 6);
        d.setHours(23, 59, 59, 999);
        return d;
    };

    const isToday = (date) => {
        const today = new Date();
        const d = new Date(date);
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    };

    const isThisWeek = (date) => {
        const today = new Date();
        const startOfThisWeek = getStartOfWeek(today);
        const endOfThisWeek = getEndOfWeek(today);
        const d = new Date(date);
        return d >= startOfThisWeek && d <= endOfThisWeek;
    };

    const isPreviousWeeks = (date) => {
        const today = new Date();
        const startOfThisWeek = getStartOfWeek(today);
        const d = new Date(date);
        return d < startOfThisWeek;
    };

    const isThisMonth = (date) => {
        const today = new Date();
        const d = new Date(date);
        return d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    };

    useEffect(() => {
        fetchLeads();
        fetchManagers();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await lqAPI.getMyLeads(200, 0);
            console.log('responsewwwwwwwwwwwwwwwwwwwwwwwwwwwww', response);
            if (response.success) {
                setLeads(response.leads || []);
            }
        } catch (err) {
            console.log('errorwwwwwwwwwwwwwwwwwwwwwwwwwwwww', err);
            setError("Failed to fetch leads");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchManagers = async () => {
        try {
            const response = await lqAPI.getManagers();
            if (response.success && response.managers && response.managers.length > 0) {
                // Backend returns 'id', we map to '_id' for component compatibility
                const formattedManagers = response.managers.map(m => ({
                    ...m,
                    _id: m.id || m._id
                }));
                setManagers(formattedManagers);
            } else {
                setManagers([
                    { _id: 'mock-1', name: 'Zeeshan Manager', email: 'zeeshan@globaldigitsolutions.com' },
                    { _id: 'mock-2', name: 'Ayesha Manager', email: 'ayesha@globaldigitsolutions.com' },
                    { _id: 'mock-3', name: 'Usman Manager', email: 'usman@globaldigitsolutions.com' }
                ]);
            }
        } catch (err) {
            console.error("Fetch managers error:", err);
            setManagers([
                { _id: 'mock-1', name: 'Zeeshan Manager', email: 'zeeshan@globaldigitsolutions.com' },
                { _id: 'mock-2', name: 'Ayesha Manager', email: 'ayesha@globaldigitsolutions.com' }
            ]);
        }
    };

    const handleUpdateStatus = async (leadId, newStatus) => {
        if (newStatus === "PENDING") return;
        try {
            const response = await lqAPI.updateStatus(leadId, newStatus);
            if (response.success) {
                setLeads(prev => prev.map(l => l._id === leadId ? { ...l, lqStatus: newStatus } : l));
            }
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim() || !selectedLead) return;
        try {
            const response = await lqAPI.addComment(selectedLead._id, commentText);
            if (response.success) {
                setLeads(prev => prev.map(l => {
                    if (l._id === selectedLead._id) {
                        const newComments = [...(l.comments || []), {
                            text: commentText,
                            createdByRole: 'Lead Qualifiers',
                            createdDate: new Date().toISOString().split('T')[0]
                        }];
                        return { ...l, comments: newComments };
                    }
                    return l;
                }));
                setCommentText('');
                setIsCommentModalOpen(false);
            }
        } catch (err) {
            alert("Failed to add comment");
        }
    };

    const handleAssignManager = async () => {
        if (!selectedManagerId || !selectedLead || !responseType || !responseValue) return;
        try {
            const response = await lqAPI.assignToManager(
                selectedLead._id,
                selectedManagerId,
                assignComment,
                responseType,
                responseValue
            );
            if (response.success) {
                setLeads(prev => prev.filter(l => l._id !== selectedLead._id));
                setIsAssignModalOpen(false);
                setSelectedManagerId('');
                setAssignComment('');
                setSelectedLead(null);
                setResponseType('EMAIL');
                setResponseValue('');
            }
        } catch (err) {
            alert("Assignment failed.");
        }
    };

    const counts = useMemo(() => {
        const initialCounts = { ALL: 0, PENDING: 0, IN_CONVERSATION: 0, QUALIFIED: 0, DEAD: 0, TODAY: 0, THIS_WEEK: 0, PREVIOUS_WEEKS: 0, THIS_MONTH: 0 };
        return leads.reduce((acc, lead) => {
            const submittedDate = new Date(lead.submittedDate); // Assuming lead.submittedDate is a valid date string

            // Status counts
            const status = lead.lqStatus || 'PENDING';
            acc[status] = (acc[status] || 0) + 1;
            acc['ALL'] = (acc['ALL'] || 0) + 1;

            // Date counts
            if (isToday(submittedDate)) {
                acc['TODAY'] = (acc['TODAY'] || 0) + 1;
            }
            if (isThisWeek(submittedDate)) {
                acc['THIS_WEEK'] = (acc['THIS_WEEK'] || 0) + 1;
            }
            if (isPreviousWeeks(submittedDate)) {
                acc['PREVIOUS_WEEKS'] = (acc['PREVIOUS_WEEKS'] || 0) + 1;
            }
            if (isThisMonth(submittedDate)) {
                acc['THIS_MONTH'] = (acc['THIS_MONTH'] || 0) + 1;
            }

            return acc;
        }, initialCounts);
    }, [leads, isToday, isThisWeek, isPreviousWeeks, isThisMonth]);

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch = (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (lead.emails?.some(e => (e.value || '').toLowerCase().includes(searchTerm.toLowerCase())));
            const currentStatus = lead.lqStatus || 'PENDING';
            const matchesStatus = activeTab === 'ALL' || currentStatus === activeTab;

            const submittedDate = new Date(lead.submittedDate);
            let matchesDate = true;
            if (dateFilter === 'TODAY') {
                matchesDate = isToday(submittedDate);
            } else if (dateFilter === 'THIS_WEEK') {
                matchesDate = isThisWeek(submittedDate);
            } else if (dateFilter === 'PREVIOUS_WEEKS') {
                matchesDate = isPreviousWeeks(submittedDate);
            } else if (dateFilter === 'THIS_MONTH') {
                matchesDate = isThisMonth(submittedDate);
            }

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [leads, searchTerm, activeTab, dateFilter, isToday, isThisWeek, isPreviousWeeks, isThisMonth]);

    const getStatusStyle = (status) => {
        const s = (status || 'PENDING').toUpperCase();
        switch (s) {
            case 'QUALIFIED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'IN_CONVERSATION': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            case 'DEAD': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-[var(--accent-primary)] animate-ping" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn max-w-[1600px] mx-auto px-4 sm:px-6">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-[var(--bg-secondary)] p-6 rounded-[32px] border border-[var(--border-primary)] shadow-sm">
                <div className="flex-shrink-0">
                    <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Lead Pipeline</h1>
                    <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Success Dashboard</p>
                </div>

                <div className="flex flex-wrap xl:flex-nowrap items-center gap-3 w-full xl:w-auto">
                    {/* Search Field */}
                    <div className="relative flex-grow min-w-[200px] xl:w-64 group">
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-bold rounded-2xl px-5 py-3 pl-10 focus:outline-none focus:border-[var(--accent-primary)] transition-all shadow-inner group-hover:border-[var(--accent-primary)]/30"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Date Filter Dropdown */}
                    <div className="relative flex-shrink-0 group">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full appearance-none bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest rounded-2xl px-5 py-3 pr-10 focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer shadow-inner"
                        >
                            <option value="ALL" className="bg-[#1a1a1a] text-white">All Time</option>
                            <option value="TODAY" className="bg-[#1a1a1a] text-white">Today</option>
                            <option value="THIS_WEEK" className="bg-[#1a1a1a] text-white">This Week</option>
                            <option value="PREVIOUS_WEEKS" className="bg-[#1a1a1a] text-white">Previous Weeks</option>
                            <option value="THIS_MONTH" className="bg-[#1a1a1a] text-white">This Month</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-tertiary)]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>

                    {/* Status Filter Dropdown */}
                    <div className="relative group">
                        <select
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                            className="w-full xl:w-40 appearance-none bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest rounded-2xl px-5 py-3 pr-10 focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer shadow-inner transition-all hover:bg-[var(--bg-tertiary)]/50"
                        >
                            <option value="ALL" className="bg-[#1a1a1a] text-white">All Leads</option>
                            <option value="PENDING" className="bg-[#1a1a1a] text-white">Pending</option>
                            <option value="IN_CONVERSATION" className="bg-[#1a1a1a] text-white">In-Conv</option>
                            <option value="QUALIFIED" className="bg-[#1a1a1a] text-white">Qualified</option>
                            <option value="DEAD" className="bg-[#1a1a1a] text-white">Dead</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leads Grid */}
            {filteredLeads.length === 0 ? (
                <div className="bg-[var(--bg-secondary)] rounded-[40px] border-2 border-dashed border-[var(--border-primary)] p-24 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--bg-tertiary)]/30 mb-8 border border-[var(--border-primary)]/50">
                        <svg className="h-12 w-12 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">No matching leads</h3>
                    <p className="text-[var(--text-secondary)] text-sm mt-3 max-w-sm mx-auto font-medium opacity-60">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredLeads.map(lead => {
                        const isExpanded = expandedLeadId === lead._id;
                        return (
                            <div
                                key={lead._id}
                                onClick={() => setExpandedLeadId(isExpanded ? null : lead._id)}
                                className={`bg-[var(--bg-secondary)] rounded-[24px] border border-[var(--border-primary)] overflow-hidden hover:border-[var(--accent-primary)]/40 transition-all duration-500 shadow-xl flex flex-col group relative cursor-pointer ${isExpanded ? 'ring-2 ring-[var(--accent-primary)]/20 shadow-2xl' : ''}`}
                            >
                                {/* Lead Badge */}
                                <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-[0.15em] z-10 ${getStatusStyle(lead.lqStatus)}`}>
                                    {lead.lqStatus || 'NEW'}
                                </div>

                                <div className="p-5 space-y-4">
                                    {/* Header (Always Visible) */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary)]/60 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[var(--accent-primary)]/20 transition-all duration-500 group-hover:rotate-6">
                                            {lead.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h3 className="text-[var(--text-primary)] font-black text-sm truncate leading-tight">{lead.name}</h3>
                                            <div className="flex items-center gap-1 opacity-60 mt-0.5">
                                                <svg className="w-3 h-3 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                                <span className="text-[9px] font-black uppercase tracking-widest">{lead.location || 'Global'}</span>
                                            </div>
                                        </div>
                                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                            <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="space-y-4 animate-slideDown overflow-hidden pt-2 border-t border-[var(--border-primary)]/30" onClick={(e) => e.stopPropagation()}>
                                            {/* Lead Contacts - Separated */}
                                            <div className="space-y-4">
                                                {/* Emails Section */}
                                                {(lead.emails || []).length > 0 && (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-widest px-1 flex items-center gap-1.5 opacity-80">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                            Email Addresses
                                                        </label>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                                            {lead.emails.map((email, idx) => (
                                                                <div
                                                                    key={`email-${idx}`}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigator.clipboard.writeText(email.value);
                                                                        setCopiedEmailIndex(idx);
                                                                        setTimeout(() => setCopiedEmailIndex(null), 2000);
                                                                    }}
                                                                    className="group/contact flex items-center justify-start gap-2 bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)]/50 p-2 rounded-xl hover:border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/5 transition-all cursor-pointer relative overflow-hidden"
                                                                >
                                                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                                                        <div className={`w-1 h-1 rounded-full flex-shrink-0 ${email.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-amber-400'}`} />
                                                                        <span className="text-[9px] font-bold text-[var(--text-primary)] truncate" title={email.value}>
                                                                            {email.value}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-shrink-0 ml-1">
                                                                        {copiedEmailIndex === idx ? (
                                                                            <span className="text-[8px] font-black uppercase text-emerald-500 animate-fadeIn">Copied!</span>
                                                                        ) : (
                                                                            <svg className="w-3 h-3 text-[var(--text-tertiary)] opacity-0 group-hover/contact:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Phone Numbers Section */}
                                                {(lead.phones || []).length > 0 && (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-1 flex items-center gap-1.5 opacity-80">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                            Phone Numbers
                                                        </label>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                                            {lead.phones.map((phone, idx) => (
                                                                <div
                                                                    key={`phone-${idx}`}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigator.clipboard.writeText(phone);
                                                                        setCopiedPhoneIndex(idx);
                                                                        setTimeout(() => setCopiedPhoneIndex(null), 2000);
                                                                    }}
                                                                    className="group/contact flex items-center justify-start gap-2 bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)]/50 p-2 rounded-xl hover:border-blue-500/40 hover:bg-blue-500/5 transition-all cursor-pointer relative overflow-hidden"
                                                                >
                                                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                                                        <div className="w-1 h-1 rounded-full flex-shrink-0 bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
                                                                        <span className="text-[9px] font-bold text-[var(--text-primary)] truncate" title={phone}>
                                                                            {phone}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-shrink-0 ml-1">
                                                                        {copiedPhoneIndex === idx ? (
                                                                            <span className="text-[8px] font-black uppercase text-emerald-500 animate-fadeIn">Copied!</span>
                                                                        ) : (
                                                                            <svg className="w-3 h-3 text-[var(--text-tertiary)] opacity-0 group-hover/contact:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {((lead.emails || []).length === 0 && (lead.phones || []).length === 0) && (
                                                    <div className="text-center py-6 bg-[var(--bg-tertiary)]/10 rounded-2xl border border-dashed border-[var(--border-primary)]/50">
                                                        <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">No contact methods found</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Toolbar */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => { setSelectedLead(lead); setIsCommentModalOpen(true); }}
                                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)]/50 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                                    Notes ({lead.comments?.length || 0})
                                                </button>
                                                {(activeTab === 'QUALIFIED' && lead.lqStatus === 'QUALIFIED') && (
                                                    <button
                                                        onClick={() => {
                                                            const emails = lead.emails || [];
                                                            const phones = lead.phones || [];

                                                            setSelectedLead(lead);
                                                            setSelectedManagerId('');
                                                            setAssignComment('');

                                                            if (emails.length > 0) {
                                                                setResponseType('EMAIL');
                                                                setResponseValue(String(emails[0].value || ''));
                                                            } else if (phones.length > 0) {
                                                                setResponseType('PHONE');
                                                                setResponseValue(String(phones[0] || ''));
                                                            } else {
                                                                setResponseType('EMAIL');
                                                                setResponseValue('');
                                                            }

                                                            setIsAssignModalOpen(true);
                                                        }}
                                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--accent-primary)]/20 hover:-translate-y-0.5 transition-all"
                                                    >
                                                        Push <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Status Picker - Reduced Width */}
                                            <div className="pt-4 flex justify-end">
                                                <div className="relative group/select w-40">
                                                    <select
                                                        value={lead.lqStatus || 'PENDING'}
                                                        onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                                                        className="w-full appearance-none bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 px-4 py-2 rounded-xl text-[11px] font-black text-[var(--accent-primary)] uppercase tracking-widest focus:outline-none cursor-pointer shadow-sm hover:bg-[var(--accent-primary)]/20 transition-all text-center"
                                                    >
                                                        <option value="PENDING" className="bg-[#1a1a1a] text-white">PENDING</option>
                                                        <option value="IN_CONVERSATION" className="bg-[#1a1a1a] text-white">IN-CONV</option>
                                                        <option value="QUALIFIED" className="bg-[#1a1a1a] text-white">QUALIFIED</option>
                                                        <option value="DEAD" className="bg-[#1a1a1a] text-white">DEAD</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Push / Transfer Modal Refined */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-fadeIn">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-5 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-tertiary)]/10">
                            <div>
                                <h3 className="text-lg font-black text-[var(--text-primary)]">Push to Manager</h3>
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Lead Handover</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsAssignModalOpen(false);
                                    setSelectedManagerId('');
                                    setAssignComment('');
                                    setSelectedLead(null);
                                    setResponseType('EMAIL');
                                    setResponseValue('');
                                }}
                                className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)]/40 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center transition-all"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest px-1">Select Manager</label>
                                <div className="relative">
                                    <select
                                        value={selectedManagerId}
                                        onChange={(e) => setSelectedManagerId(e.target.value)}
                                        className="w-full appearance-none bg-[var(--bg-tertiary)]/20 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[var(--accent-primary)] font-bold text-xs transition-all cursor-pointer"
                                    >
                                        <option value="" className="bg-[#1a1a1a] text-white">Choose a manager...</option>
                                        {managers.map(m => (
                                            <option key={m._id} value={m._id} className="bg-[#1a1a1a] text-white">{m.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest px-1">Medium</label>
                                    <div className="relative">
                                        <select
                                            value={responseType}
                                            onChange={(e) => {
                                                const nextType = e.target.value;
                                                const emails = (selectedLead && selectedLead.emails) ? selectedLead.emails : [];
                                                const phones = (selectedLead && selectedLead.phones) ? selectedLead.phones : [];
                                                setResponseType(nextType);
                                                if (nextType === 'EMAIL') {
                                                    setResponseValue(emails.length > 0 ? String(emails[0].value || '') : '');
                                                } else {
                                                    setResponseValue(phones.length > 0 ? String(phones[0] || '') : '');
                                                }
                                            }}
                                            className="w-full appearance-none bg-[var(--bg-tertiary)]/20 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[var(--accent-primary)] font-bold text-xs transition-all cursor-pointer"
                                        >
                                            <option value="EMAIL" className="bg-[#1a1a1a] text-white">Email</option>
                                            <option value="PHONE" className="bg-[#1a1a1a] text-white">Phone</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-right">
                                    <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest px-1">Selected</label>
                                    <div className="relative">
                                        <select
                                            value={responseValue}
                                            onChange={(e) => setResponseValue(e.target.value)}
                                            disabled={
                                                !selectedLead ||
                                                (responseType === 'EMAIL'
                                                    ? !((selectedLead.emails || []).length)
                                                    : !((selectedLead.phones || []).length))
                                            }
                                            className="w-full appearance-none bg-[var(--bg-tertiary)]/20 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[var(--accent-primary)] font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            {responseType === 'EMAIL' ? (
                                                (selectedLead?.emails || []).map((em, idx) => (
                                                    <option key={idx} value={String(em.value || '')} className="bg-[#1a1a1a] text-white">{String(em.value || '')}</option>
                                                ))
                                            ) : (
                                                (selectedLead?.phones || []).map((ph, idx) => (
                                                    <option key={idx} value={String(ph || '')} className="bg-[#1a1a1a] text-white">{String(ph || '')}</option>
                                                ))
                                            )}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest px-1">Handover Note</label>
                                <textarea
                                    value={assignComment}
                                    onChange={(e) => setAssignComment(e.target.value)}
                                    placeholder="Brief instructions for the manager..."
                                    className="w-full bg-[var(--bg-tertiary)]/20 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-5 py-4 h-24 focus:outline-none focus:border-[var(--accent-primary)] font-medium text-xs transition-all resize-none"
                                />
                            </div>

                            <button
                                onClick={handleAssignManager}
                                disabled={!selectedManagerId || !responseValue}
                                className="w-full py-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-[var(--accent-primary)]/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Confirm Handover
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCommentModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60 animate-fadeIn">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] w-full max-w-lg overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.6)]">
                        <div className="p-8 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-tertiary)]/30">
                            <div>
                                <h3 className="text-2xl font-black text-[var(--text-primary)]">Lead Timeline</h3>
                                <p className="text-[var(--text-tertiary)] text-[10px] uppercase font-black tracking-widest mt-1 opacity-60">Audit log and status notes</p>
                            </div>
                            <button onClick={() => setIsCommentModalOpen(false)} className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--accent-error)] hover:text-white flex items-center justify-center transition-all group">
                                <svg className="h-6 w-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="max-h-72 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {(selectedLead?.comments || []).length === 0 ? (
                                    <div className="text-center py-12 opacity-30 italic text-sm font-medium">No timeline events recorded.</div>
                                ) : (
                                    selectedLead.comments.map((c, i) => (
                                        <div key={i} className="p-5 rounded-3xl bg-[var(--bg-tertiary)]/20 border border-[var(--border-primary)]/50 hover:border-[var(--accent-primary)]/20 transition-colors">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-primary)]">{c.createdByRole || 'Admin'}</span>
                                                <span className="text-[10px] font-black text-[var(--text-tertiary)] opacity-60">{c.createdDate || c.createdAt?.split('T')[0]}</span>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">{c.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="space-y-3">
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a new observation..."
                                    className="w-full bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-3xl px-6 py-5 h-32 focus:outline-none focus:border-[var(--accent-primary)] font-medium transition-all shadow-inner resize-none"
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!commentText.trim()}
                                    className="w-full h-14 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)] hover:text-white disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed text-[var(--accent-primary)] font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg active:scale-95"
                                >
                                    Append Entry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}