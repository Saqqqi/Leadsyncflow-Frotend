import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../../api/manager.api';

export default function ManagerHistory() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, ACCEPTED, REJECTED
    const [payFilter, setPayFilter] = useState('ALL'); // ALL, PAID, UNPAID

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await managerAPI.getMyLeads();
            console.log('responsewwwwwwwwwwwwwwwwwwwwwwwwwwwww', response);
            if (response.success) {
                // Filter for historical leads only
                const historyLeads = (response.leads || []).filter(l =>
                    l.stage === 'MANAGER_APPROVED' || l.stage === 'REJECTED'
                );
                setLeads(historyLeads);
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
            (filterStatus === 'ACCEPTED' && l.stage === 'MANAGER_APPROVED') ||
            (filterStatus === 'REJECTED' && l.stage === 'REJECTED');
        const matchesPayment = payFilter === 'ALL' || l.status === payFilter;
        return matchesSearch && matchesDecision && matchesPayment;
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn max-w-[1600px] mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-primary)]">Lead History</h1>
                    <p className="text-[var(--text-tertiary)] text-sm font-medium">Review your previous decisions and closed leads</p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-1 shadow-sm">
                            {['ALL', 'ACCEPTED', 'REJECTED'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status
                                        ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20'
                                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    {status === 'ALL' ? 'All Decisions' : status}
                                </button>
                            ))}
                        </div>

                        <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-1 shadow-sm">
                            {['ALL', 'PAID', 'UNPAID'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setPayFilter(status)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${payFilter === status
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    {status === 'ALL' ? 'All Payments' : status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search lead name or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl px-5 py-3 pl-12 text-sm focus:outline-none focus:border-[var(--accent-primary)] shadow-sm transition-all"
                        />
                        <svg className="absolute left-4 top-3.5 h-5 w-5 text-[var(--accent-primary)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {filteredLeads.length === 0 ? (
                <div className="bg-[var(--bg-secondary)] border border-dashed border-[var(--border-primary)] rounded-[40px] p-20 text-center">
                    <div className="w-20 h-20 bg-[var(--bg-tertiary)] rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">No History Found</h3>
                    <p className="text-[var(--text-tertiary)] max-w-xs mx-auto">You haven't made any decisions yet. Approved or rejected leads will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredLeads.map(lead => (
                        <div key={lead._id} className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-6 hover:border-[var(--accent-primary)]/40 transition-all shadow-xl space-y-5 relative overflow-hidden group">
                            {/* Status Ribbon */}
                            <div className={`absolute top-0 right-0 px-6 py-1 rounded-bl-2xl text-[8px] font-black uppercase tracking-[0.2em] text-white ${lead.stage === 'MANAGER_APPROVED' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}>
                                {lead.stage === 'MANAGER_APPROVED' ? 'Accepted' : 'Rejected'}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ${lead.stage === 'MANAGER_APPROVED' ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/20' : 'bg-gradient-to-br from-rose-500 to-orange-500 shadow-rose-500/20'
                                    }`}>
                                    {lead.name?.[0]}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-black text-[var(--text-primary)] text-lg truncate">{lead.name}</h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                        <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2.5 py-1 rounded-lg border border-[var(--border-primary)]">
                                            {lead.industry || 'Lead'}
                                        </span>
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${lead.status === 'PAID'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${lead.status === 'PAID' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                                            {lead.status}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Contact Channels</p>

                                {/* Emails */}
                                {(lead.emails || []).slice(0, 2).map((e, idx) => (
                                    <div key={`e-${idx}`} className="group/item flex items-center justify-between gap-3 p-3 rounded-2xl bg-black/20 border border-white/5 group-hover:border-[var(--accent-primary)]/20 transition-all">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`w-2 h-2 rounded-full shrink-0 ${e.status === 'ACTIVE' ? 'bg-emerald-500' :
                                                e.status === 'BOUNCED' ? 'bg-rose-500' : 'bg-amber-500'
                                                }`} />
                                            <span className="text-xs font-bold text-[var(--text-secondary)] truncate">{e.value}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg ${e.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-500' :
                                                e.status === 'BOUNCED' ? 'bg-rose-500/20 text-rose-500' :
                                                    'bg-amber-500/20 text-amber-500'
                                                }`}>
                                                {e.status}
                                            </span>
                                            <button
                                                onClick={() => handleCopy(e.value)}
                                                className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-all"
                                                title="Copy Email"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-6-3h1" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Phone Numbers */}
                                {(lead.phones || []).slice(0, 2).map((p, idx) => (
                                    <div key={`p-${idx}`} className="group/item flex items-center justify-between gap-3 p-3 rounded-2xl bg-black/20 border border-white/5 group-hover:border-[var(--accent-primary)]/20 transition-all">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                            <span className="text-xs font-bold text-[var(--text-secondary)] truncate">{p}</span>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(p)}
                                            className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-all"
                                            title="Copy Number"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-6-3h1" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {lead.stage === 'MANAGER_APPROVED' && lead.status !== 'PAID' && (
                                <button
                                    onClick={() => handleMarkPaid(lead._id)}
                                    className="w-full py-3 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
                                >
                                    Mark as Paid
                                </button>
                            )}

                            {lead.comments && lead.comments.length > 0 && (
                                <div className="mt-4 p-4 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)]/50">
                                    <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                        Manager Feedback
                                    </p>
                                    <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
                                        "{lead.comments[lead.comments.length - 1].text}"
                                    </p>
                                    <div className="mt-2 flex justify-between items-center text-[9px] font-bold text-[var(--text-tertiary)] uppercase opacity-60">
                                        <span>{lead.comments[lead.comments.length - 1].createdDate}</span>
                                        <span>{lead.comments[lead.comments.length - 1].createdTime}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
