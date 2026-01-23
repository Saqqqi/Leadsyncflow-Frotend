import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../api/admin.api';

export default function AdminConsole() {
    const [overview, setOverview] = useState(null);
    const [performance, setPerformance] = useState({
        dm: [],
        lq: [],
        manager: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, PERFORMANCE

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [ov, dmPerf, lqPerf, mgPerf] = await Promise.all([
                adminAPI.getOverview(),
                adminAPI.getPerformance('Data Minors'),
                adminAPI.getPerformance('Lead Qualifiers'),
                adminAPI.getPerformance('Manager')
            ]);
            console.log(dmPerf, lqPerf, mgPerf);
            if (ov.success) setOverview(ov);
            setPerformance({
                dm: dmPerf.rows || [],
                lq: lqPerf.rows || [],
                manager: mgPerf.rows || []
            });
        } catch (error) {
            console.error('Audit Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    if (loading && !overview) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
        </div>
    );

    const { totals, conversions } = overview || {};

    return (
        <div className="p-6 md:p-10 space-y-12 max-w-[1800px] mx-auto animate-fadeIn min-h-screen">
            {/* Header / Audit Control */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-10 rounded-[45px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 opacity-5 rounded-full blur-[150px] -mr-64 -mt-64" />

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h1 className="text-5xl font-black text-[var(--text-primary)] tracking-tighter">
                            System <span className="text-[var(--accent-primary)]">Audit Hub</span>
                        </h1>
                    </div>
                    <p className="text-[var(--text-secondary)] font-bold text-lg">Full-stack diagnostics and performance monitoring</p>
                </div>

                <div className="flex p-2 bg-[var(--bg-tertiary)] rounded-[25px] border border-[var(--border-primary)] relative z-10">
                    <button
                        onClick={() => setActiveTab('OVERVIEW')}
                        className={`px-12 py-4 rounded-[20px] text-sm font-black transition-all ${activeTab === 'OVERVIEW' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-2xl scale-105' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        System Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('PERFORMANCE')}
                        className={`px-12 py-4 rounded-[20px] text-sm font-black transition-all ${activeTab === 'PERFORMANCE' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-2xl scale-105' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        Full Performance Audit
                    </button>
                </div>
            </div>

            {activeTab === 'OVERVIEW' ? (
                /* SYSTEM OVERVIEW TAB */
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Global Stats */}
                    <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        {[
                            { label: 'Total Ingested', value: totals?.totalLeads, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/10' },
                            { label: 'Qualified (LQ)', value: totals?.qualifiedCount, color: 'text-purple-500', bg: 'bg-purple-500/5', border: 'border-purple-500/10' },
                            { label: 'Revenue (PAID)', value: totals?.paidCount, color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
                            { label: 'Pending/Unpaid', value: totals?.unpaidCount, color: 'text-rose-500', bg: 'bg-rose-500/5', border: 'border-rose-500/10' }
                        ].map((item, i) => (
                            <div key={i} className={`p-10 rounded-[40px] border ${item.border} ${item.bg} shadow-xl hover:-translate-y-2 transition-all duration-300`}>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-4">{item.label}</p>
                                <p className={`text-6xl font-black tracking-tighter ${item.color}`}>{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Funnel Section */}
                    <div className="xl:col-span-12 bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-12 rounded-[50px] shadow-2xl">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-2 h-8 bg-[var(--accent-primary)] rounded-full" />
                            <h2 className="text-3xl font-black text-[var(--text-primary)]">Conversion Intelligence</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                            {[
                                { label: 'Miners to Qualifiers', pct: conversions?.dm_to_lq, icon: '⛏️', sub: 'Input processing efficiency' },
                                { label: 'Qualifiers to Managers', pct: conversions?.lq_to_manager, icon: '✅', sub: 'Lead quality validation' },
                                { label: 'Managers to Paid', pct: conversions?.manager_paid, icon: '💰', sub: 'Sales closure rate' }
                            ].map((step, i) => (
                                <div key={i} className="flex flex-col items-center text-center space-y-6">
                                    <div className="w-24 h-24 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center text-4xl shadow-inner">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <p className="font-black text-xl text-[var(--text-primary)]">{step.label}</p>
                                        <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">{step.sub}</p>
                                    </div>
                                    <div className="w-full relative">
                                        <div className="text-5xl font-black text-[var(--accent-primary)] mb-4">{step.pct}%</div>
                                        <div className="h-4 bg-[var(--bg-tertiary)] rounded-full overflow-hidden border border-[var(--border-primary)]">
                                            <div
                                                className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-purple-600 rounded-full transition-all duration-1000"
                                                style={{ width: `${step.pct}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* FULL PERFORMANCE AUDIT TAB */
                <div className="space-y-16">
                    {/* Role Based Sections */}
                    {[
                        { title: 'Data Minors Audit', color: 'blue', data: performance.dm, metricLabel: 'Leads Processed' },
                        { title: 'Lead Qualifiers Audit', color: 'purple', data: performance.lq, metricLabel: 'Verification Volume' },
                        { title: 'Managers Revenue Audit', color: 'emerald', data: performance.manager, metricLabel: 'Deal Conversions' }
                    ].map((section, idx) => (
                        <div key={idx} className="space-y-8 animate-slideUp" style={{ animationDelay: `${idx * 150}ms` }}>
                            <div className="flex items-center justify-between px-6">
                                <h3 className={`text-2xl font-black text-${section.color}-500 flex items-center gap-4`}>
                                    <div className={`w-3 h-3 rounded-full bg-${section.color}-500 shadow-[0_0_15px_rgba(var(--color-rgb),0.5)]`} />
                                    {section.title}
                                </h3>
                                <span className="text-xs font-black text-[var(--text-tertiary)] uppercase tracking-widest">
                                    {section.data.length} Total Contributors
                                </span>
                            </div>

                            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[50px] shadow-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-primary)]">
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Employee</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Status</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Email</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">{section.metricLabel}</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] text-right">Activity Level</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border-primary)]/50">
                                            {section.data.map((user) => (
                                                <tr key={user.userId} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-2xl bg-${section.color}-500/10 flex items-center justify-center font-black text-${section.color}-500 border border-${section.color}-500/20 shadow-lg`}>
                                                                {user.name?.[0]}
                                                            </div>
                                                            <div className="font-bold text-[var(--text-primary)]">{user.name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm font-medium text-[var(--text-secondary)]">{user.email}</td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-end gap-2">
                                                            <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">
                                                                {user.metrics?.processed || 0}
                                                            </span>
                                                            <span className="text-[10px] font-black text-[var(--text-tertiary)] uppercase mb-1">Items</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex justify-end gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-1.5 h-6 rounded-full ${i < Math.min(5, Math.ceil((user.metrics?.processed || 0) / 10))
                                                                        ? `bg-${section.color}-500`
                                                                        : 'bg-[var(--bg-tertiary)]'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {section.data.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="py-16 text-center text-[var(--text-tertiary)] font-bold italic">No records found for this department</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Audit Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-6 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[35px] shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Live Audit Stream Synchronized</p>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-[10px] font-black text-[var(--text-tertiary)]">LAST UPDATE: {new Date().toLocaleString()}</div>
                    <button onClick={fetchAllData} className="px-8 py-2.5 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all rounded-xl border border-[var(--border-primary)] text-[10px] font-black uppercase tracking-widest">
                        Trigger Full Re-Scan
                    </button>
                </div>
            </div>
        </div>
    );
}
