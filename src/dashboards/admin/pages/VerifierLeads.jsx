import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from '../../../api/admin.api';

export default function VerifierLeads() {
    const [leads, setLeads] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('ALL_LEADS'); // ALL_LEADS, TEAM, INDIVIDUAL_LEADS
    const [selectedUser, setSelectedUser] = useState(null);

    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLeads = async () => {
        try {
            setLoading(true);
            // Fetch leads in DM stage (this is where verification happens)
            const response = await adminAPI.getVerifierLeads(200);
            console.log("Verifier Leads API Response:", response);
            if (response.success) {
                setLeads(response.leads);
            }
        } catch (error) {
            console.error('Error fetching verifier leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getPerformance('Verifier');
            if (response.success) {
                setTeam(response.rows);
            }
        } catch (error) {
            console.error('Error fetching verifier team:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserLeads = async (user) => {
        try {
            setLoading(true);
            setSelectedUser(user);
            // In the case of verifiers, they don't "own" leads, they verify emails inside them.
            // However, we can show leads where they have verified at least one email.
            // For now, let's just show all DM leads for context, or filter if backend supported it.
            // Since backend doesn't have verifiedBy filter on the main endpoint yet, 
            // we'll fetch all DM leads and show a notification.
            const response = await adminAPI.getVerifierLeads(500);
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
        if (view === 'ALL_LEADS') fetchLeads();
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
                    lead.emails?.some(e => e.value.toLowerCase().includes(search))
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

    if (loading && leads.length === 0 && team.length === 0) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 min-h-screen animate-fadeIn max-w-[1800px] mx-auto">
            {/* Header Area */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[var(--bg-secondary)] p-8 rounded-[40px] border border-[var(--border-primary)] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-5 rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-[var(--text-primary)]">
                            Verification <span className="text-[var(--accent-primary)]">{view === 'TEAM' ? 'Team' : 'Collection'}</span>
                        </h1>
                    </div>
                    <p className="text-[var(--text-secondary)] font-medium">
                        {view === 'TEAM' ? 'Monitoring email validation performance' : `Analyzing ${filteredLeads.length} leads currently in the DM/Verification pipeline`}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 relative z-10">
                    <div className="flex p-1.5 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-primary)]">
                        <button
                            onClick={() => { setView('ALL_LEADS'); setSelectedUser(null); }}
                            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${view === 'ALL_LEADS' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-xl' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            Queue
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
                            className="px-5 py-3 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-sm font-bold focus:ring-2 ring-[var(--accent-primary)]/20 outline-none text-[var(--text-primary)]"
                        />
                    )}

                    <div className="relative w-72">
                        <input
                            type="text"
                            placeholder={view === 'TEAM' ? "Search verifiers..." : "Search leads..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-[20px] px-6 py-3 pl-12 text-sm font-medium focus:ring-2 ring-[var(--accent-primary)]/20 outline-none"
                        />
                        <svg className="absolute left-4 top-3.5 h-5 w-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <button
                        onClick={() => view === 'TEAM' ? fetchTeam() : fetchLeads()}
                        className="p-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-all active:scale-95 hover:bg-[var(--accent-primary)] group"
                    >
                        <svg className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
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
                                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-3xl shadow-2xl group-hover:rotate-6 transition-transform">
                                    {member.name?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-xl text-[var(--text-primary)] truncate tracking-tight">{member.name}</h3>
                                    <p className="text-sm text-[var(--text-tertiary)] truncate font-medium">{member.email}</p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="p-5 rounded-3xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-colors group-hover:bg-[var(--accent-primary)]/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-1">Status</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">Active Verifier</p>
                                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase">
                                            {member.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Master Sheet Table for Verifiers */
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-slideUp">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1200px]">
                            <thead>
                                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">#</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Company / Identity</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Email Assets</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Verification Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Location</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Submitter</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-primary)]/50">
                                {filteredLeads.map((lead, index) => (
                                    <tr key={lead._id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors group cursor-default">
                                        <td className="px-6 py-4 text-xs font-bold text-[var(--text-tertiary)]">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-600 font-black text-sm border border-emerald-500/10">
                                                    {lead.name?.[0] || 'V'}
                                                </div>
                                                <div className="max-w-[200px] truncate">
                                                    <div className="font-bold text-[var(--text-primary)] text-sm">{lead.name || 'Anonymous'}</div>
                                                    <div className="text-[10px] text-[var(--text-tertiary)] font-bold">ID: {lead._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1 max-w-[250px]">
                                                {lead.emails && lead.emails.length > 0 ? (
                                                    lead.emails.slice(0, 3).map((e, i) => (
                                                        <div key={i} className="text-[11px] font-bold text-[var(--text-secondary)] truncate flex items-center gap-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${e.status === 'ACTIVE' ? 'bg-emerald-500' :
                                                                e.status === 'BOUNCED' ? 'bg-rose-500' : 'bg-amber-400'
                                                                }`} />
                                                            {e.value}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-[var(--text-tertiary)] italic">No Emails</span>
                                                )}
                                                {lead.emails?.length > 3 && (
                                                    <div className="text-[9px] font-black text-[var(--accent-primary)]">+{lead.emails.length - 3} more</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${lead.emails?.every(e => e.status === 'ACTIVE') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    lead.emails?.some(e => e.status === 'BOUNCED') ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    }`}>
                                                    {lead.emails?.filter(e => e.status !== 'PENDING').length || 0}/{lead.emails?.length || 0} Verified
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-[var(--text-secondary)]">{lead.location || 'Unknown'}</div>
                                            <div className="text-[10px] text-[var(--text-tertiary)] font-black uppercase tracking-wider">{lead.industry || 'Lead'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-black text-[var(--text-primary)] border border-[var(--border-primary)]">
                                                    {lead.createdBy?.name?.[0] || 'M'}
                                                </div>
                                                <span className="text-xs font-bold text-[var(--text-secondary)]">{lead.createdBy?.name || 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-[var(--text-secondary)]">{new Date(lead.createdAt).toLocaleDateString()}</div>
                                            <div className="text-[10px] text-[var(--text-tertiary)] font-medium">Stage: {lead.stage}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredLeads.length === 0 && (
                            <div className="py-24 text-center">
                                <p className="text-[var(--text-secondary)] font-black text-xl tracking-tight">No Verification Records Found</p>
                                <p className="text-sm text-[var(--text-tertiary)] mt-2">Adjust your search parameters or check if leads are in the DM stage.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
