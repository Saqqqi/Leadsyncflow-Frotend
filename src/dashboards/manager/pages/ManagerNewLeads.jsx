import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../../api/manager.api';

export default function ManagerNewLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [decisionData, setDecisionData] = useState({ decision: '', comment: '' });
    const [selectedContactByLead, setSelectedContactByLead] = useState({});
    const [contactViewByLead, setContactViewByLead] = useState({});

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await managerAPI.getMyLeads();
            if (response.success) {
                // Filter for pending decisions only
                const pendingLeads = (response.leads || []).filter(l => l.stage === 'MANAGER');
                setLeads(pendingLeads);
            }
        } catch (err) {
            console.error("Failed to fetch manager leads", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async () => {
        if (!selectedLead || !decisionData.decision || !decisionData.comment) return;
        try {
            const response = await managerAPI.submitDecision(selectedLead._id, decisionData.decision, decisionData.comment);
            if (response.success) {
                setLeads(prev => prev.filter(l => l._id !== selectedLead._id));
                setIsDecisionModalOpen(false);
                setDecisionData({ decision: '', comment: '' });
                setSelectedLead(null);
            }
        } catch (err) {
            alert("Failed to submit decision");
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
        // Optional: Add a toast notification here if available
    };

    const getSelectedContact = (lead) => {
        const picked = selectedContactByLead[lead._id];
        if (picked && picked.type && picked.value) return picked;

        if (lead.responseSource && lead.responseSource.type && lead.responseSource.value) {
            return { type: lead.responseSource.type, value: lead.responseSource.value };
        }

        const firstEmail = (lead.emails || [])[0]?.value;
        if (firstEmail) return { type: 'EMAIL', value: firstEmail };

        const firstPhone = (lead.phones || [])[0];
        if (firstPhone) return { type: 'PHONE', value: firstPhone };

        return { type: '', value: '' };
    };

    const getContactView = (lead) => {
        const picked = contactViewByLead[lead._id];
        if (picked) return picked;
        if (lead.responseSource?.type) return lead.responseSource.type;
        if ((lead.emails || []).length > 0) return 'EMAIL';
        if ((lead.phones || []).length > 0) return 'PHONE';
        return 'EMAIL';
    };

    const filteredLeads = leads.filter(l =>
        (l.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn max-w-[1600px] mx-auto px-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-primary)]">Lead Decisions</h1>
                    <p className="text-[var(--text-tertiary)] text-sm font-medium">Review and approve leads for closing</p>
                </div>
                <div className="relative w-72">
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl px-5 py-3 pl-12 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                    <svg className="absolute left-4 top-3.5 h-5 w-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLeads.map(lead => (
                    <div key={lead._id} className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-6 hover:border-[var(--accent-primary)]/40 transition-all shadow-xl space-y-5">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-indigo-600 flex items-center justify-center text-white font-black text-xl">
                                    {lead.name?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-[var(--text-primary)] truncate">{lead.name}</h3>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-tertiary)] bg-[var(--bg-tertiary)]/50 px-2 py-1 rounded-lg">
                                        {lead.industry || 'Lead'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="block text-xs font-black text-[var(--text-primary)]">{lead.lqStatus === 'QUALIFIED' ? 'Qualified' : 'Pending'}</span>
                                <span className="text-[10px] text-[var(--text-tertiary)]">From: {lead.createdBy?.name || 'LQ'}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <p className="px-1 text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Contact Channels</p>

                                {lead.responseSource?.type && lead.responseSource?.value && (
                                    <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[var(--accent-primary)]/15 to-indigo-500/10 border border-[var(--accent-primary)]/25">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                                                    Lead Qualifier Selected
                                                </div>
                                                <div className="mt-1 text-[12px] font-black text-[var(--text-primary)] truncate">
                                                    {lead.responseSource.type === 'EMAIL' ? 'Email' : 'GB'}: {lead.responseSource.value}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(lead.responseSource.value)}
                                                className="p-2 rounded-xl bg-[var(--bg-tertiary)]/40 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-all"
                                                title="Copy"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-6-3h1" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between gap-3">
                                    <div className="inline-flex items-center rounded-2xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] overflow-hidden">
                                        <button
                                            onClick={() => {
                                                setContactViewByLead(prev => ({ ...prev, [lead._id]: 'EMAIL' }));
                                                const firstEmail = (lead.emails || [])[0]?.value;
                                                if (firstEmail) {
                                                    setSelectedContactByLead(prev => ({ ...prev, [lead._id]: { type: 'EMAIL', value: firstEmail } }));
                                                }
                                            }}
                                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${getContactView(lead) === 'EMAIL'
                                                ? 'bg-[var(--accent-primary)] text-white'
                                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                                                }`}
                                        >
                                            Email
                                        </button>
                                        <button
                                            onClick={() => {
                                                setContactViewByLead(prev => ({ ...prev, [lead._id]: 'PHONE' }));
                                                const firstPhone = (lead.phones || [])[0];
                                                if (firstPhone) {
                                                    setSelectedContactByLead(prev => ({ ...prev, [lead._id]: { type: 'PHONE', value: firstPhone } }));
                                                }
                                            }}
                                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${getContactView(lead) === 'PHONE'
                                                ? 'bg-[var(--accent-primary)] text-white'
                                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                                                }`}
                                        >
                                            GB
                                        </button>
                                    </div>

                                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                                        Selected: {(() => {
                                            const current = getSelectedContact(lead);
                                            if (!current.type || !current.value) return 'None';
                                            return current.type === 'EMAIL' ? 'Email' : 'GB';
                                        })()}
                                    </div>
                                </div>

                                <div className="max-h-44 overflow-y-auto pr-1">
                                    <div className="flex flex-wrap gap-2">
                                        {getContactView(lead) === 'EMAIL' ? (
                                            (lead.emails || []).map((e, idx) => {
                                                const current = getSelectedContact(lead);
                                                const isSelected = current.type === 'EMAIL' && String(current.value || '') === String(e.value || '');
                                                return (
                                                    <button
                                                        type="button"
                                                        key={`e-${idx}`}
                                                        onClick={() => setSelectedContactByLead(prev => ({
                                                            ...prev,
                                                            [lead._id]: { type: 'EMAIL', value: e.value }
                                                        }))}
                                                        className={`group/contact px-3 py-2 rounded-xl border text-[11px] font-bold transition-all max-w-full ${isSelected
                                                            ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)]/45 text-[var(--text-primary)]'
                                                            : 'bg-black/20 border-white/5 text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/30'
                                                            }`}
                                                        title={e.value}
                                                    >
                                                        <span className="truncate block max-w-[220px]">{e.value}</span>
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            (lead.phones || []).map((p, idx) => {
                                                const current = getSelectedContact(lead);
                                                const isSelected = current.type === 'PHONE' && String(current.value || '') === String(p || '');
                                                return (
                                                    <button
                                                        type="button"
                                                        key={`p-${idx}`}
                                                        onClick={() => setSelectedContactByLead(prev => ({
                                                            ...prev,
                                                            [lead._id]: { type: 'PHONE', value: p }
                                                        }))}
                                                        className={`group/contact px-3 py-2 rounded-xl border text-[11px] font-bold transition-all max-w-full ${isSelected
                                                            ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)]/45 text-[var(--text-primary)]'
                                                            : 'bg-black/20 border-white/5 text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/30'
                                                            }`}
                                                        title={p}
                                                    >
                                                        <span className="truncate block max-w-[220px]">{p}</span>
                                                    </button>
                                                );
                                            })
                                        )}

                                        {getContactView(lead) === 'EMAIL' && (lead.emails || []).length === 0 && (
                                            <div className="p-3 rounded-xl bg-black/10 border border-white/5 text-[11px] font-bold text-[var(--text-tertiary)]">
                                                No emails available
                                            </div>
                                        )}
                                        {getContactView(lead) === 'PHONE' && (lead.phones || []).length === 0 && (
                                            <div className="p-3 rounded-xl bg-black/10 border border-white/5 text-[11px] font-bold text-[var(--text-tertiary)]">
                                                No numbers available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => { setSelectedLead(lead); setIsDecisionModalOpen(true); }}
                                className="w-full px-4 py-3 rounded-2xl bg-[var(--accent-primary)] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--accent-primary)]/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
                            >
                                Take Decision
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isDecisionModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] w-full max-w-lg p-8 shadow-[0_32px_128px_rgba(0,0,0,0.6)] space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-[var(--text-primary)]">Lead Approval</h3>
                            <button onClick={() => setIsDecisionModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-rose-500 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setDecisionData(prev => ({ ...prev, decision: 'ACCEPT' }))}
                                className={`h-14 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all ${decisionData.decision === 'ACCEPT'
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] opacity-60'
                                    }`}
                            >
                                Approve (Accept)
                            </button>
                            <button
                                onClick={() => setDecisionData(prev => ({ ...prev, decision: 'REJECT' }))}
                                className={`h-14 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all ${decisionData.decision === 'REJECT'
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] opacity-60'
                                    }`}
                            >
                                Reject (Decline)
                            </button>
                        </div>

                        <textarea
                            value={decisionData.comment}
                            onChange={(e) => setDecisionData(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Provide feedback for the LQ team..."
                            className="w-full bg-black/20 border border-[var(--border-primary)] rounded-3xl p-5 h-32 focus:outline-none focus:border-[var(--accent-primary)] text-sm font-medium resize-none shadow-inner"
                        />

                        <button
                            onClick={handleDecision}
                            disabled={!decisionData.decision || !decisionData.comment}
                            className="w-full h-16 bg-gradient-to-r from-[var(--accent-primary)] to-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all"
                        >
                            Confirm Decision
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
