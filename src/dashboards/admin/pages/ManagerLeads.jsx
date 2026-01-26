import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from '../../../api/admin.api';
import SharedLoader from '../../../components/SharedLoader';

export default function ManagerLeads() {
    const [leads, setLeads] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('ALL_LEADS'); // ALL_LEADS, TEAM, INDIVIDUAL_LEADS
    const [selectedUser, setSelectedUser] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [stageFilter, setStageFilter] = useState('ALL'); // ALL, MANAGER, DONE, REJECTED

    const fetchAllLeads = async () => {
        try {
            setLoading(true);
            // Fetch a larger set and include various stages related to managers
            const response = await adminAPI.getLeadsByStage(null, 1000);
            if (response.success) {
                // Filter for leads that are in Manager stages or have been assigned
                const mLeads = response.leads.filter(l =>
                    l.stage === 'MANAGER' ||
                    l.stage === 'DONE' ||
                    l.stage === 'REJECTED' ||
                    l.assignedToRole === 'Manager'
                );
                setLeads(mLeads);
            }
        } catch (err) {
            console.error("Failed to fetch manager leads", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getPerformance('Manager');
            if (response.success) {
                setTeam(response.rows);
            }
        } catch (error) {
            console.error('Error fetching team:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserLeads = async (user) => {
        try {
            setLoading(true);
            setSelectedUser(user);
            // Bypass stage filter to show full assignment history
            const response = await adminAPI.getLeadsByStage(null, 500, 0, { assignedTo: user.userId });
            if (response.success) {
                setLeads(response.leads || []);
                setView('INDIVIDUAL_LEADS');
            }
        } catch (error) {
            console.error('Error fetching individual leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'ALL_LEADS') fetchAllLeads();
        else if (view === 'TEAM') fetchTeam();
    }, [view]);

    const filteredLeads = useMemo(() => {
        return leads.filter(l => {
            // Stage Filter
            if (stageFilter !== 'ALL' && l.stage !== stageFilter) return false;

            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                return (
                    l.name?.toLowerCase().includes(search) ||
                    l.industry?.toLowerCase().includes(search) ||
                    l.status?.toLowerCase().includes(search) ||
                    l.assignedTo?.name?.toLowerCase().includes(search)
                );
            }
            if (filterDate) {
                const d = new Date(l.createdAt);
                if (!isNaN(d.getTime())) {
                    const rowDate = d.toISOString().split('T')[0];
                    if (rowDate !== filterDate) return false;
                }
            }
            return true;
        });
    }, [leads, searchTerm, filterDate, stageFilter]);

    const filteredTeam = useMemo(() => {
        return team.filter(member => {
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                return (
                    member.name?.toLowerCase().includes(search) ||
                    member.email?.toLowerCase().includes(search)
                );
            }
            return true;
        });
    }, [team, searchTerm]);

    if (loading && leads.length === 0 && team.length === 0) return <SharedLoader />;

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-fadeIn max-w-[1700px] mx-auto">
            {/* Header */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500 opacity-5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:opacity-10" />

                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                                Deal Manager <span className="text-[var(--accent-primary)]">
                                    {view === 'ALL_LEADS' ? 'All Records' : view === 'TEAM' ? 'Team' : `History: ${selectedUser?.name}`}
                                </span>
                            </h1>
                        </div>
                        <p className="text-[13px] font-bold text-[var(--text-secondary)] opacity-70">
                            {view === 'TEAM' ? 'Analyzing closing rates and manager performance' : `Overseeing ${filteredLeads.length} high-intent deals`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* View Switcher */}
                        <div className="flex p-1 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-2xl">
                            <button
                                onClick={() => { setView('ALL_LEADS'); setSelectedUser(null); }}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${view === 'ALL_LEADS' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                All Deals
                            </button>
                            <button
                                onClick={() => { setView('TEAM'); setSelectedUser(null); }}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${view === 'TEAM' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                Team
                            </button>
                        </div>

                        {view !== 'TEAM' && (
                            <>
                                <select
                                    value={stageFilter}
                                    onChange={e => setStageFilter(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-xs font-black text-[var(--text-primary)] outline-none ring-[var(--accent-primary)]/20 focus:ring-2 cursor-pointer"
                                >
                                    <option value="ALL">All Stages</option>
                                    <option value="MANAGER">Active Deals</option>
                                    <option value="DONE">Completed</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={e => setFilterDate(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-xs font-bold text-[var(--text-primary)] outline-none ring-[var(--accent-primary)]/20 focus:ring-2"
                                />
                            </>
                        )}

                        <div className="relative w-64 md:w-72">
                            <input
                                type="text"
                                placeholder={view === 'TEAM' ? "Search managers..." : "Search deals..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl px-4 py-2.5 pl-10 text-xs font-bold outline-none ring-[var(--accent-primary)]/20 focus:ring-2"
                            />
                            <svg className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {view === 'TEAM' ? (
                /* TEAM VIEW (Grid) */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredTeam.map((member) => (
                        <div
                            key={member.userId}
                            onClick={() => fetchUserLeads(member)}
                            className="group bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-8 hover:border-[var(--accent-primary)] transition-all cursor-pointer relative overflow-hidden active:scale-95 shadow-xl"
                        >
                            <div className="flex items-center gap-5">
                                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-3xl shadow-2xl group-hover:rotate-6 transition-transform">
                                    {member.name?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-xl text-[var(--text-primary)] truncate tracking-tight">{member.name}</h3>
                                    <p className="text-sm text-[var(--text-tertiary)] font-medium truncate">{member.email}</p>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-3xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-colors group-hover:bg-[var(--accent-primary)]/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-1">Paid Deals</p>
                                    <p className="text-3xl font-black text-emerald-500 tracking-tighter">{member.metrics?.paid || 0}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-colors group-hover:bg-[var(--accent-primary)]/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-1">Total</p>
                                    <p className="text-3xl font-black text-[var(--accent-primary)] tracking-tighter">{member.metrics?.processed || 0}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${member.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                    {member.status}
                                </span>
                                <div className="p-3 rounded-2xl bg-[var(--bg-tertiary)] text-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-all shadow-md group-hover:translate-x-1">
                                    <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* EXCEL-LIKE TABLE VIEW */
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-slideUp">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">#</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Deal / Prospect</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Contact</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Industry</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Manager</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Engagement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-primary)]/50">
                                {filteredLeads.map((lead, index) => (
                                    <tr key={lead._id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors group cursor-default">
                                        <td className="px-6 py-5 align-top text-xs font-bold text-[var(--text-tertiary)]">{index + 1}</td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-amber-600 font-black text-sm border border-orange-500/10">
                                                    {lead.name?.[0] || 'D'}
                                                </div>
                                                <div className="max-w-[180px]">
                                                    <div className="font-bold text-[var(--text-primary)] text-sm break-words">{lead.name || 'Anonymous'}</div>
                                                    <div className="text-[10px] text-[var(--text-tertiary)] font-black uppercase mt-1">
                                                        📍 {lead.location || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="space-y-2">
                                                <span className={`block px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border w-fit ${lead.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    lead.status === 'UNPAID' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                    }`}>
                                                    {lead.status || 'PENDING'}
                                                </span>
                                                <div className="flex gap-1">
                                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${lead.stage === 'MANAGER' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                                        lead.stage === 'DONE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                            'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                                        }`}>
                                                        {lead.stage === 'MANAGER' ? 'ACTIVE' : lead.stage}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                                                        LQ: {lead.lqStatus || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="flex flex-col gap-1.5 min-w-[220px]">
                                                {lead.emails && lead.emails.length > 0 ? (
                                                    lead.emails.map((e, i) => (
                                                        <div key={i} className={`flex items-center gap-2 py-1 px-2 rounded-lg border transition-all ${e.value === lead.responseSource?.value ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20' : 'bg-[var(--bg-tertiary)]/30 border-transparent'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${e.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                                                            <span className={`text-[11px] font-bold break-all ${e.value === lead.responseSource?.value ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                                                {e.value}
                                                            </span>
                                                            {e.value === lead.responseSource?.value && <span className="ml-auto text-[8px] font-black uppercase text-[var(--accent-primary)]">Used</span>}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-[var(--text-tertiary)] italic">No Emails</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="flex flex-col gap-1.5 min-w-[150px]">
                                                {lead.phones && lead.phones.length > 0 ? (
                                                    lead.phones.map((p, i) => (
                                                        <div key={i} className={`flex items-center gap-2 py-1 px-2 rounded-lg border transition-all ${p === lead.responseSource?.value ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20' : 'bg-[var(--bg-tertiary)]/30 border-transparent'}`}>
                                                            <div className="p-0.5 bg-[var(--accent-primary)]/10 rounded">
                                                                <svg className="w-2 h-2 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                            </div>
                                                            <span className={`text-[11px] font-bold ${p === lead.responseSource?.value ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                                                {p}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-[var(--text-tertiary)] italic">No Phones</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg text-[9px] font-black uppercase border border-[var(--border-primary)]">
                                                        {lead.industry || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="text-[9px] text-[var(--text-tertiary)] font-black uppercase flex items-center gap-1 px-1">
                                                    <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
                                                    via {lead.responseSource?.type || 'Source N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-black text-[var(--text-primary)] border border-[var(--border-primary)]">
                                                    {lead.assignedTo?.name?.[0] || 'M'}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-[var(--text-primary)]">{lead.assignedTo?.name || 'Unassigned'}</div>
                                                    <div className="text-[9px] text-[var(--text-tertiary)] font-black uppercase">Role: {lead.assignedToRole || 'Manager'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="space-y-1">
                                                <div className="text-xs font-bold text-[var(--text-primary)]">{lead.comments?.length || 0} Logs</div>
                                                <div className="text-[9px] font-bold text-[var(--text-tertiary)]">
                                                    Assigned: {lead.assignedAt ? new Date(lead.assignedAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                                {lead.lqUpdatedBy && (
                                                    <div className="mt-2 pt-2 border-t border-[var(--border-primary)]/30">
                                                        <div className="text-[8px] font-black text-[var(--text-tertiary)] uppercase mb-1">Qualified By</div>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-4 h-4 rounded bg-purple-500/10 flex items-center justify-center text-[7px] font-black text-purple-600 border border-purple-500/20">
                                                                {lead.lqUpdatedBy.name?.[0]}
                                                            </div>
                                                            <span className="text-[9px] font-bold text-[var(--text-secondary)]">{lead.lqUpdatedBy.name}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredLeads.length === 0 && (
                            <div className="py-24 text-center">
                                <p className="text-[var(--text-secondary)] font-black text-xl tracking-tight">No Active Deals</p>
                                <p className="text-sm text-[var(--text-tertiary)] mt-2">There are no deals assigned to managers at this moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
