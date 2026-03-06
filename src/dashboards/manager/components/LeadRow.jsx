import React from 'react';

const LeadRow = ({ lead, onReject, onUpsell, copiedId, onCopy }) => {
    return (
        <tr className="hover:bg-[var(--bg-tertiary)]/5 transition-colors">
            {/* Lead Info */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                        {lead.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white">{lead.name}</div>
                        <div className="text-[10px] text-slate-500">ID: {lead._id.slice(-6).toUpperCase()}</div>
                    </div>
                </div>
            </td>

            {/* Contact Info */}
            <td className="px-4 py-3">
                <div className="space-y-1.5">
                    {lead.emails?.slice(0, 1).map((email, idx) => (
                        <div key={`email-${idx}`} className="flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs text-slate-300 truncate">{email.value}</span>
                            <button onClick={() => onCopy(email.value, `e-${lead._id}`)}>
                                <svg className={`w-3 h-3 ${copiedId === `e-${lead._id}` ? 'text-emerald-500' : 'text-slate-500 hover:text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {lead.phones?.slice(0, 1).map((phone, idx) => (
                        <div key={`phone-${idx}`} className="flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-xs text-slate-300">{phone}</span>
                            <button onClick={() => onCopy(phone, `p-${lead._id}`)}>
                                <svg className={`w-3 h-3 ${copiedId === `p-${lead._id}` ? 'text-emerald-500' : 'text-slate-500 hover:text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </td>

            {/* Details */}
            <td className="px-4 py-3">
                <div className="space-y-1">
                    <div className="text-xs text-white">{lead.industry || 'General'}</div>
                    <div className="text-[10px] text-slate-500">Src: {lead.responseSource?.type || 'Manual'}</div>
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-3 text-center">
                {lead.rejectionRequested ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span className="text-xs text-red-400">Rejection Req</span>
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span className="text-xs text-amber-400">Pending</span>
                    </span>
                )}
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => onReject(lead)}
                        disabled={lead.rejectionRequested}
                        className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${lead.rejectionRequested
                            ? 'bg-slate-500/5 border-white/5 text-slate-500 cursor-not-allowed'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400'
                            }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Reject</span>
                    </button>

                    <button
                        onClick={() => onUpsell(lead)}
                        disabled={lead.rejectionRequested}
                        className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${lead.rejectionRequested
                            ? 'bg-slate-500/5 border-white/5 text-slate-500 cursor-not-allowed'
                            : 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-purple-400'
                            }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>Upsell</span>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default LeadRow;