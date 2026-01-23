import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from '../../../api/admin.api';

export default function ManagerLeads() {
    const [leads, setLeads] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('ALL_LEADS'); // ALL_LEADS, TEAM, INDIVIDUAL_LEADS
    const [selectedUser, setSelectedUser] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');

    const fetchAllLeads = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getManagerLeads(200);
            if (response.success) {
                setLeads(response.leads || []);
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
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                return (
                    l.name?.toLowerCase().includes(search) ||
                    l.industry?.toLowerCase().includes(search) ||
                    l.status?.toLowerCase().includes(search)
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
    }, [leads, searchTerm, filterDate]);

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

    if (loading && leads.length === 0 && team.length === 0) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-fadeIn max-w-[1700px] mx-auto">
            {/* Header */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500 opacity-5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:opacity-10" />

                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8l-8 8-4-4-6 6" /></svg>
                            </div>
                            <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">
                                Deal Manager <span className="text-[var(--accent-primary)]">
                                    {view === 'ALL_LEADS' ? 'All Records' : view === 'TEAM' ? 'Team' : `History: ${selectedUser?.name}`}
                                </span>
                            </h1>
                        </div>
                        <p className="text-[var(--text-secondary)] font-medium">
                            {view === 'TEAM' ? 'Analyzing closing rates and manager performance' : `Overseeing ${filteredLeads.length} high-intent deals`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex p-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-2xl">
                            <button
                                onClick={() => { setView('ALL_LEADS'); setSelectedUser(null); }}
                                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${view === 'ALL_LEADS' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-xl' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                All Deals
                            </button>
                            <button
                                onClick={() => { setView('TEAM'); setSelectedUser(null); }}
                                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${view === 'TEAM' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-xl' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                Team
                            </button>
                        </div>

                        {view !== 'TEAM' && (
                            <input
                                type="date"
                                value={filterDate}
                                onChange={e => setFilterDate(e.target.value)}
                                className="px-5 py-3 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-sm font-bold text-[var(--text-primary)] outline-none ring-[var(--accent-primary)]/20 focus:ring-2"
                            />
                        )}

                        <div className="relative w-72">
                            <input
                                type="text"
                                placeholder={view === 'TEAM' ? "Search managers..." : "Search deals..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-[20px] px-6 py-3 pl-12 text-sm font-medium outline-none ring-[var(--accent-primary)]/20 focus:ring-2"
                            />
                            <svg className="absolute left-4 top-3.5 h-5 w-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                        <td className="px-6 py-4 text-xs font-bold text-[var(--text-tertiary)]">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-amber-600 font-black text-sm border border-orange-500/10">
                                                    {lead.name?.[0] || 'D'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[var(--text-primary)] text-sm">{lead.name || 'Anonymous'}</div>
                                                    <div className="text-[10px] text-[var(--text-tertiary)] font-black">ST: {lead.stage}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${lead.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    lead.status === 'UNPAID' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                }`}>
                                                {lead.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[150px]">
                                                {lead.responseSource?.value || 'N/A'}
                                            </div>
                                            <div className="text-[10px] text-[var(--text-tertiary)] font-black uppercase">
                                                {lead.responseSource?.type || 'No Source'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-lg uppercase border border-[var(--border-primary)]">
                                                {lead.industry || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-black text-[var(--text-primary)] border border-[var(--border-primary)]">
                                                    {lead.assignedTo?.name?.[0] || 'M'}
                                                </div>
                                                <span className="text-xs font-bold text-[var(--text-secondary)]">{lead.assignedTo?.name || 'Unassigned'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-[var(--text-secondary)]">{lead.comments?.length || 0} Comments</div>
                                            <div className="text-[10px] font-medium text-[var(--text-tertiary)] tracking-tight">
                                                Last: {lead.comments && lead.comments.length > 0 ? new Date(lead.comments[lead.comments.length - 1].createdAt).toLocaleDateString() : 'No Activity'}
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
