import React, { useState, memo } from 'react';

const getStatusStyle = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    switch (s) {
        case 'QUALIFIED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'IN_CONVERSATION': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
        case 'DEAD': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
        default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
};

const LeadCard = memo(({
    lead,
    isExpanded,
    onToggleExpand,
    onUpdateStatus,
    onOpenComments,
    onOpenAssign,
    activeTab
}) => {
    const [copiedEmailIndex, setCopiedEmailIndex] = useState(null);
    const [copiedPhoneIndex, setCopiedPhoneIndex] = useState(null);

    const copyToClipboard = (text, index, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'email') {
            setCopiedEmailIndex(index);
            setTimeout(() => setCopiedEmailIndex(null), 2000);
        } else {
            setCopiedPhoneIndex(index);
            setTimeout(() => setCopiedPhoneIndex(null), 2000);
        }
    };

    return (
        <div
            onClick={onToggleExpand}
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
                        {/* Manager Display - Show who this lead is assigned to */}
                        {(lead.assignedTo?.name || lead.managerName) && (
                            <div className="mt-1.5 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-primary)]">
                                    Assigned: {lead.assignedTo?.name || lead.managerName}
                                </span>
                            </div>
                        )}
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
                                            copyToClipboard(email.value, idx, 'email');
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
                                            copyToClipboard(phone, idx, 'phone');
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
                        <div className={`grid ${lead.lqStatus !== 'QUALIFIED' && (activeTab === 'QUALIFIED' && lead.lqStatus === 'QUALIFIED') ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                            {lead.lqStatus !== 'QUALIFIED' && (
                                <button
                                    onClick={() => onOpenComments(lead)}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)]/50 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                    Notes ({lead.comments?.length || 0})
                                </button>
                            )}
                            {(activeTab === 'QUALIFIED' && lead.lqStatus === 'QUALIFIED') && (
                                <button
                                    onClick={() => onOpenAssign(lead)}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--accent-primary)]/20 hover:-translate-y-0.5 transition-all"
                                >
                                    Push <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </button>
                            )}
                        </div>

                        {/* Status Picker - hide if lead is QUALIFIED */}
                        {lead.lqStatus !== 'QUALIFIED' ? (
                            <div className="pt-2">
                                <div className="relative group/select">
                                    <select
                                        value={lead.lqStatus || 'PENDING'}
                                        onChange={(e) => onUpdateStatus(lead._id, e.target.value)}
                                        className="w-full appearance-none bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/40 px-4 py-2.5 rounded-xl text-[11px] font-black text-[var(--accent-primary)] uppercase tracking-widest focus:outline-none cursor-pointer shadow-sm hover:bg-[var(--accent-primary)]/30 transition-all text-center"
                                    >
                                        <option value="PENDING" className="bg-[#1a1a1a]">PENDING</option>
                                        <option value="IN_CONVERSATION" className="bg-[#1a1a1a]">IN-CONV</option>
                                        <option value="QUALIFIED" className="bg-[#1a1a1a]">QUALIFIED</option>
                                        <option value="DEAD" className="bg-[#1a1a1a]">DEAD</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Directly show notes for QUALIFIED leads */
                            (lead.comments || []).length > 0 && (
                                <div className="pt-4 space-y-3 border-t border-[var(--border-primary)]/30">
                                    <label className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest px-1">Engagement Timeline</label>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                        {lead.comments.map((c, i) => (
                                            <div key={i} className="p-3 rounded-2xl bg-[var(--bg-tertiary)]/20 border border-[var(--border-primary)]/50">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-[var(--accent-primary)]">{c.createdByRole || 'Admin'}</span>
                                                    <span className="text-[8px] font-black text-[var(--text-tertiary)] opacity-60">{c.createdDate || (c.createdAt && new Date(c.createdAt).toLocaleDateString())}</span>
                                                </div>
                                                <p className="text-[10px] text-[var(--text-secondary)] leading-normal font-medium">{c.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});

export default LeadCard;
