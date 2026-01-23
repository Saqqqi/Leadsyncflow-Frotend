import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from '../../../api/admin.api';

export default function LeadQualifierLeads() {
    const [leads, setLeads] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('ALL_LEADS'); // ALL_LEADS, TEAM, INDIVIDUAL_LEADS
    const [selectedUser, setSelectedUser] = useState(null);

    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [stageFilter, setStageFilter] = useState('ALL'); // ALL, LQ, MANAGER

    const fetchAllLeads = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getLeadsByStage(null, 500);
            if (response.success) {
                const qLeads = response.leads.filter(l =>
                    l.stage === 'LQ' ||
                    l.stage === 'MANAGER' ||
                    l.lqUpdatedBy
                );
                setLeads(qLeads);
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
            const response = await adminAPI.getPerformance('Lead Qualifiers');
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
            const response = await adminAPI.getLeadsByStage(null, 500, 0, { lqUpdatedBy: user.userId });
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
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                const match = (
                    lead.name?.toLowerCase().includes(search) ||
                    lead.location?.toLowerCase().includes(search) ||
                    lead.lqStatus?.toLowerCase().includes(search) ||
                    lead.emails?.some(e => e.value.toLowerCase().includes(search)) ||
                    lead.phones?.some(p => p.toLowerCase().includes(search))
                );
                if (!match) return false;
            }
            if (filterDate) {
                const d = new Date(lead.createdAt);
                if (!isNaN(d.getTime())) {
                    const rowDate = d.toISOString().split('T')[0];
                    if (rowDate !== filterDate) return false;
                }
            }
            if (stageFilter !== 'ALL' && lead.stage !== stageFilter) return false;
            if (activeTab === 'qualified' && lead.lqStatus !== 'QUALIFIED') return false;
            if (activeTab === 'pending' && !(lead.lqStatus === 'IN_CONVERSATION' || lead.lqStatus === 'PENDING')) return false;
            if (activeTab === 'dead' && lead.lqStatus !== 'DEAD') return false;
            return true;
        });
    }, [leads, searchTerm, filterDate, activeTab, stageFilter]);

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

    const counts = useMemo(() => ({
        all: leads.length,
        qualified: leads.filter(l => l.lqStatus === 'QUALIFIED').length,
        pending: leads.filter(l => l.lqStatus === 'IN_CONVERSATION' || l.lqStatus === 'PENDING').length,
        dead: leads.filter(l => l.lqStatus === 'DEAD').length,
    }), [leads]);

    if (loading && leads.length === 0 && team.length === 0) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 rounded-full border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] animate-spin" />
        </div>
    );

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-fadeIn max-w-[1800px] mx-auto">
            {/* Header */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600 opacity-5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:opacity-10" />

                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                                Master <span className="text-[var(--accent-primary)]">
                                    {view === 'ALL_LEADS' ? 'Qualification Hub' : view === 'TEAM' ? 'Team Metrics' : `History: ${selectedUser?.name}`}
                                </span>
                            </h1>
                        </div>
                        <p className="text-[13px] font-bold text-[var(--text-secondary)] opacity-70">
                            {view === 'TEAM' ? 'Analyzing qualifiers conversion rates' : `Full dataset analysis of ${filteredLeads.length} prioritized leads`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* View Switcher */}
                        <div className="flex p-1 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-2xl">
                            <button
                                onClick={() => { setView('ALL_LEADS'); setSelectedUser(null); }}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${view === 'ALL_LEADS' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                Queue
                            </button>
                            <button
                                onClick={() => { setView('TEAM'); setSelectedUser(null); }}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${view === 'TEAM' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                Team
                            </button>
                        </div>

                        {view !== 'TEAM' && (
                            <div className="flex items-center gap-3">
                                <select
                                    value={stageFilter}
                                    onChange={e => setStageFilter(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-xs font-black text-[var(--text-primary)] outline-none ring-[var(--accent-primary)]/20 focus:ring-2 cursor-pointer"
                                >
                                    <option value="ALL">All Stages</option>
                                    <option value="LQ">At Qualifier</option>
                                    <option value="MANAGER">At Manager</option>
                                </select>
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={e => setFilterDate(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-xs font-bold text-[var(--text-primary)] outline-none ring-[var(--accent-primary)]/20 focus:ring-2"
                                />
                            </div>
                        )}

                        <div className="relative w-64 md:w-72">
                            <input
                                type="text"
                                placeholder="Search everything..."
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

                {view !== 'TEAM' && (
                    <div className="flex gap-2 mt-6 border-b border-[var(--border-primary)]/50 pb-px overflow-x-auto relative z-10 scrollbar-hide">
                        {[
                            { id: 'all', label: 'All Records', count: counts.all },
                            { id: 'qualified', label: 'Qualified', count: counts.qualified },
                            { id: 'pending', label: 'In Progress', count: counts.pending },
                            { id: 'dead', label: 'Dead', count: counts.dead },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${activeTab === tab.id
                                    ? 'text-[var(--accent-primary)] border-[var(--accent-primary)]'
                                    : 'text-[var(--text-tertiary)] border-transparent hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded text-[9px] ${activeTab === tab.id ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)] group-hover:bg-[var(--border-primary)]'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
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
                                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black text-3xl shadow-2xl group-hover:rotate-6 transition-transform">
                                    {member.name?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-xl text-[var(--text-primary)] truncate tracking-tight">{member.name}</h3>
                                    <p className="text-sm text-[var(--text-tertiary)] font-medium truncate">{member.email}</p>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-3xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-colors group-hover:bg-[var(--accent-primary)]/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-1">Qualified</p>
                                    <p className="text-3xl font-black text-emerald-500 tracking-tighter">{member.metrics?.qualified || 0}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-colors group-hover:bg-[var(--accent-primary)]/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-1">Processed</p>
                                    <p className="text-3xl font-black text-[var(--accent-primary)] tracking-tighter">{member.metrics?.processed || 0}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* EXCEL-LIKE TABLE VIEW */
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-slideUp">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1500px]">
                            <thead>
                                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">#</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Lead Identity</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Email Assets</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Phone Assets</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Status / Stage</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Assignee</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Qualifier</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Activity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-primary)]/50">
                                {filteredLeads.map((lead, index) => (
                                    <tr key={lead._id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors group cursor-default">
                                        <td className="px-6 py-4 text-xs font-bold text-[var(--text-tertiary)]">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-600 font-black text-sm border border-purple-500/10">
                                                    {lead.name?.[0] || 'L'}
                                                </div>
                                                <div className="max-w-[200px] truncate">
                                                    <div className="font-bold text-[var(--text-primary)] text-sm">{lead.name || 'Anonymous'}</div>
                                                    <div className="text-[10px] text-[var(--text-tertiary)] font-black uppercase tracking-tight">Main: {lead.responseSource?.value || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5 max-w-[280px]">
                                                {lead.emails && lead.emails.length > 0 ? (
                                                    lead.emails.map((e, i) => (
                                                        <div key={i} className={`text-[11px] font-bold truncate flex items-center gap-1.5 ${e.value === lead.responseSource?.value ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${e.status === 'ACTIVE' ? 'bg-emerald-500' :
                                                                e.status === 'BOUNCED' ? 'bg-rose-500' : 'bg-amber-400'
                                                                }`} />
                                                            {e.value}
                                                            {e.value === lead.responseSource?.value && <span className="ml-1 px-1 bg-[var(--accent-primary)]/10 text-[8px] rounded uppercase">Main</span>}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-[var(--text-tertiary)] italic">No Emails Found</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5 max-w-[200px]">
                                                {lead.phones && lead.phones.length > 0 ? (
                                                    lead.phones.map((p, i) => (
                                                        <div key={i} className={`text-[11px] font-bold truncate flex items-center gap-1.5 ${p === lead.responseSource?.value ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                            {p}
                                                            {p === lead.responseSource?.value && <span className="ml-1 px-1 bg-[var(--accent-primary)]/10 text-[8px] rounded uppercase">Main</span>}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-[var(--text-tertiary)] italic">No Phones Found</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <span className={`block w-max px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${lead.lqStatus === 'QUALIFIED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    lead.lqStatus === 'DEAD' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                    }`}>
                                                    {lead.lqStatus || 'PENDING'}
                                                </span>
                                                <span className={`block w-max px-2 py-0.5 rounded-md text-[8px] font-black uppercase border border-[var(--border-primary)] ${lead.stage === 'MANAGER' ? 'bg-amber-500/10 text-amber-500' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                                                    }`}>
                                                    📍 {lead.stage}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-black text-[var(--text-primary)] border border-[var(--border-primary)]">
                                                    {lead.assignedTo?.name?.[0] || 'U'}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">{lead.assignedTo?.name || 'Unassigned'}</div>
                                                    <div className="text-[9px] text-[var(--text-tertiary)] uppercase font-black">{lead.assignedToRole || 'None'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-[10px] font-black text-purple-600 border border-purple-500/20">
                                                    {lead.lqUpdatedBy?.name?.[0] || '---'}
                                                </div>
                                                <span className="text-xs font-bold text-[var(--text-secondary)] truncate">{lead.lqUpdatedBy?.name || '---'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-[var(--text-secondary)]">{new Date(lead.updatedAt || lead.createdAt).toLocaleDateString()}</div>
                                            <div className="flex gap-2 mt-1">
                                                <span className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[9px] font-bold text-[var(--text-tertiary)] border border-[var(--border-primary)]">
                                                    {lead.comments?.length || 0} Logs
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-4 bg-[var(--bg-tertiary)] border-t border-[var(--border-primary)] flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] opacity-60">
                            Qualified Pipeline Analysis • {filteredLeads.length} Entries • Total Leads: {leads.length}
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{counts.qualified} Won</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{counts.pending} Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
