import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../manager/api/manager.api';

export default function ManagerLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await managerAPI.getMyLeads();
            if (response.success) {
                setLeads(response.leads || []);
            }
        } catch (err) {
            console.error("Failed to fetch manager leads", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter(l =>
        (l.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn max-w-[1600px] mx-auto px-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-primary)]">Manager <span className="text-[var(--accent-primary)]">Deals</span></h1>
                    <p className="text-[var(--text-tertiary)] text-sm font-medium">Admin View: Overseeing all deals in manager stage</p>
                </div>
                <div className="relative w-72">
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl px-5 py-3 pl-12 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                    <svg className="absolute left-4 top-3.5 h-5 w-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLeads.map(lead => (
                    <div key={lead._id} className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-6 hover:border-[var(--accent-primary)]/40 transition-all shadow-xl space-y-5">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-xl">
                                    {lead.name?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-[var(--text-primary)] truncate">{lead.name}</h3>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-tertiary)] bg-[var(--bg-tertiary)]/50 px-2 py-1 rounded-lg">
                                        {lead.industry || 'Lead'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className={`block text-xs font-black ${lead.stage === 'DONE' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {lead.stage === 'DONE' ? 'Done' : 'In Progress'}
                                </span>
                                <span className="text-[10px] text-[var(--text-tertiary)]">Manager: {lead.assignedTo?.name || 'TBD'}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {lead.responseSource?.value && (
                                <div className="px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)]">
                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Contact Details</div>
                                    <div className="mt-1 text-[12px] font-black text-[var(--text-primary)] truncate">
                                        {lead.responseSource.type === 'EMAIL' ? 'Email' : 'GB'}: {lead.responseSource.value}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)]/20 border border-[var(--border-primary)]/50">
                                <p className="text-[10px] uppercase font-black tracking-widest text-[var(--text-tertiary)] mb-2">Recent Timeline</p>
                                {lead.comments && lead.comments.length > 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-xs text-[var(--text-secondary)] italic">"{lead.comments[lead.comments.length - 1].text}"</p>
                                        <p className="text-[9px] text-[var(--text-tertiary)] text-right">- {lead.comments[lead.comments.length - 1].createdByRole}</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-[var(--text-tertiary)] italic">No comments recorded.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredLeads.length === 0 && (
                <div className="p-20 text-center rounded-[40px] border-2 border-dashed border-[var(--border-primary)]">
                    <p className="text-[var(--text-secondary)] font-medium">No manager leads found.</p>
                </div>
            )}
        </div>
    );
}
