import React from 'react';
import { managerAPI } from '../../../api/manager.api';

const ApprovedLeadCard = ({ lead }) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className="bg-[var(--bg-tertiary)]/40 backdrop-blur-md rounded-xl p-3 border-2 transition-all group relative overflow-hidden shadow-sm hover:-translate-y-1 cursor-pointer animate-blink-red"
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center shrink-0 border border-red-500/10 group-hover:border-red-500/30 transition-colors">
                    <span className="text-red-500 font-black text-lg">{lead.name?.[0]?.toUpperCase() || 'L'}</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-[13px] font-black text-white truncate group-hover:text-red-400 transition-colors">{lead.name}</h3>
                        <div className={`p-1 rounded-md bg-white/5 border border-white/10 transition-all ${expanded ? 'rotate-180' : ''}`}>
                            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {expanded ? (
                        <div className="space-y-1 mt-2 py-2 border-t border-white/5 animate-slideDown">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 truncate">
                                <svg className="w-2.5 h-2.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {lead.emails?.[0]?.value || 'No email'}
                            </div>

                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 truncate">
                                <svg className="w-2.5 h-2.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {lead.phones?.[0] || 'No phone'}
                            </div>

                            <div className="pt-2 mt-1 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/20 flex items-center justify-center text-[7px] font-black text-red-500">
                                        {lead.rejectionRejectedBy?.name?.[0] || 'A'}
                                    </div>
                                    <span className="text-[8px] font-black text-slate-500 uppercase">Verified by <span className="text-red-500/80">{lead.rejectionRejectedBy?.name || 'Admin'}</span></span>
                                </div>
                                <span className="text-[8px] font-black text-red-500/80 bg-red-500/5 px-2 py-0.5 rounded-md border border-red-500/10">
                                    {lead.rejectionRejectedAt ? new Date(lead.rejectionRejectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">
                            Click to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminApprovedBanner = ({ leads = [] }) => {
    const displayLeads = React.useMemo(() =>
        leads.filter(l => Boolean(l.superAdminReturnPriorityUntil)),
        [leads]
    );

    if (displayLeads.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/20 rounded-[24px] p-5 shadow-xl relative overflow-hidden animate-fadeIn mb-6 animate-blink-green">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-md font-black tracking-tight text-white">Admin Rejected Leads</h2>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/10 border-2 border-emerald-500/40 px-4 py-1.5 rounded-full animate-blink-green shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                    <span className="text-[12px] font-black text-emerald-400 uppercase tracking-wider">
                        {displayLeads.length} {displayLeads.length === 1 ? 'Lead' : 'Leads'} Approved
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 relative z-10">
                {displayLeads.map((lead) => (
                    <ApprovedLeadCard key={lead._id} lead={lead} />
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes blink-red {
                    0% { border-color: rgba(239, 68, 68, 0.2); box-shadow: 0 0 5px rgba(239, 68, 68, 0.1); }
                    50% { border-color: rgba(239, 68, 68, 0.8); box-shadow: 0 0 15px rgba(239, 68, 68, 0.3); }
                    100% { border-color: rgba(239, 68, 68, 0.2); box-shadow: 0 0 5px rgba(239, 68, 68, 0.1); }
                }
                @keyframes blink-green {
                    0% { border-color: rgba(16, 185, 129, 0.2); box-shadow: 0 0 5px rgba(16, 185, 129, 0.1); }
                    50% { border-color: rgba(16, 185, 129, 0.8); box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
                    100% { border-color: rgba(16, 185, 129, 0.2); box-shadow: 0 0 5px rgba(16, 185, 129, 0.1); }
                }
                .animate-blink-red {
                    animation: blink-red 2.5s infinite;
                }
                .animate-blink-green {
                    animation: blink-green 3s infinite;
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                `
            }} />
        </div >
    );
};

export default AdminApprovedBanner;