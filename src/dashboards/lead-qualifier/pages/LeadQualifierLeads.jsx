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

    const [dateFilter, setDateFilter] = useState('ALL');

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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Lead Pipeline</h1>
                    <p className="text-[var(--text-secondary)] text-sm font-medium mt-1">Efficiently manage and qualify your assigned leads</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Search Field */}
                    <div className="relative flex-1 sm:w-80 group">
                        <input
                            type="text"
                            placeholder="Find leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm rounded-2xl px-5 py-3 pl-12 focus:outline-none focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary)]/10 transition-all shadow-xl shadow-black/5 group-hover:border-[var(--accent-primary)]/40"
                        />
                        <svg className="absolute left-4 top-3.5 h-5 w-5 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Date Filter Dropdown */}
                    <div className="relative w-full sm:w-48 group">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full appearance-none bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-black uppercase tracking-widest rounded-2xl px-5 py-3 focus:outline-none focus:border-[var(--accent-primary)] transition-all cursor-pointer group-hover:border-[var(--accent-primary)]/40 pr-10 shadow-lg shadow-black/5"
                        >
                            <option value="ALL">All Dates ({counts.ALL})</option>
                            <option value="TODAY">Today ({counts.TODAY})</option>
                            <option value="THIS_WEEK">This Week ({counts.THIS_WEEK})</option>
                            <option value="PREVIOUS_WEEKS">Previous Weeks ({counts.PREVIOUS_WEEKS})</option>
                            <option value="THIS_MONTH">This Month ({counts.THIS_MONTH})</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex bg-[var(--bg-secondary)] rounded-2xl p-1 shadow-xl shadow-black/5 border border-[var(--border-primary)] overflow-x-auto">
                        {['ALL', 'PENDING', 'IN_CONVERSATION', 'QUALIFIED', 'DEAD'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                                    activeTab === tab
                                        ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20'
                                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/30'
                                }`}
                            >
                                {tab === 'ALL' ? 'All Leads' : tab.replace('_', ' ')} ({counts[tab]})
                            </button>
                        ))}
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
                                            {/* Lead Contacts */}
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest px-1">Lead Contacts</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {(lead.emails || []).map((email, idx) => (
                                                        <div
                                                            key={`email-${idx}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(email.value);
                                                                setCopiedEmailIndex(idx);
                                                                setTimeout(() => setCopiedEmailIndex(null), 2000);
                                                            }}
                                                            className="group/contact flex-grow flex-shrink-0 min-w-[200px] items-center justify-start bg-[var(--bg-tertiary)]/20 border border-[var(--border-primary)]/40 p-2 rounded-xl hover:border-[var(--accent-primary)]/30 transition-all cursor-pointer relative"
                                                        >
                                                            <div className="flex items-center gap-2.5 overflow-hidden">
                                                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${email.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-amber-400'}`} />
                                                                <span className="text-[11px] font-bold text-[var(--text-primary)] truncate" title={email.value}>
                                                                    {email.value}
                                                                </span>
                                                            </div>
                                                            {copiedEmailIndex === idx && (
                                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-emerald-500 animate-fadeIn">Copied!</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {(lead.phones || []).map((phone, idx) => (
                                                        <div
                                                            key={`phone-${idx}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(phone);
                                                                setCopiedPhoneIndex(idx);
                                                                setTimeout(() => setCopiedPhoneIndex(null), 2000);
                                                            }}
                                                            className="group/contact flex-grow flex-shrink-0 min-w-[200px] flex items-center justify-start bg-[var(--bg-tertiary)]/20 border border-[var(--border-primary)]/40 p-2 rounded-xl hover:border-[var(--accent-primary)]/30 transition-all cursor-pointer relative"
                                                        >
                                                            <div className="flex items-center gap-2.5 overflow-hidden">
                                                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                                                                <span className="text-[11px] font-bold text-[var(--text-primary)] truncate" title={phone}>
                                                                    {phone}
                                                                </span>
                                                            </div>
                                                            {copiedPhoneIndex === idx && (
                                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-emerald-500 animate-fadeIn">Copied!</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {((lead.emails || []).length === 0 && (lead.phones || []).length === 0) && (
                                                        <div className="text-center py-4 text-xs font-medium opacity-60 text-[var(--text-tertiary)] w-full">No contact information available.</div>
                                                    )}
                                                </div>
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

                                            {/* Status Picker */}
                                            <div className="pt-2">
                                                <div className="relative group/select">
                                                    <select
                                                        value={lead.lqStatus || 'PENDING'}
                                                        onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                                                        className="w-full appearance-none bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/40 px-4 py-2.5 rounded-xl text-[11px] font-black text-[var(--accent-primary)] uppercase tracking-widest focus:outline-none cursor-pointer shadow-sm hover:bg-[var(--accent-primary)]/30 transition-all text-center"
                                                    >
                                                        <option value="PENDING" className="bg-[#1a1a1a]">PENDING</option>
                                                        <option value="IN_CONVERSATION" className="bg-[#1a1a1a]">IN-CONV</option>
                                                        <option value="QUALIFIED" className="bg-[#1a1a1a]">QUALIFIED</option>
                                                        <option value="DEAD" className="bg-[#1a1a1a]">DEAD</option>
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

            {/* Modals (No changes to logic, just styling adjustments for premium feel) */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60 animate-fadeIn">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] w-full max-w-lg overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.6)]">
                        <div className="p-8 border-b border-[var(--border-primary)] flex justify-between items-center bg-gradient-to-r from-transparent to-[var(--accent-primary)]/5">
                            <div>
                                <h3 className="text-2xl font-black text-[var(--text-primary)]">Handover Lead</h3>
                                <p className="text-[var(--text-tertiary)] text-[10px] uppercase font-black tracking-widest mt-1 opacity-60">Transfer lead to manager pipeline</p>
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
                                className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--accent-error)] hover:text-white flex items-center justify-center transition-all active:scale-95 group"
                            >
                                <svg className="h-6 w-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Target Manager</label>
                                <div className="relative group">
                                    <select
                                        value={selectedManagerId}
                                        onChange={(e) => setSelectedManagerId(e.target.value)}
                                        className="w-full appearance-none bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-6 py-4.5 focus:outline-none focus:border-[var(--accent-primary)] font-black text-sm transition-all shadow-inner group-hover:border-[var(--accent-primary)]/40"
                                    >
                                        <option value="">Select a manager...</option>
                                        {managers.map(m => (
                                            <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                        <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Platform</label>
                                <div className="relative group">
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
                                        className="w-full appearance-none bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-6 py-4.5 focus:outline-none focus:border-[var(--accent-primary)] font-black text-sm transition-all shadow-inner group-hover:border-[var(--accent-primary)]/40"
                                    >
                                        <option value="EMAIL">Email</option>
                                        <option value="PHONE">GB</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                        <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">
                                    {responseType === 'EMAIL' ? 'Select Email' : 'Select GB Number'}
                                </label>
                                <div className="relative group">
                                    <select
                                        value={responseValue}
                                        onChange={(e) => setResponseValue(e.target.value)}
                                        disabled={
                                            !selectedLead ||
                                            (responseType === 'EMAIL'
                                                ? !((selectedLead.emails || []).length)
                                                : !((selectedLead.phones || []).length))
                                        }
                                        className="w-full appearance-none bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-6 py-4.5 focus:outline-none focus:border-[var(--accent-primary)] font-black text-sm transition-all shadow-inner group-hover:border-[var(--accent-primary)]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {responseType === 'EMAIL' ? (
                                            (selectedLead?.emails || []).length > 0 ? (
                                                (selectedLead.emails || []).map((em, idx) => (
                                                    <option key={idx} value={String(em.value || '')}>{String(em.value || '')}</option>
                                                ))
                                            ) : (
                                                <option value="">No emails available</option>
                                            )
                                        ) : (
                                            (selectedLead?.phones || []).length > 0 ? (
                                                (selectedLead.phones || []).map((ph, idx) => (
                                                    <option key={idx} value={String(ph || '')}>{String(ph || '')}</option>
                                                ))
                                            ) : (
                                                <option value="">No numbers available</option>
                                            )
                                        )}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                        <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Handover Instructions</label>
                                <textarea
                                    value={assignComment}
                                    onChange={(e) => setAssignComment(e.target.value)}
                                    placeholder="Add context for the manager..."
                                    className="w-full bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-3xl px-6 py-5 h-36 focus:outline-none focus:border-[var(--accent-primary)] font-medium transition-all shadow-inner resize-none group-hover:border-[var(--accent-primary)]/40"
                                />
                            </div>
                            <button
                                onClick={handleAssignManager}
                                disabled={!selectedManagerId || !responseValue}
                                className="w-full h-16 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)]/80 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-[var(--accent-primary)]/20 active:scale-95"
                            >
                                Transfer Ownership
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