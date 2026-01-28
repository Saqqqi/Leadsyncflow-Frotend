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
        <div className="space-y-8 animate-fadeIn max-w-[1600px] mx-auto px-6 py-6 font-sans">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[var(--border-primary)]/30 pb-10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Action Required</span>
                    </div>
                    <h1 className="text-5xl font-black text-[var(--text-primary)] tracking-tight">Opportunity Desk</h1>
                    <p className="text-[var(--text-tertiary)] font-bold text-sm max-w-md">
                        Critical decisions awaiting your approval. Review qualified leads and confirm their movement to the closure phase.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-80 group">
                        <input
                            type="text"
                            placeholder="Find opportunity by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl px-6 py-4 pl-14 text-sm font-bold focus:outline-none focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary)]/5 transition-all shadow-xl"
                        />
                        <svg className="absolute left-5 top-4.5 h-6 w-6 text-[var(--accent-primary)] opacity-40 group-focus-within:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className="hidden lg:flex flex-col text-right">
                        <span className="text-2xl font-black text-[var(--text-primary)]">{filteredLeads.length}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Pending Inbox</span>
                    </div>
                </div>
            </div>

            {filteredLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-fadeIn">
                    <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-[40px] flex items-center justify-center shadow-2xl border border-[var(--border-primary)]">
                            <svg className="w-16 h-16 text-[var(--text-tertiary)] opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-black text-[var(--text-primary)]">Inbox Cleared</h3>
                        <p className="text-[var(--text-tertiary)] font-bold uppercase tracking-[0.1em] text-[10px]">You're all caught up for now</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredLeads.map(lead => (
                        <div key={lead._id} className="group relative bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-5 hover:border-[var(--accent-primary)]/50 transition-all duration-300 shadow-lg flex flex-col h-full">
                            <div className="relative z-10 space-y-4 flex-1">
                                {/* Lead Header - More Compact */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[var(--accent-primary)]/10">
                                            {lead.name?.[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-black text-[var(--text-primary)] leading-tight truncate max-w-[120px]">{lead.name}</h3>
                                            <span className="text-[8px] font-black uppercase tracking-wider text-[var(--accent-primary)]/60">
                                                {lead.industry || 'Lead'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                                            Qualified
                                        </span>
                                    </div>
                                </div>

                                {/* Contact Section - Condensed */}
                                <div className="space-y-3">
                                    {/* Preferred Source */}
                                    {lead.responseSource?.type && lead.responseSource?.value && (
                                        <div className="rounded-xl bg-gradient-to-br from-indigo-500/5 to-blue-500/5 border border-[var(--accent-primary)]/10 p-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <span className="block text-[7px] font-extrabold uppercase tracking-widest text-[var(--accent-primary)] mb-0.5">Top Recommendation</span>
                                                    <div className="text-[11px] font-bold text-[var(--text-primary)] truncate">
                                                        {lead.responseSource.value}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(lead.responseSource.value)}
                                                    className="p-1.5 rounded-lg bg-white/5 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-all"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2z" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Alternative Contact Toggle */}
                                    <div className="space-y-2">
                                        <div className="flex bg-[var(--bg-tertiary)]/30 p-0.5 rounded-xl border border-white/5">
                                            {['EMAIL', 'PHONE'].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => {
                                                        setContactViewByLead(prev => ({ ...prev, [lead._id]: type }));
                                                        const firstVal = type === 'EMAIL' ? (lead.emails || [])[0]?.value : (lead.phones || [])[0];
                                                        if (firstVal) setSelectedContactByLead(prev => ({ ...prev, [lead._id]: { type, value: firstVal } }));
                                                    }}
                                                    className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${getContactView(lead) === type
                                                        ? 'bg-white text-[var(--accent-primary)] shadow-sm'
                                                        : 'text-[var(--text-tertiary)]'
                                                        }`}
                                                >
                                                    {type === 'EMAIL' ? 'Emails' : 'Phones'}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                            {((getContactView(lead) === 'EMAIL' ? lead.emails : lead.phones) || []).map((item, idx) => {
                                                const val = typeof item === 'object' ? item.value : item;
                                                const current = getSelectedContact(lead);
                                                const isSelected = String(current.value) === String(val);

                                                return (
                                                    <div key={idx} className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/20' : 'bg-black/10 border-white/5 text-[10px] font-bold text-[var(--text-tertiary)]'
                                                        }`} onClick={() => setSelectedContactByLead(prev => ({ ...prev, [lead._id]: { type: getContactView(lead), value: val } }))}>
                                                        <span className={`text-[10px] font-bold truncate ${isSelected ? 'text-[var(--text-primary)]' : ''}`}>
                                                            {val}
                                                        </span>
                                                        <button onClick={(e) => { e.stopPropagation(); handleCopy(val); }} className={`p-1 rounded-md transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                                            <svg className="w-3 h-3 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2z" /></svg>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button - Compact Footer */}
                            <div className="mt-4 pt-3 border-t border-white/5">
                                <button
                                    onClick={() => { setSelectedLead(lead); setIsDecisionModalOpen(true); }}
                                    className="w-full h-11 bg-[var(--text-primary)] hover:bg-[var(--accent-primary)] text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 group/btn"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">Submit Decision</span>
                                    <svg className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Premium Decision Modal */}
            {isDecisionModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl animate-fadeIn">
                    <div className="relative w-full max-w-[600px] animate-slideUp">
                        <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-[64px] overflow-hidden shadow-[0_64px_256px_rgba(0,0,0,0.8)]">
                            {/* Modal Header */}
                            <div className="p-12 pb-8 flex justify-between items-start">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]">Final Determination</span>
                                    <h3 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Evaluate Lead</h3>
                                    <p className="text-[var(--text-tertiary)] font-bold text-sm">Decide the future of <span className="text-[var(--text-primary)]">{selectedLead?.name}</span></p>
                                </div>
                                <button onClick={() => setIsDecisionModalOpen(false)} className="p-4 rounded-full bg-white/5 hover:bg-rose-500/10 text-[var(--text-tertiary)] hover:text-rose-500 transition-all shadow-inner">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="px-12 pb-12 space-y-8">
                                {/* Large Toggle */}
                                <div className="grid grid-cols-2 gap-4 bg-black/20 p-2 rounded-[32px] border border-white/5">
                                    <button
                                        onClick={() => setDecisionData(prev => ({ ...prev, decision: 'ACCEPT' }))}
                                        className={`group relative h-20 rounded-[28px] flex items-center justify-center gap-3 transition-all duration-500 ${decisionData.decision === 'ACCEPT'
                                            ? 'bg-emerald-500 text-white shadow-[0_20px_40px_rgba(16,185,129,0.3)]'
                                            : 'text-[var(--text-tertiary)] hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${decisionData.decision === 'ACCEPT' ? 'bg-white/20' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">Approve</span>
                                    </button>
                                    <button
                                        onClick={() => setDecisionData(prev => ({ ...prev, decision: 'REJECT' }))}
                                        className={`group relative h-20 rounded-[28px] flex items-center justify-center gap-3 transition-all duration-500 ${decisionData.decision === 'REJECT'
                                            ? 'bg-rose-500 text-white shadow-[0_20px_40px_rgba(244,63,94,0.3)]'
                                            : 'text-[var(--text-tertiary)] hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${decisionData.decision === 'REJECT' ? 'bg-white/20' : 'bg-rose-500/20 text-rose-500'}`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">Decline</span>
                                    </button>
                                </div>

                                {/* Feedback Area */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Professional Feedback</label>
                                        <span className="text-[9px] font-bold text-[var(--accent-primary)]">Required</span>
                                    </div>
                                    <textarea
                                        value={decisionData.comment}
                                        onChange={(e) => setDecisionData(prev => ({ ...prev, comment: e.target.value }))}
                                        placeholder="Outline reasons for this decision..."
                                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-[32px] p-6 h-40 focus:outline-none focus:ring-4 focus:ring-[var(--accent-primary)]/10 focus:border-[var(--accent-primary)] text-sm font-medium transition-all shadow-inner resize-none"
                                    />
                                </div>

                                {/* Confirm Button */}
                                <button
                                    onClick={handleDecision}
                                    disabled={!decisionData.decision || !decisionData.comment}
                                    className="relative w-full h-20 group disabled:opacity-30 transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-[var(--accent-primary)] rounded-[28px] blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                                    <div className="relative h-full w-full bg-gradient-to-r from-indigo-600 to-[var(--accent-primary)] rounded-[28px] flex items-center justify-center gap-4 text-white hover:scale-[1.01] active:scale-[0.98] transition-all shadow-2xl">
                                        <span className="text-xs font-black uppercase tracking-[0.4em]">Submit Decision</span>
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
