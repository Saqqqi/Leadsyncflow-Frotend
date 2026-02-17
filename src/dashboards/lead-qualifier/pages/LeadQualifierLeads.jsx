import React, { useState, useEffect, useMemo } from 'react';
import { lqAPI } from '../../../api/lead-qualifier.api';
import SharedLoader from '../../../components/SharedLoader';

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
    const [copiedId, setCopiedId] = useState(null);
    const [dateFilter, setDateFilter] = useState('ALL');
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const getStartOfWeek = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
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
        const endOfThisWeek = new Date(startOfThisWeek);
        endOfThisWeek.setDate(endOfThisWeek.getDate() + 6);
        endOfThisWeek.setHours(23, 59, 59, 999);
        const d = new Date(date);
        return d >= startOfThisWeek && d <= endOfThisWeek;
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
            const response = await lqAPI.getMyLeads(500, 0); // Fetch more for local filtering/pagination
            if (response.success) {
                setLeads(response.leads || []);
            }
        } catch (err) {
            setError("Failed to fetch leads");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchManagers = async () => {
        try {
            const response = await lqAPI.getManagers();
            if (response.success && response.managers) {
                const formattedManagers = response.managers.map(m => ({
                    ...m,
                    _id: m.id || m._id
                }));
                setManagers(formattedManagers);
            }
        } catch (err) {
            console.error("Fetch managers error:", err);
        }
    };

    const handleUpdateStatus = async (leadId, newStatus) => {
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
                            createdDate: new Date().toISOString()
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
        if (!selectedManagerId || !selectedLead) return;
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
                setSelectedLead(null);
            }
        } catch (err) {
            alert("Assignment failed.");
        }
    };

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch = (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (lead.emails?.some(e => (e.value || '').toLowerCase().includes(searchTerm.toLowerCase())));
            const currentStatus = lead.lqStatus || 'PENDING';
            const matchesStatus = activeTab === 'ALL' || currentStatus === activeTab;

            const submittedDate = new Date(lead.submittedDate || lead.createdAt);
            let matchesDate = true;
            if (dateFilter === 'TODAY') matchesDate = isToday(submittedDate);
            else if (dateFilter === 'THIS_WEEK') matchesDate = isThisWeek(submittedDate);
            else if (dateFilter === 'THIS_MONTH') matchesDate = isThisMonth(submittedDate);

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [leads, searchTerm, activeTab, dateFilter]);

    // Client-side pagination
    const paginatedLeads = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredLeads.slice(start, start + itemsPerPage);
    }, [filteredLeads, currentPage]);

    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

    const getStatusStyle = (status) => {
        const s = (status || 'PENDING').toUpperCase();
        switch (s) {
            case 'QUALIFIED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]';
            case 'REACHED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]';
            case 'DEAD': return 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]';
            case 'PENDING': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    if (loading) return <SharedLoader />;

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fadeIn min-h-screen">
            {/* Header Section */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)] opacity-5 rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[var(--accent-primary)]/10 rounded-2xl text-[var(--accent-primary)] shadow-inner">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Lead Pipeline</h1>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] opacity-60">Personal Acquisition Queue</p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-6 border-l border-[var(--border-primary)]/30 pl-6">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] opacity-60">Total Leads</span>
                                <span className="text-xl font-black text-[var(--text-primary)]">{filteredLeads.length}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] opacity-60">Qualified</span>
                                <span className="text-xl font-black text-emerald-500">{leads.filter(l => l.lqStatus === 'QUALIFIED').length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative w-full sm:w-64 group">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="SEARCH PIPELINE..."
                                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-tertiary)]/40 border border-[var(--border-primary)] rounded-xl text-[10px] font-bold text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none transition-all placeholder:text-[var(--text-tertiary)] tracking-widest uppercase"
                            />
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-[var(--bg-tertiary)]/40 border border-[var(--border-primary)] rounded-xl px-4 py-2.5 text-[10px] font-black text-[var(--text-primary)] outline-none cursor-pointer uppercase tracking-widest focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all"
                        >
                            <option value="ALL" className="bg-[#121212] text-white">ALL TIME</option>
                            <option value="TODAY" className="bg-[#121212] text-white">TODAY</option>
                            <option value="THIS_WEEK" className="bg-[#121212] text-white">THIS WEEK</option>
                            <option value="THIS_MONTH" className="bg-[#121212] text-white">THIS MONTH</option>
                        </select>

                        <select
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                            className="bg-[var(--bg-tertiary)]/40 border border-[var(--border-primary)] rounded-xl px-4 py-2.5 text-[10px] font-black text-[var(--text-primary)] outline-none cursor-pointer uppercase tracking-widest focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all"
                        >
                            <option value="ALL" className="bg-[#121212] text-white">ALL STATUS</option>
                            <option value="PENDING" className="bg-[#121212] text-white">PENDING</option>
                            <option value="REACHED" className="bg-[#121212] text-white">REACHED</option>
                            <option value="QUALIFIED" className="bg-[#121212] text-white">QUALIFIED</option>
                            <option value="DEAD" className="bg-[#121212] text-white">DEAD</option>
                        </select>

                        <button
                            onClick={fetchLeads}
                            className="p-2.5 bg-[var(--bg-tertiary)]/40 border border-[var(--border-primary)] rounded-xl text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] shadow-xl overflow-hidden relative animate-slideUp">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Lead / Prospect</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Contact Details</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">LQ Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Origin / Created</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] text-right">Pipeline Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-primary)]/30">
                            {paginatedLeads.map((lead) => (
                                <tr key={lead._id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors group cursor-default">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary)]/60 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-[var(--accent-primary)]/20 group-hover:scale-105 transition-transform">
                                                {lead.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-[var(--text-primary)] leading-none">{lead.name}</div>
                                                <div className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1.5 opacity-60">📍 {lead.location || 'Global'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const allEmails = (lead.emails || []).map(em => em.value).join(', ');
                                                    if (allEmails) handleCopy(allEmails, `table-emails-${lead._id}`);
                                                }}
                                                title="Copy All Emails"
                                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/20 transition-all group/icon relative"
                                            >
                                                {copiedId === `table-emails-${lead._id}` ? (
                                                    <span className="text-[8px] font-black text-blue-600 uppercase">Copied!</span>
                                                ) : (
                                                    <>
                                                        <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                        <span className="text-[10px] font-black text-blue-500/80">{lead.emails?.length || 0}</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const allPhones = (lead.phones || []).join(', ');
                                                    if (allPhones) handleCopy(allPhones, `table-phones-${lead._id}`);
                                                }}
                                                title="Copy All Phones"
                                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/20 transition-all group/icon relative"
                                            >
                                                {copiedId === `table-phones-${lead._id}` ? (
                                                    <span className="text-[8px] font-black text-emerald-600 uppercase">Copied!</span>
                                                ) : (
                                                    <>
                                                        <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                        <span className="text-[10px] font-black text-emerald-500/80">{lead.phones?.length || 0}</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => { setSelectedLead(lead); setIsContactModalOpen(true); }}
                                                className="px-3 py-1 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[var(--accent-primary)] hover:text-white transition-all shadow-sm border border-[var(--accent-primary)]/20"
                                            >
                                                View Info
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative w-44 group/status">
                                            <select
                                                value={lead.lqStatus || 'PENDING'}
                                                onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                                                className={`w-full appearance-none px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border outline-none cursor-pointer transition-all duration-300 hover:brightness-110 active:scale-[0.98] shadow-sm ${getStatusStyle(lead.lqStatus)}`}
                                            >
                                                <option value="PENDING" className="bg-[#121212] text-slate-400">● PENDING</option>
                                                <option value="REACHED" className="bg-[#121212] text-blue-400">● REACHED</option>
                                                <option value="QUALIFIED" className="bg-[#121212] text-emerald-400">● QUALIFIED</option>
                                                <option value="DEAD" className="bg-[#121212] text-rose-400">● DEAD</option>
                                            </select>
                                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-40 group-hover/status:opacity-100 transition-opacity">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {lead.createdBy && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter px-1 rounded bg-blue-400/10">DM</span>
                                                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">{lead.createdBy.name}</span>
                                                </div>
                                            )}
                                            <div className="text-[9px] font-black text-[var(--text-tertiary)] opacity-40 uppercase tracking-widest pl-1">
                                                {new Date(lead.submittedDate || lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setSelectedLead(lead); setIsCommentModalOpen(true); }}
                                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)] text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/5 transition-all shadow-sm group/btn"
                                            >
                                                <svg className="w-3.5 h-3.5 opacity-50 group-hover/btn:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                                Notes
                                                {lead.comments?.length > 0 && <span className="ml-0.5 px-1 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[8px] leading-none">{lead.comments.length}</span>}
                                            </button>

                                            {lead.lqStatus === 'QUALIFIED' && (
                                                <button
                                                    onClick={() => {
                                                        const emails = lead.emails || [];
                                                        const phones = lead.phones || [];
                                                        setSelectedLead(lead);
                                                        setResponseType(emails.length > 0 ? 'EMAIL' : 'PHONE');
                                                        setResponseValue(emails.length > 0 ? String(emails[0].value || '') : (phones.length > 0 ? String(phones[0] || '') : ''));
                                                        setIsAssignModalOpen(true);
                                                    }}
                                                    disabled={!lead.comments || lead.comments.length === 0}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg ${(!lead.comments || lead.comments.length === 0)
                                                        ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20 cursor-not-allowed opacity-60'
                                                        : 'bg-[var(--accent-primary)] text-white shadow-[var(--accent-primary)]/20 hover:brightness-110 active:scale-95'}`}
                                                >
                                                    {(!lead.comments || lead.comments.length === 0) ? (
                                                        <>
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                            Add Note
                                                        </>
                                                    ) : (
                                                        <>
                                                            Push <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredLeads.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="inline-flex p-6 rounded-3xl bg-[var(--bg-tertiary)]/30 border border-dashed border-[var(--border-primary)] text-[var(--text-tertiary)] mb-4">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-[var(--text-primary)]">Pipeline Empty</h3>
                        <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mt-2 tracking-widest">No matching leads found for current criteria</p>
                    </div>
                )}

                {/* Pagination */}
                <div className="px-6 py-4 bg-[var(--bg-tertiary)]/20 border-t border-[var(--border-primary)] flex items-center justify-between">
                    <div className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
                        Displaying <span className="text-[var(--text-primary)]">{paginatedLeads.length}</span> of <span className="text-[var(--text-primary)]">{filteredLeads.length}</span> Records
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] disabled:opacity-30 hover:bg-[var(--bg-tertiary)] transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20' : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] disabled:opacity-30 hover:bg-[var(--bg-tertiary)] transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Contact Details Modal (Shared Design) */}
            {isContactModalOpen && selectedLead && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 backdrop-blur-md bg-black/50 animate-fadeIn overflow-y-auto">
                    <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-[32px] w-full max-w-md max-h-[80vh] shadow-[0_32px_128px_rgba(0,0,0,0.6)] overflow-hidden animate-slideUp flex flex-col my-auto md:my-10">
                        <div className="p-6 pb-4 border-b border-white/5 relative bg-[var(--bg-tertiary)]/20 flex-shrink-0">
                            <button onClick={() => setIsContactModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-xl bg-[var(--bg-tertiary)]/50 hover:bg-rose-500/10 hover:text-rose-500 transition-all text-[var(--text-tertiary)]"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>

                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary)]/60 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-[var(--accent-primary)]/30">{selectedLead.name?.[0]?.toUpperCase()}</div>
                                <div className="pr-12">
                                    <div className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)] mb-1 opacity-70">Intelligence Node</div>
                                    <h3 className="text-xl font-black text-[var(--text-primary)] leading-tight truncate">{selectedLead.name}</h3>
                                    <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase mt-2 group-hover:text-[var(--accent-primary)] transition-colors">📍 {selectedLead.location || 'GLOBAL REACH'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                            {/* Emails */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <button
                                        onClick={() => {
                                            const allEmails = (selectedLead.emails || []).map(e => e.value).join(', ');
                                            if (allEmails) handleCopy(allEmails, 'modal-all-emails');
                                        }}
                                        className="flex items-center gap-2 group/header hover:opacity-80 transition-all"
                                    >
                                        <div className="p-1 rounded bg-blue-500/10 text-blue-500 group-hover/header:bg-blue-500 group-hover/header:text-white transition-all">
                                            {copiedId === 'modal-all-emails' ? (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                                            {copiedId === 'modal-all-emails' ? 'Emails Copied!' : 'Established Emails'}
                                        </span>
                                    </button>
                                    <span className="text-[8px] font-black text-blue-400 opacity-60">{selectedLead.emails?.length || 0} TOTAL</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {selectedLead.emails?.map((email, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)]/50 group/item hover:border-blue-500/30 transition-all">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${email.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400'}`} />
                                                <span className="text-xs font-bold text-[var(--text-primary)] truncate">{email.value}</span>
                                            </div>
                                            <button onClick={() => handleCopy(email.value, `email-${idx}`)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-[var(--text-tertiary)] hover:text-blue-500 transition-all">
                                                {copiedId === `email-${idx}` ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Phones */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <button
                                        onClick={() => {
                                            const allPhones = (selectedLead.phones || []).join(', ');
                                            if (allPhones) handleCopy(allPhones, 'modal-all-phones');
                                        }}
                                        className="flex items-center gap-2 group/header hover:opacity-80 transition-all"
                                    >
                                        <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 group-hover/header:bg-emerald-500 group-hover/header:text-white transition-all">
                                            {copiedId === 'modal-all-phones' ? (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                                            {copiedId === 'modal-all-phones' ? 'Phones Copied!' : 'Voice Channels'}
                                        </span>
                                    </button>
                                    <span className="text-[8px] font-black text-emerald-400 opacity-60">{selectedLead.phones?.length || 0} TOTAL</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {selectedLead.phones?.map((phone, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)]/50 group/item hover:border-emerald-500/30 transition-all">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-2 h-2 rounded-full flex-shrink-0 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                <span className="text-xs font-bold text-[var(--text-primary)]">{phone}</span>
                                            </div>
                                            <button onClick={() => handleCopy(phone, `phone-${idx}`)} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-[var(--text-tertiary)] hover:text-emerald-500 transition-all">
                                                {copiedId === `phone-${idx}` ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-[var(--bg-tertiary)]/20 border-t border-white/5 flex items-center justify-between flex-shrink-0">
                            <span className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Profile Snapshot v1.0</span>
                            <button onClick={() => setIsContactModalOpen(false)} className="px-8 py-3 rounded-xl bg-[var(--accent-primary)] text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[var(--accent-primary)]/20">Acknowledge</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Observation Log (Notes) Modal */}
            {isCommentModalOpen && selectedLead && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 backdrop-blur-md bg-black/60 animate-fadeIn overflow-y-auto">
                    <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-[32px] w-full max-w-xl max-h-[80vh] overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.8)] animate-slideUp flex flex-col my-auto md:my-10">
                        {/* Modal Header with Lead Identity */}
                        <div className="p-5 border-b border-white/5 bg-gradient-to-r from-[var(--bg-tertiary)]/40 to-transparent flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] shadow-inner">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tight leading-none">Observation Log</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-1.5 py-0.5 rounded">Timeline</span>
                                        <span className="text-[9px] font-bold text-[var(--text-tertiary)] opacity-60">ID: {selectedLead.name}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCommentModalOpen(false)}
                                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center transition-all group"
                            >
                                <svg className="h-4 w-4 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col flex-1 min-h-0">
                            {/* Scrollable Timeline Section */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {(selectedLead?.comments || []).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full opacity-20 py-12">
                                        <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <p className="text-sm font-black uppercase tracking-widest text-center">No intelligence entries logged yet</p>
                                    </div>
                                ) : (
                                    <div className="relative pl-6 border-l border-white/5 space-y-8">
                                        {selectedLead.comments.map((c, i) => (
                                            <div key={i} className="relative group/log">
                                                {/* Timeline Node */}
                                                <div className="absolute -left-[30px] top-0 w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.5)] border-4 border-[var(--bg-secondary)]" />

                                                <div className="p-5 rounded-[24px] bg-white/5 border border-white/5 group-hover/log:border-[var(--accent-primary)]/20 transition-all duration-300">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="px-2 py-0.5 rounded bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[8px] font-black text-[var(--accent-primary)] uppercase tracking-widest">
                                                                {c.createdByRole || 'AGENT'}
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                                            <span className="text-[10px] font-bold text-white/40">REF #0{i + 1}</span>
                                                        </div>
                                                        <span className="text-[9px] font-black text-[var(--text-tertiary)] opacity-40 uppercase">
                                                            {new Date(c.createdDate || c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                                                        {c.text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Input Form Section */}
                            <div className="p-8 bg-[var(--bg-tertiary)]/30 border-t border-white/5">
                                <div className="relative group">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="ENTER NEW AUDIT ENTRY..."
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-5 h-28 focus:outline-none focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary)]/5 font-black text-[10px] transition-all shadow-inner resize-none uppercase tracking-widest placeholder:text-white/20"
                                    />
                                    <div className="absolute top-4 right-4 text-[var(--accent-primary)] opacity-20">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddComment}
                                    disabled={!commentText.trim()}
                                    className="w-full mt-4 h-14 bg-[var(--accent-primary)] text-white disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-[var(--accent-primary)]/20 active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
                                >
                                    <span>Commit Observation</span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Handover Modal Refined */}
            {isAssignModalOpen && selectedLead && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 backdrop-blur-md bg-black/40 animate-fadeIn overflow-y-auto">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl animate-slideUp flex flex-col my-auto md:my-10">
                        <div className="px-6 py-6 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-tertiary)]/20 flex-shrink-0">
                            <div>
                                <h3 className="text-lg font-black text-[var(--text-primary)]">Pipeline Handover</h3>
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-primary)] opacity-70">Transfer To Management</p>
                            </div>
                            <button onClick={() => setIsAssignModalOpen(false)} className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)]/40 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center transition-all text-[var(--text-tertiary)]"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest pl-1">Assign To Manager</label>
                                <div className="relative">
                                    <select
                                        value={selectedManagerId}
                                        onChange={(e) => setSelectedManagerId(e.target.value)}
                                        className="w-full appearance-none bg-[var(--bg-tertiary)]/70 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)] font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                                    >
                                        <option value="" className="bg-[#121212] text-white">CHOOSE DESTINATION...</option>
                                        {managers.map(m => (
                                            <option key={m._id} value={m._id} className="bg-[#121212] text-white">{m.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] pl-1">Node Type</label>
                                    <select
                                        value={responseType}
                                        onChange={(e) => setResponseType(e.target.value)}
                                        className="w-full appearance-none bg-[var(--bg-tertiary)]/70 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)] font-black text-[10px] transition-all cursor-pointer"
                                    >
                                        <option value="EMAIL" className="bg-[#121212] text-white">EMAIL</option>
                                        <option value="PHONE" className="bg-[#121212] text-white">PHONE</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] pl-1">Selection</label>
                                    <select
                                        value={responseValue}
                                        onChange={(e) => setResponseValue(e.target.value)}
                                        className="w-full appearance-none bg-[var(--bg-tertiary)]/70 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)] font-black text-[10px] transition-all cursor-pointer"
                                    >
                                        {responseType === 'EMAIL' ? (
                                            (selectedLead.emails || []).map((e, idx) => <option key={idx} value={e.value} className="bg-[#121212] text-white">{e.value}</option>)
                                        ) : (
                                            (selectedLead.phones || []).map((p, idx) => <option key={idx} value={p} className="bg-[#121212] text-white">{p}</option>)
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] pl-1">Transfer Context</label>
                                <textarea
                                    value={assignComment}
                                    onChange={(e) => setAssignComment(e.target.value)}
                                    placeholder="Brief handover notes..."
                                    className="w-full bg-[var(--bg-tertiary)]/70 border border-white/10 text-white rounded-xl px-4 py-3 h-20 focus:outline-none focus:border-[var(--accent-primary)] font-medium text-[10px] transition-all resize-none"
                                />
                            </div>

                            <button
                                onClick={handleAssignManager}
                                disabled={!selectedManagerId || !responseValue}
                                className="w-full py-3.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-[var(--accent-primary)]/30 active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                EXECUTE PIPELINE TRANSFER
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
                .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.4); border-radius: 10px; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                `
            }} />
        </div>
    );
}