import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from '../../../api/admin.api';
import SharedLoader from '../../../components/SharedLoader';

export default function DataMinerLeads() {
    const [leads, setLeads] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('ALL_LEADS'); // ALL_LEADS, TEAM, INDIVIDUAL_LEADS
    const [selectedUser, setSelectedUser] = useState(null);

    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllLeads = async () => {
        try {
            setLoading(true);
            // Fetch ALL leads from ALL employees combined (no stage filter)
            const response = await adminAPI.getLeadsByStage(null, 500);
            if (response.success) {
                setLeads(response.leads);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getPerformance('Data Minors');
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
            // Fetch all leads created by this specific user (no stage filter)
            const response = await adminAPI.getLeadsByStage(null, 500, 0, { createdBy: user.userId });
            if (response.success) {
                setLeads(response.leads);
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
        return leads.filter(lead => {
            if (filterDate) {
                const d = new Date(lead.createdAt);
                if (!isNaN(d.getTime())) {
                    const rowDate = d.toISOString().split('T')[0];
                    if (rowDate !== filterDate) return false;
                }
            }
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                return (
                    lead.name?.toLowerCase().includes(search) ||
                    lead.location?.toLowerCase().includes(search) ||
                    lead.industry?.toLowerCase().includes(search) ||
                    lead.emails?.some(e => e.value.toLowerCase().includes(search)) ||
                    lead.phones?.some(p => p.toLowerCase().includes(search))
                );
            }
            return true;
        });
    }, [leads, filterDate, searchTerm]);

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
        <div className="p-4 sm:p-6 md:p-8 space-y-6 min-h-screen animate-fadeIn max-w-[1800px] mx-auto">
            {/* Header Area */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)] opacity-5 rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2.5 bg-[var(--accent-primary)]/10 rounded-xl text-[var(--accent-primary)]">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                                Master <span className="text-[var(--accent-primary)]">Lead Repository</span>
                            </h1>
                        </div>
                        <p className="text-[13px] font-bold text-[var(--text-secondary)] opacity-70">
                            {view === 'TEAM' ? 'Browse Data Miners' : `Viewing ${view === 'ALL_LEADS' ? 'All System' : selectedUser?.name} Leads • ${filteredLeads.length} records`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* View Switcher */}
                        <div className="flex p-1 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-primary)]">
                            <button
                                onClick={() => { setView('ALL_LEADS'); setSelectedUser(null); }}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${view === 'ALL_LEADS' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                All Leads
                            </button>
                            <button
                                onClick={() => { setView('TEAM'); setSelectedUser(null); }}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${view === 'TEAM' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                Team
                            </button>
                        </div>

                        {view !== 'TEAM' && (
                            <input
                                type="date"
                                value={filterDate}
                                onChange={e => setFilterDate(e.target.value)}
                                className="px-4 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-xs font-bold focus:ring-2 ring-[var(--accent-primary)]/20 outline-none text-[var(--text-primary)]"
                            />
                        )}

                        <div className="relative w-64 md:w-72">
                            <input
                                type="text"
                                placeholder={view === 'TEAM' ? "Search miners..." : "Search leads..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl px-4 py-2.5 pl-10 text-xs font-bold focus:ring-2 ring-[var(--accent-primary)]/20 outline-none"
                            />
                            <svg className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <button
                            onClick={() => view === 'TEAM' ? fetchTeam() : (selectedUser ? fetchUserLeads(selectedUser) : fetchAllLeads())}
                            className="p-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-all active:scale-95 hover:bg-[var(--accent-primary)] group"
                        >
                            <svg className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {view === 'TEAM' ? (
                /* TEAM VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredTeam.map((member) => (
                        <div
                            key={member.userId}
                            onClick={() => fetchUserLeads(member)}
                            className="group bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-8 hover:border-[var(--accent-primary)] transition-all cursor-pointer relative overflow-hidden active:scale-95 shadow-xl"
                        >
                            <div className="flex items-center gap-5">
                                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)] to-purple-600 flex items-center justify-center text-white font-black text-3xl shadow-2xl group-hover:rotate-6 transition-transform">
                                    {member.name?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-xl text-[var(--text-primary)] truncate tracking-tight">{member.name}</h3>
                                    <p className="text-sm text-[var(--text-tertiary)] truncate font-medium">{member.email}</p>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 gap-4">
                                <div className="p-5 rounded-3xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-colors group-hover:bg-[var(--accent-primary)]/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-1">Total Leads</p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">{member.metrics?.processed || 0}</p>
                                        <div className="p-2 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-xl">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* EXCEL-LIKE TABLE VIEW */
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-slideUp">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1200px]">
                            <thead>
                                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">#</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Company / Name</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Stage</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Emails Identified</th>
                                    <th className="px-6 py-5 text-[10px) font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Phone Numbers</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Industry/Loc</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Miner</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-primary)]/50">
                                {filteredLeads.map((lead, index) => (
                                    <tr key={lead._id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors group cursor-default">
                                        <td className="px-6 py-4 align-top text-xs font-bold text-[var(--text-tertiary)]">{index + 1}</td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-indigo-500/20 flex items-center justify-center text-[var(--accent-primary)] font-black text-sm border border-[var(--accent-primary)]/10">
                                                    {lead.name?.[0] || 'L'}
                                                </div>
                                                <div className="max-w-[200px] truncate">
                                                    <div className="font-bold text-[var(--text-primary)] text-sm">{lead.name || 'N/A'}</div>
                                                    <div className="text-[10px] text-[var(--text-tertiary)] font-bold">ST: {lead.stage}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${lead.stage === 'DM' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                lead.stage === 'LQ' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                                    lead.stage === 'MANAGER' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                }`}>
                                                {lead.stage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col gap-1.5 min-w-[220px]">
                                                {lead.emails && lead.emails.length > 0 ? (
                                                    lead.emails.map((e, i) => (
                                                        <div key={i} className="group/item flex items-center gap-2 py-1 px-2 rounded-lg bg-[var(--bg-tertiary)]/30 border border-transparent hover:border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/5 transition-all">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${e.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                                                            <span className="text-[11px] font-bold text-[var(--text-secondary)] break-all">{e.value}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-[var(--text-tertiary)] italic px-2">No Emails identified</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col gap-1.5 min-w-[150px]">
                                                {lead.phones && lead.phones.length > 0 ? (
                                                    lead.phones.map((p, i) => (
                                                        <div key={i} className="flex items-center gap-2 py-1 px-2 rounded-lg bg-[var(--bg-tertiary)]/30 border border-transparent hover:border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/5 transition-all">
                                                            <div className="p-1 bg-[var(--accent-primary)]/10 rounded-md">
                                                                <svg className="w-2.5 h-2.5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                            </div>
                                                            <span className="text-[11px] font-bold text-[var(--text-secondary)]">{p}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-[var(--text-tertiary)] italic px-2">No Phones identified</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="text-xs font-bold text-[var(--text-secondary)] truncate max-w-[150px]">{lead.industry || 'Unknown'}</div>
                                            <div className="text-[10px] text-[var(--text-tertiary)] font-black uppercase tracking-wider truncate max-w-[150px]">{lead.location || 'Unknown'}</div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-black text-[var(--text-primary)] border border-[var(--border-primary)]">
                                                    {lead.createdBy?.name?.[0] || 'S'}
                                                </div>
                                                <span className="text-xs font-bold text-[var(--text-secondary)]">{lead.createdBy?.name || 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="text-xs font-bold text-[var(--text-secondary)]">{new Date(lead.createdAt).toLocaleDateString()}</div>
                                            <div className="text-[10px] text-[var(--text-tertiary)] font-medium">{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
