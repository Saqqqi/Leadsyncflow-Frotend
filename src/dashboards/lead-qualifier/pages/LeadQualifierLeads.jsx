import React, { useState } from 'react';
import LeadCard from '../components/LeadCard';
import LeadFilters from '../components/LeadFilters';
import LeadTimelineModal from '../components/LeadTimelineModal';
import { useLeadManager } from '../hooks/useLeadManager';
import { useLeadFilters } from '../hooks/useLeadFilters';

export default function LeadQualifierLeads() {
    // Custom hooks for data and UI logic
    const {
        leads,
        managers,
        loading,
        error,
        updateLeadStatus,
        addLeadComment,
        assignLeadManager,
        refreshLeads,
    } = useLeadManager();

    const {
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        dateFilter,
        setDateFilter,
        counts,
        filteredLeads,
    } = useLeadFilters(leads);

    // UI state for modals and selections
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

    // Handlers delegating to hook functions
    const handleUpdateStatus = async (leadId, newStatus) => {
        const success = await updateLeadStatus(leadId, newStatus);
        if (!success) alert('Failed to update status.');
    };

    const handleAddComment = async () => {
        if (!commentText.trim() || !selectedLead) return;
        const success = await addLeadComment(selectedLead._id, commentText);
        if (success) {
            setCommentText('');
            setIsCommentModalOpen(false);
        } else {
            alert('Failed to add comment');
        }
    };

    const handleAssignManager = async () => {
        if (!selectedManagerId || !selectedLead || !responseType || !responseValue) return;
        const success = await assignLeadManager(
            selectedLead._id,
            selectedManagerId,
            assignComment,
            responseType,
            responseValue
        );
        if (success) {
            setIsAssignModalOpen(false);
            setSelectedManagerId('');
            setAssignComment('');
            setSelectedLead(null);
            setResponseType('EMAIL');
            setResponseValue('');
        } else {
            alert('Assignment failed.');
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
            <LeadFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                counts={counts}
            />

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
                            <LeadCard
                                key={lead._id}
                                lead={lead}
                                isExpanded={isExpanded}
                                onToggleExpand={() => setExpandedLeadId(isExpanded ? null : lead._id)}
                                onUpdateStatus={handleUpdateStatus}
                                onOpenComments={l => { setSelectedLead(l); setIsCommentModalOpen(true); }}
                                onOpenAssign={l => { setSelectedLead(l); setIsAssignModalOpen(true); }}
                                activeTab={activeTab}
                            />
                        );
                    })}
                </div>
            )}

            {/* Assign Manager Modal */}
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
                                <svg className="h-6 w-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Target Manager</label>
                                <div className="relative group">
                                    <select
                                        value={selectedManagerId}
                                        onChange={e => setSelectedManagerId(e.target.value)}
                                        className="w-full appearance-none bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-6 py-4.5 focus:outline-none focus:border-[var(--accent-primary)] font-black text-sm transition-all shadow-inner group-hover:border-[var(--accent-primary)]/40"
                                    >
                                        <option value="">Select a manager...</option>
                                        {managers.map(m => (
                                            <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                        <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Platform</label>
                                <div className="relative group">
                                    <select
                                        value={responseType}
                                        onChange={e => {
                                            const next = e.target.value;
                                            setResponseType(next);
                                            if (next === 'EMAIL') {
                                                setResponseValue(selectedLead?.emails?.[0]?.value || '');
                                            } else {
                                                setResponseValue(selectedLead?.phones?.[0] || '');
                                            }
                                        }}
                                        className="w-full appearance-none bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-6 py-4.5 focus:outline-none focus:border-[var(--accent-primary)] font-black text-sm transition-all shadow-inner group-hover:border-[var(--accent-primary)]/40"
                                    >
                                        <option value="EMAIL">Email</option>
                                        <option value="PHONE">GB</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                        <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Select {responseType === 'EMAIL' ? 'Email' : 'GB Number'}</label>
                                <div className="relative group">
                                    <select
                                        value={responseValue}
                                        onChange={e => setResponseValue(e.target.value)}
                                        disabled={!selectedLead || (responseType === 'EMAIL' ? !(selectedLead.emails?.length) : !(selectedLead.phones?.length))}
                                        className="w-full appearance-none bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-6 py-4.5 focus:outline-none focus:border-[var(--accent-primary)] font-black text-sm transition-all shadow-inner group-hover:border-[var(--accent-primary)]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {responseType === 'EMAIL'
                                            ? (selectedLead?.emails?.length > 0
                                                ? selectedLead.emails.map((em, i) => (
                                                    <option key={i} value={String(em.value)}>{String(em.value)}</option>
                                                ))
                                                : <option value="">No emails available</option>)
                                            : (selectedLead?.phones?.length > 0
                                                ? selectedLead.phones.map((ph, i) => (
                                                    <option key={i} value={String(ph)}>{String(ph)}</option>
                                                ))
                                                : <option value="">No numbers available</option>)
                                        }
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                        <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Handover Instructions</label>
                                <textarea
                                    value={assignComment}
                                    onChange={e => setAssignComment(e.target.value)}
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

            {/* Comment Modal */}
            {isCommentModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60 animate-fadeIn">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] w-full max-w-lg overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.6)]">
                        <div className="p-8 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-tertiary)]/30">
                            <div>
                                <h3 className="text-2xl font-black text-[var(--text-primary)]">Lead Timeline</h3>
                                <p className="text-[var(--text-tertiary)] text-[10px] uppercase font-black tracking-widest mt-1 opacity-60">Audit log and status notes</p>
                            </div>
                            <button onClick={() => setIsCommentModalOpen(false)} className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--accent-error)] hover:text-white flex items-center justify-center transition-all group">
                                <svg className="h-6 w-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
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
                                    onChange={e => setCommentText(e.target.value)}
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