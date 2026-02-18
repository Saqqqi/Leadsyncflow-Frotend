import React, { memo } from 'react';
import LeadIdentity from './LeadIdentity';
import { getStatusStyle, getStatusLabel } from '../utils/statusStyles';

const LeadTableRow = memo(({
    lead,
    onViewInfo,
    handleUpdateStatus,
    onOpenComments,
    onOpenAssign,
    handleCopy,
    copiedId
}) => {
    return (
        <tr className="hover:bg-[var(--bg-tertiary)]/30 transition-colors group cursor-default">
            <td className="px-6 py-4">
                <LeadIdentity lead={lead} size="md" />
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
                        onClick={() => onViewInfo(lead)}
                        className="px-3 py-1 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[var(--accent-primary)] hover:text-white transition-all shadow-sm border border-[var(--accent-primary)]/20"
                    >
                        Info
                    </button>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="relative w-40 group/status">
                    <select
                        value={lead.lqStatus || 'PENDING'}
                        onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                        className={`w-full appearance-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border outline-none cursor-pointer transition-all duration-300 hover:brightness-110 active:scale-[0.98] shadow-sm ${getStatusStyle(lead.lqStatus)}`}
                    >
                        <option value="PENDING" className="bg-[#121212] text-slate-400">● PENDING</option>
                        <option value="REACHED" className="bg-[#121212] text-blue-400">● REACHED</option>
                        <option value="QUALIFIED" className="bg-[#121212] text-emerald-400">● QUALIFIED</option>
                        <option value="DEAD" className="bg-[#121212] text-rose-400">● DEAD</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-40 group-hover/status:opacity-100 transition-opacity">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-1">
                    {lead.createdBy && (
                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter px-1 rounded bg-blue-400/10">DM</span>
                            <span className="text-[10px] font-bold text-[var(--text-secondary)] truncate max-w-[80px] inline-block">{lead.createdBy.name}</span>
                        </div>
                    )}
                    <div className="text-[9px] font-black text-[var(--text-tertiary)] opacity-40 uppercase tracking-widest pl-1">
                        {new Date(lead.submittedDate || lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onOpenComments(lead)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)] text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/5 transition-all shadow-sm group/btn"
                    >
                        <svg className="w-3.5 h-3.5 opacity-50 group-hover/btn:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                        Notes {lead.comments?.length > 0 && `(${lead.comments.length})`}
                    </button>

                    {lead.lqStatus === 'QUALIFIED' && (
                        <button
                            onClick={() => onOpenAssign(lead)}
                            disabled={(lead.comments?.length || 0) === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg ${((lead.comments?.length || 0) === 0)
                                ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20 cursor-not-allowed opacity-60'
                                : 'bg-[var(--accent-primary)] text-white shadow-[var(--accent-primary)]/20 hover:brightness-110 active:scale-95'}`}
                        >
                            Push <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
});

export default LeadTableRow;
