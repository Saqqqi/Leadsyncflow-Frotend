import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../../api/admin.api';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, WEEK, MONTH, PREV_MONTH, CUSTOM
    const [customDates, setCustomDates] = useState({ from: '', to: '' });

    const getDateRange = useCallback((filter) => {
        const now = new Date();
        const start = new Date();
        const end = new Date();

        switch (filter) {
            case 'WEEK':
                start.setDate(now.getDate() - 7);
                break;
            case 'MONTH':
                start.setMonth(now.getMonth() - 1);
                break;
            case 'PREV_MONTH':
                // First day of previous month
                start.setMonth(now.getMonth() - 1);
                start.setDate(1);
                // Last day of previous month
                end.setDate(0);
                break;
            case 'CUSTOM':
                return customDates;
            case 'ALL':
            default:
                return { from: '', to: '' };
        }

        const formatDate = (date) => date.toISOString().split('T')[0];
        return { from: formatDate(start), to: formatDate(end) };
    }, [customDates]);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const params = getDateRange(activeFilter);

            // Log for debugging
            console.log(`Fetching Dashboard with filter: ${activeFilter}`, params);

            const res = await adminAPI.getOverview(params);
            if (res.success) {
                setData(res);
            }
        } catch (error) {
            console.error('Dashboard Load Error:', error);
        } finally {
            setLoading(false);
        }
    }, [activeFilter, getDateRange]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const cards = useMemo(() => {
        if (!data) return [];
        const { totals, conversions } = data;
        return [
            {
                id: 'mining',
                title: 'Mining Hub',
                value: totals.dmCount,
                subtitle: 'Active Collection',
                trend: conversions.dm_to_lq,
                path: 'data-miner-leads',
                color: 'from-blue-600 to-indigo-600',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" />
                    </svg>
                )
            },
            {
                id: 'verification',
                title: 'Verification',
                value: totals.dmCount,
                subtitle: 'Email Validation',
                trend: 0,
                path: 'verifier-leads',
                color: 'from-emerald-600 to-teal-600',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            },
            {
                id: 'qualification',
                title: 'Qualification',
                value: totals.lqCount,
                subtitle: 'Funnel Filtering',
                trend: conversions.lq_to_manager,
                path: 'lead-qualifier-leads',
                color: 'from-purple-600 to-pink-600',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                )
            },
            {
                id: 'deals',
                title: 'Deal Pipeline',
                value: totals.paidCount,
                subtitle: 'Revenue Generated',
                trend: conversions.manager_paid,
                path: 'manager-leads',
                color: 'from-amber-600 to-orange-600',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            }
        ];
    }, [data]);

    if (loading && !data) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
        </div>
    );

    const { totals, conversions, leaderboards } = data;

    return (
        <div className="p-4 md:p-6 space-y-4 max-w-[1400px] mx-auto animate-fadeIn min-h-screen">
            {/* Header + Date Filters */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)] opacity-5 rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2.5 bg-[var(--accent-primary)]/10 rounded-xl text-[var(--accent-primary)]">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                                Admin <span className="text-[var(--accent-primary)]">Hub</span>
                            </h1>
                        </div>
                        <p className="text-[13px] font-bold text-[var(--text-secondary)] opacity-70">
                            Global performance overview and intelligence sync
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Date Filters Group */}
                        <div className="flex flex-wrap items-center bg-[var(--bg-tertiary)] border border-[var(--border-primary)] p-1 rounded-2xl">
                            {[
                                { id: 'ALL', label: 'All Time' },
                                { id: 'WEEK', label: 'Week' },
                                { id: 'MONTH', label: 'Month' },
                                { id: 'PREV_MONTH', label: 'Prev Month' },
                                { id: 'CUSTOM', label: 'Custom' }
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeFilter === f.id ? 'bg-[var(--accent-primary)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                >
                                    {f.label}
                                </button>
                            ))}

                            {activeFilter === 'CUSTOM' && (
                                <div className="flex items-center gap-2 pl-3 border-l border-[var(--border-primary)] ml-1 animate-fadeIn">
                                    <input
                                        type="date"
                                        value={customDates.from}
                                        onChange={(e) => setCustomDates(prev => ({ ...prev, from: e.target.value }))}
                                        className="bg-transparent text-[10px] font-bold text-[var(--text-primary)] outline-none border-b border-[var(--accent-primary)]/30"
                                    />
                                    <span className="text-[9px] text-[var(--text-tertiary)] font-black">TO</span>
                                    <input
                                        type="date"
                                        value={customDates.to}
                                        onChange={(e) => setCustomDates(prev => ({ ...prev, to: e.target.value }))}
                                        className="bg-transparent text-[10px] font-bold text-[var(--text-primary)] outline-none border-b border-[var(--accent-primary)]/30"
                                    />
                                    <button
                                        onClick={fetchDashboardData}
                                        className="p-1.5 hover:bg-[var(--accent-primary)]/10 rounded-lg text-[var(--accent-primary)] transition-all"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => navigate('console')} className="px-5 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">Audit Logs</button>
                            <button onClick={() => navigate('requests')} className="px-5 py-2.5 bg-[var(--accent-primary)] text-white rounded-xl shadow-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">Approvals</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Fixed Message if needed, otherwise Cards forced row */}
            <div className="flex flex-wrap lg:flex-nowrap gap-4 px-2">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => navigate(card.path)}
                        className="flex-1 min-w-[200px] group bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-4 hover:border-[var(--accent-primary)] transition-all cursor-pointer relative overflow-hidden active:scale-[0.97] shadow-sm flex flex-col justify-between h-[150px]"
                    >
                        <div className="flex justify-between items-start relative z-10">
                            <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-tertiary)] opacity-60">Status</span>
                                <span className="text-[7px] font-black text-emerald-500 tracking-widest bg-emerald-500/5 px-1 py-0.5 rounded border border-emerald-500/10">ACTIVE</span>
                            </div>
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h3 className="text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">{card.title}</h3>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">{card.value}</span>
                                {card.trend > 0 && (
                                    <span className="text-[8px] font-black text-emerald-500 mb-1 px-1 py-0.5 bg-emerald-500/5 rounded border border-emerald-500/10">+{card.trend}%</span>
                                )}
                            </div>
                            <p className="text-[8px] font-bold text-[var(--text-secondary)] opacity-60 border-t border-[var(--border-primary)]/20 pt-2 mt-1 truncate">{card.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* CONVERSION VELOCITY */}
            <div className="px-2">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-3 bg-[var(--accent-primary)] rounded-full" />
                        <h2 className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest">Analytics Velocity • {activeFilter.replace('_', ' ')}</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {[
                            { label: 'Mining → Qualification', value: conversions.dm_to_lq, color: 'from-blue-500 to-indigo-500' },
                            { label: 'Qualification → Sales', value: conversions.lq_to_manager, color: 'from-purple-500 to-pink-500' },
                            { label: 'Sales → Revenue', value: conversions.manager_paid, color: 'from-amber-500 to-orange-500' }
                        ].map((stat, i) => (
                            <div key={i} className="flex-1 space-y-2">
                                <div className="flex justify-between items-end">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">{stat.label}</p>
                                    <p className="text-xs font-black text-[var(--text-primary)]">{stat.value}%</p>
                                </div>
                                <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden border border-[var(--border-primary)]/10">
                                    <div
                                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${stat.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MINI HALL OF FAME */}
            <div className="flex flex-col md:flex-row gap-4 px-2">
                {[
                    { label: 'Top Miner', user: leaderboards.dataMinors[0], metric: 'leadsCreated', unit: 'Leads', icon: '⛏️' },
                    { label: 'Top Qualifier', user: leaderboards.leadQualifiers[0], metric: 'leadsUpdated', unit: 'Verified', icon: '🎯' },
                    { label: 'Top Manager', user: leaderboards.managers[0], metric: 'paidCount', unit: 'Closed', icon: '💰' }
                ].map((hero, i) => hero.user && (
                    <div key={i} className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-3 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-sm border border-[var(--border-primary)]">
                            {hero.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[7px] font-black uppercase tracking-widest text-[var(--accent-primary)]">{hero.label}</p>
                            <h4 className="text-[10px] font-black text-[var(--text-primary)] truncate">{hero.user.name}</h4>
                            <p className="text-[8px] font-bold text-[var(--text-tertiary)] opacity-50">
                                {hero.user[hero.metric]} {hero.unit}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Footer */}
            <div className="px-5 py-2 text-[7px] font-black uppercase tracking-widest text-[var(--text-tertiary)] opacity-30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Global Intelligence Filtered: {activeFilter}
                </div>
                <span>Sync Node: {new Date().toLocaleTimeString()}</span>
            </div>
        </div>
    );
}
