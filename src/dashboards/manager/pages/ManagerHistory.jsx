import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../../api/manager.api';

export default function ManagerHistory() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, ACCEPTED, REJECTED
    const [payFilter, setPayFilter] = useState('ALL'); // ALL, PAID, UNPAID
    const [expandedRows, setExpandedRows] = useState(new Set());

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            // Requesting with multiple potential flags to ensure history is included
            const response = await managerAPI.getMyLeads({
                status: 'all',
                history: true,
                all: true,
                limit: 1000
            });

            console.log('Full Manager Response:', response);

            if (response.success) {
                // Trust the backend response which now includes filtered stages
                setLeads(response.leads || []);
            }
        } catch (err) {
            console.error("Failed to fetch manager history", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkPaid = async (leadId) => {
        try {
            const response = await managerAPI.markAsPaid(leadId);
            if (response.success) {
                fetchLeads(); // Refresh list
            }
        } catch (err) {
            alert("Failed to update payment status");
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    const filteredLeads = leads.filter(l => {
        const matchesSearch = (l.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDecision = filterStatus === 'ALL' ||
            (filterStatus === 'ACCEPTED' && (l.stage === 'COMPLETED' || l.stage === 'DONE' || l.stage === 'MANAGER_APPROVED')) ||
            (filterStatus === 'REJECTED' && l.stage === 'REJECTED') ||
            (filterStatus === 'PENDING' && l.stage === 'MANAGER');
        const matchesPayment = payFilter === 'ALL' || l.status === payFilter;
        return matchesSearch && matchesDecision && matchesPayment;
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn max-w-[1600px] mx-auto px-6 py-4">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Lead History</h1>
                    <p className="text-[var(--text-tertiary)] text-xs font-bold uppercase tracking-widest opacity-60 mt-1">
                        Comprehensive record of assigned opportunities
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Status Filter */}
                    <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-1 shadow-sm shrink-0">
                        {['ALL', 'ACCEPTED', 'REJECTED', 'PENDING'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === status
                                    ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20'
                                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Search opportunities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl px-5 py-2.5 pl-10 text-xs font-bold focus:outline-none focus:border-[var(--accent-primary)] shadow-sm transition-all"
                        />
                        <svg className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--accent-primary)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-[var(--bg-tertiary)]/40 border-b border-[var(--border-primary)]/50">
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Opportunity</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Decision</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Industry</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest text-center">Payment</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Assigned Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-primary)]/30">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center text-[var(--text-tertiary)]">
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-black text-[var(--text-primary)]">No leads found</h3>
                                                <p className="text-xs text-[var(--text-tertiary)] font-medium">Try adjusting your search or filters</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map(lead => {
                                    const isAccepted = lead.stage === 'COMPLETED' || lead.stage === 'DONE' || lead.stage === 'MANAGER_APPROVED';
                                    const isRejected = lead.stage === 'REJECTED';
                                    const isPending = lead.stage === 'MANAGER';

                                    return (
                                        <React.Fragment key={lead._id}>
                                            <tr className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                                onClick={() => setExpandedRows(prev => {
                                                    const next = new Set(prev);
                                                    if (next.has(lead._id)) next.delete(lead._id);
                                                    else next.add(lead._id);
                                                    return next;
                                                })}>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-lg shrink-0 ${isAccepted ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/10' :
                                                            isRejected ? 'bg-gradient-to-br from-rose-500 to-orange-500 shadow-rose-500/10' :
                                                                'bg-gradient-to-br from-amber-500 to-orange-400 shadow-amber-500/20'
                                                            }`}>
                                                            {lead.name?.[0]}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-sm font-black text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                                                                {lead.name}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-[var(--text-tertiary)] truncate opacity-60 leading-none mt-1">
                                                                {lead.emails?.[0]?.value || 'No email associated'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-current flex items-center justify-center w-fit ${isAccepted ? 'bg-emerald-500/10 text-emerald-500' :
                                                        isRejected ? 'bg-rose-500/10 text-rose-500' :
                                                            'bg-amber-500/10 text-amber-500'
                                                        }`}>
                                                        {isAccepted ? 'Accepted' : isRejected ? 'Rejected' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest truncate max-w-[120px] block">
                                                        {lead.industry || 'Lead'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${lead.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${lead.status === 'PAID' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                                                        {lead.status}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-[var(--text-primary)]">
                                                            {new Date(lead.assignedAt || lead.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-[var(--text-tertiary)] opacity-60 uppercase">
                                                            {new Date(lead.assignedAt || lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {isAccepted && lead.status !== 'PAID' && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleMarkPaid(lead._id); }}
                                                                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10 hover:scale-105 active:scale-95 transition-all"
                                                            >
                                                                Mark Paid
                                                            </button>
                                                        )}
                                                        <div className={`p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] transition-transform duration-300 ${expandedRows.has(lead._id) ? 'rotate-180' : ''}`}>
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expandable Details Row */}
                                            {expandedRows.has(lead._id) && (
                                                <tr className="bg-white/[0.01]">
                                                    <td colSpan="6" className="px-8 py-6 border-l-2 border-[var(--accent-primary)] animate-slideDown">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-[0.2em]">Contact Details</h4>
                                                                <div className="space-y-2">
                                                                    {lead.emails?.map((e, idx) => (
                                                                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)]/50">
                                                                            <span className="text-xs font-bold text-[var(--text-secondary)]">{e.value}</span>
                                                                            <button onClick={() => handleCopy(e.value)} className="text-[var(--accent-primary)] hover:scale-110 active:scale-95 transition-transform">
                                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2z" /></svg>
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    {lead.phones?.map((p, idx) => (
                                                                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)]/50">
                                                                            <span className="text-xs font-bold text-[var(--text-secondary)]">{p}</span>
                                                                            <button onClick={() => handleCopy(p)} className="text-[var(--accent-primary)] hover:scale-110 active:scale-95 transition-transform">
                                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2z" /></svg>
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="md:col-span-2 space-y-4">
                                                                <h4 className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-[0.2em]">Feedback & History</h4>
                                                                <div className="bg-[var(--bg-tertiary)]/30 rounded-2xl p-5 border border-[var(--border-primary)] shadow-inner">
                                                                    {lead.comments && lead.comments.length > 0 ? (
                                                                        <div className="space-y-4">
                                                                            {lead.comments.map((comment, idx) => (
                                                                                <div key={idx} className="flex gap-4">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] mt-1.5 shrink-0" />
                                                                                    <div className="space-y-1">
                                                                                        <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed font-medium">"{comment.text}"</p>
                                                                                        <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-tertiary)] uppercase opacity-60">
                                                                                            <span>By {comment.createdByRole || 'Manager'}</span>
                                                                                            <span>•</span>
                                                                                            <span>{comment.createdDate} at {comment.createdTime}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-xs text-[var(--text-tertiary)] font-bold italic py-2 text-center">No feedback recorded for this lead</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
