import React, { useState, useEffect, useMemo } from 'react';
import dataMinorAPI from '../../../api/data-minor';

export default function DataMinerLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await dataMinorAPI.getVerifierLeads(100, 0);
            if (response.success) {
                setLeads(response.leads);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            if (filterDate) {
                const d = new Date(lead.submittedDate || lead.createdAt);
                if (!isNaN(d.getTime())) {
                    const rowDate = d.toISOString().split('T')[0];
                    if (rowDate !== filterDate) return false;
                }
            }
            return true;
        });
    }, [leads, filterDate]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8 min-h-screen animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                        Data Miner <span className="text-[var(--accent-primary)]">Collection</span>
                    </h1>
                    <p className="text-sm font-medium mt-1 opacity-80 text-[var(--text-secondary)]">
                        Admin View: All leads currently in data mining and verification stage
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="date"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                        className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 font-bold bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-primary)]"
                    />
                    <button
                        onClick={fetchLeads}
                        className="px-6 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm font-bold hover:brightness-110 active:scale-95 shadow-lg flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredLeads.map((lead) => (
                    <div key={lead._id} className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-6 hover:shadow-2xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg className="w-24 h-24 text-[var(--accent-primary)]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl">
                                    {lead.name?.[0] || 'L'}
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-[var(--text-primary)]">{lead.name || 'Anonymous Lead'}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                                            {lead.location || 'Unknown Location'}
                                        </span>
                                        <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-500">
                                            Stage: {lead.stage}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Submitted On</p>
                                <p className="text-xs font-bold text-[var(--text-secondary)]">{lead.submittedDate || new Date(lead.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4 relative z-10">
                            <div className="p-4 rounded-2xl bg-black/10 border border-white/5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Email Assets</p>
                                <div className="space-y-1">
                                    {(lead.emails || []).slice(0, 2).map((e, idx) => (
                                        <p key={idx} className="text-xs font-medium text-[var(--text-secondary)] truncate">{e.value}</p>
                                    ))}
                                    {(lead.emails || []).length > 2 && <p className="text-[10px] text-[var(--accent-primary)] font-black">+{lead.emails.length - 2} more</p>}
                                    {(lead.emails || []).length === 0 && <p className="text-xs text-[var(--text-tertiary)] italic">No emails</p>}
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-black/10 border border-white/5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Phone Assets</p>
                                <div className="space-y-1">
                                    {(lead.phones || []).slice(0, 2).map((p, idx) => (
                                        <p key={idx} className="text-xs font-medium text-[var(--text-secondary)] truncate">{p}</p>
                                    ))}
                                    {(lead.phones || []).length > 2 && <p className="text-[10px] text-[var(--accent-primary)] font-black">+{lead.phones.length - 2} more</p>}
                                    {(lead.phones || []).length === 0 && <p className="text-xs text-[var(--text-tertiary)] italic">No phones</p>}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Sources:</p>
                                <div className="flex -space-x-2">
                                    {(lead.sources || []).map((s, idx) => (
                                        <div key={idx} className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center text-[8px] font-black text-[var(--text-secondary)] truncate px-1 shadow-sm" title={s.name}>
                                            {s.name?.[0] || 'S'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {/* Potential quick actions for admin could go here */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredLeads.length === 0 && (
                <div className="p-20 text-center rounded-[40px] border-2 border-dashed border-[var(--border-primary)]">
                    <p className="text-[var(--text-secondary)] font-medium">No leads found in data mining stage.</p>
                </div>
            )}
        </div>
    );
}
