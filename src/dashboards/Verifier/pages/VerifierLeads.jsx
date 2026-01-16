import React, { useState, useEffect, useMemo } from 'react';
import dataMinorAPI from '../../../api/data-minor';

const VerifierLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedNames, setExpandedNames] = useState(new Set());
    const [filterDate, setFilterDate] = useState('');

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await dataMinorAPI.getVerifierLeads(100, 0);
            console.log(response);
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

    const toggleExpand = (name) => {
        const key = (name || 'Unknown').trim().toLowerCase();
        setExpandedNames(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) newSet.delete(key);
            else newSet.add(key);
            return newSet;
        });
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toUpperCase();
        if (s === 'ACTIVE') return 'border-[var(--accent-success)]/20 bg-[var(--accent-success)]/10 text-[var(--accent-success)]';
        if (s === 'BOUNCED') return 'border-[var(--accent-error)]/20 bg-[var(--accent-error)]/10 text-[var(--accent-error)]';
        if (s === 'DEAD') return 'border-gray-500/20 bg-gray-500/10 text-gray-500';
        return 'border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]';
    };

    const getStatusIcon = (status) => {
        if (status === 'ACTIVE') return '✓';
        if (status === 'BOUNCED' || status === 'DEAD') return '✕';
        if (status === 'NO_EMAIL') return '–';
        return '…';
    };

    const grouped = useMemo(() => {
        const map = new Map();

        leads.forEach(lead => {
            // Date filtering
            if (filterDate) {
                const d = new Date(lead.submittedDate || lead.createdAt);
                if (!isNaN(d.getTime())) {
                    const rowDate = d.toISOString().split('T')[0];
                    if (rowDate !== filterDate) return;
                }
            }

            const emails = lead.emails || [];
            const pendingEmails = emails.filter(e => !e.status || String(e.status).toUpperCase() === 'PENDING');

            if (pendingEmails.length === 0) return;

            const nameKey = (lead.name || 'Unknown').trim().toLowerCase();
            if (!map.has(nameKey)) {
                map.set(nameKey, {
                    displayName: lead.name || 'Unknown',
                    sources: new Set(),
                    totalEmails: 0,
                    items: []
                });
            }

            const group = map.get(nameKey);
            group.sources.add(lead.sources?.[0]?.name || 'Unknown');
            group.totalEmails += pendingEmails.length;

            group.items.push({
                ...lead,
                emails: pendingEmails
            });
        });

        return Array.from(map.values())
            .filter(g => g.totalEmails > 0)
            .sort((a, b) => b.totalEmails - a.totalEmails);
    }, [leads, filterDate]);

    const handleVerifyAction = async (leadId, email, status) => {
        if (!email) return;

        setLeads(prevLeads =>
            prevLeads.map(lead =>
                lead._id === leadId
                    ? {
                        ...lead,
                        emails: lead.emails?.map(e =>
                            e.normalized === email ? { ...e, status } : e
                        ) || []
                    }
                    : lead
            )
        );

        try {
            await dataMinorAPI.updateLeadEmailStatus(leadId, {
                normalized: email,
                status
            });
        } catch (err) {
            console.error(err);
            fetchLeads();
        }
    };

    const handleMoveToLq = async (leadId) => {
        try {
            await dataMinorAPI.moveLeadToLeadQualifiers(leadId);
            // Remove the lead from the list or show success
            setLeads(prev => prev.filter(l => l._id !== leadId));
        } catch (error) {
            console.error('Error moving lead:', error);
            alert('Failed to move lead: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8 min-h-screen animate-in fade-in slide-in-from-bottom-5 duration-700"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        Verifier Leads
                    </h1>
                    <p className="text-sm font-medium mt-1 opacity-80" style={{ color: 'var(--text-secondary)' }}>
                        Review and verify submitted leads
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="date"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                        className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 font-bold"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-primary)'
                        }}
                    />

                    <button
                        onClick={fetchLeads}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl border transition-all flex items-center gap-2 text-sm font-bold disabled:opacity-50 hover:brightness-110 active:scale-95 shadow-lg"
                        style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* List Content */}
            <div className="space-y-4">
                {loading && leads.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center opacity-60">
                        <div className="w-12 h-12 mb-4 border-4 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: 'var(--border-primary)', borderTopColor: 'var(--accent-primary)' }}></div>
                        <p style={{ color: 'var(--text-secondary)' }}>Loading leads...</p>
                    </div>
                ) : grouped.length === 0 ? (
                    <div className="p-20 text-center opacity-60 flex flex-col items-center justify-center rounded-3xl border border-dashed"
                        style={{ borderColor: 'var(--border-primary)' }}>
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p style={{ color: 'var(--text-secondary)' }}>No leads found for verification</p>
                    </div>
                ) : (
                    grouped.map((group) => {
                        const isExpanded = expandedNames.has(group.displayName.trim().toLowerCase());
                        const sourceText = Array.from(group.sources).join(' • ');

                        return (
                            <div
                                key={group.displayName}
                                className="group rounded-2xl border transition-all duration-300 overflow-hidden hover:shadow-2xl"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderColor: isExpanded ? 'var(--accent-primary)' : 'var(--border-primary)',
                                    boxShadow: isExpanded ? '0 10px 40px -10px rgba(0,0,0,0.5)' : 'none'
                                }}
                            >
                                {/* Card Header (Person Summary) */}
                                <div
                                    onClick={() => toggleExpand(group.displayName)}
                                    className="px-6 py-5 flex items-center justify-between cursor-pointer transition-colors"
                                    style={{
                                        backgroundColor: isExpanded ? 'rgba(0,0,0,0.2)' : 'transparent',
                                    }}
                                >
                                    <div className="flex items-center gap-5 flex-1">
                                        {/* Avatar */}
                                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform transition-transform group-hover:scale-105"
                                            style={{
                                                background: `linear-gradient(135deg, var(--color-secondary), var(--color-primary))`,
                                                border: '1px solid var(--border-primary)'
                                            }}>
                                            {group.displayName.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-3">
                                                <h3 className="font-bold text-lg truncate tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                                    {group.displayName}
                                                </h3>
                                                {isExpanded && (
                                                    <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full"
                                                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-tertiary)' }}>
                                                        Viewing Details
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 mt-1 text-xs font-medium">
                                                <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                                                    <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{group.totalEmails} Email{group.totalEmails !== 1 ? 's' : ''}</span>
                                                </div>

                                                {sourceText && (
                                                    <div className="flex items-center gap-1.5 opacity-80" style={{ color: 'var(--text-tertiary)' }}>
                                                        <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                        </svg>
                                                        <span className="truncate max-w-[200px]">{sourceText}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] uppercase font-bold tracking-wider opacity-50" style={{ color: 'var(--text-tertiary)' }}>
                                                Submitted
                                            </p>
                                            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                                {group.items[0]?.submittedDate ? new Date(group.items[0].submittedDate).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>

                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'rotate-180 bg-[var(--bg-primary)]' : 'bg-[var(--bg-tertiary)] group-hover:bg-[var(--accent-primary)] group-hover:text-white'}`}
                                            style={{ color: isExpanded ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details Panel */}
                                {isExpanded && (
                                    <div className="animate-in slide-in-from-top-2 duration-300">
                                        <div className="px-6 pb-6 pt-2">
                                            <div className="rounded-xl overflow-hidden border"
                                                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>

                                                {/* Inner Table Header */}
                                                <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[10px] uppercase font-black tracking-widest"
                                                    style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-tertiary)' }}>
                                                    <div className="col-span-5">Email Address</div>
                                                    <div className="col-span-3">Status</div>
                                                    <div className="col-span-4 text-right">Verification</div>
                                                </div>

                                                {/* Inner Table Body */}
                                                <div className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                                                    {group.items.map(lead => {
                                                        const hasReviewedEmail = lead.emails.some(e => e.status && String(e.status).toUpperCase() !== 'PENDING');

                                                        return (
                                                            <div key={lead._id} className="group/lead relative">
                                                                {/* Lead Emails */}
                                                                <div className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                                                                    {(lead.emails || []).filter(e => !e.status || String(e.status).toUpperCase() === 'PENDING').map((emailObj, idx) => {
                                                                        const email = emailObj.normalized || emailObj.value;
                                                                        const status = emailObj.status || 'PENDING';

                                                                        return (
                                                                            <div key={`${lead._id}-${idx}`}
                                                                                className="grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors hover:bg-[var(--bg-tertiary)]/20">

                                                                                {/* Email Column */}
                                                                                <div className="col-span-5 flex items-center gap-2 group/copy">
                                                                                    <span className="font-mono text-sm break-all font-medium text-white">
                                                                                        {email}
                                                                                    </span>
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            navigator.clipboard.writeText(email);
                                                                                        }}
                                                                                        className="opacity-0 group-hover/copy:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white"
                                                                                        title="Copy Email"
                                                                                    >
                                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                                        </svg>
                                                                                    </button>
                                                                                </div>

                                                                                {/* Status Column */}
                                                                                <div className="col-span-3">
                                                                                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(status).split(' ').join(' ')}`}>
                                                                                        <span className="text-xs">{getStatusIcon(status)}</span>
                                                                                        <span>{status}</span>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Action Column */}
                                                                                <div className="col-span-4 flex justify-end">
                                                                                    <div className="relative w-36 group/select">
                                                                                        <select
                                                                                            value={status}
                                                                                            onClick={(e) => e.stopPropagation()}
                                                                                            onChange={(e) => {
                                                                                                e.stopPropagation();
                                                                                                handleVerifyAction(lead._id, email, e.target.value);
                                                                                            }}
                                                                                            className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-all shadow-sm hover:shadow-md"
                                                                                            style={{
                                                                                                backgroundColor: 'var(--bg-secondary)',
                                                                                                borderColor: 'var(--border-primary)',
                                                                                                color: 'var(--text-primary)'
                                                                                            }}
                                                                                        >
                                                                                            {status === 'PENDING' && <option value="PENDING">Pending Check</option>}
                                                                                            <option value="ACTIVE">Mark Active</option>
                                                                                            <option value="BOUNCED">Mark Bounced</option>
                                                                                            <option value="DEAD">Mark Dead</option>
                                                                                        </select>
                                                                                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover/select:translate-x-0.5"
                                                                                            style={{ color: 'var(--text-secondary)' }}>
                                                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                                                            </svg>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>


                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default VerifierLeads;