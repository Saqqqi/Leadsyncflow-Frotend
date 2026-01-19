import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, subtitle, icon, trend, bgColor, onClick }) => (
    <div
        onClick={onClick}
        className={`rounded-3xl p-6 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden group cursor-pointer ${onClick ? 'active:scale-95' : ''}`}
        style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
        }}
    >
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-gradient-to-br ${bgColor} opacity-10 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150`}></div>

        <div className="flex items-start justify-between relative z-10">
            <div>
                <p className="text-xs font-black mb-1 tracking-widest uppercase opacity-60" style={{ color: 'var(--text-secondary)' }}>
                    {title}
                </p>
                <p className="text-4xl font-black mt-2 mb-1 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                    {value}
                </p>
                {subtitle && (
                    <p className="text-[10px] font-bold mt-2 flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
                        {trend && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex-shrink-0 ${trend > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                            </span>
                        )}
                        <span className="opacity-60">{subtitle}</span>
                    </p>
                )}
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${bgColor} transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg`}>
                <div className="text-white">
                    {icon}
                </div>
            </div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        dataMiners: { total: 0, pending: 0, trend: 15 },
        leadQualifiers: { total: 0, active: 0, trend: 8 },
        managers: { total: 0, deals: 0, trend: 12 }
    });

    // Mock fetching for now - real API calls can be added later
    useEffect(() => {
        // In a real app, you'd fetch from multiple endpoints here
        setStats({
            dataMiners: { total: 124, pending: 45, trend: 15 },
            leadQualifiers: { total: 86, active: 32, trend: -5 },
            managers: { total: 42, deals: 18, trend: 12 }
        });
    }, []);

    const sections = [
        {
            id: 'data-miner',
            title: 'Data Miner Hub',
            value: stats.dataMiners.total,
            subtitle: `${stats.dataMiners.pending} leads pending verification`,
            trend: stats.dataMiners.trend,
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            bgColor: 'from-blue-500 to-indigo-600',
            path: 'data-miner-leads'
        },
        {
            id: 'lead-qualifier',
            title: 'Lead Qualifiers',
            value: stats.leadQualifiers.total,
            subtitle: `${stats.leadQualifiers.active} active qualifying tasks`,
            trend: stats.leadQualifiers.trend,
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'from-purple-500 to-pink-600',
            path: 'lead-qualifier-leads'
        },
        {
            id: 'manager',
            title: 'Deal Managers',
            value: stats.managers.total,
            subtitle: `${stats.managers.deals} deals in final stages`,
            trend: stats.managers.trend,
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            bgColor: 'from-amber-500 to-orange-600',
            path: 'manager-leads'
        }
    ];

    return (
        <div className="space-y-12 animate-fadeIn max-w-[1600px] mx-auto p-4 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-[var(--text-primary)]">
                        Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-purple-600">Control Center</span>
                    </h1>
                    <p className="mt-4 text-[var(--text-secondary)] font-medium max-w-xl text-lg opacity-80 leading-relaxed">
                        Monitor the entire lead lifecycle from mining to closed deals. Manage departments and oversee performance.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-widest">System Live</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sections.map((section) => (
                    <StatCard
                        key={section.id}
                        title={section.title}
                        value={section.value}
                        subtitle={section.subtitle}
                        icon={section.icon}
                        trend={section.trend}
                        bgColor={section.bgColor}
                        onClick={() => navigate(section.path)}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Recent Activity or Quick Reports could go here */}
                <div className="bg-[var(--bg-secondary)] rounded-[40px] border border-[var(--border-primary)] p-8 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                    </div>
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </span>
                        Performance Overview
                    </h3>
                    <div className="space-y-6 relative z-10">
                        <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed">
                            Overview of conversions across all departments. The system shows a <span className="text-emerald-500 font-bold">12% increase</span> in efficiency since the last update.
                        </p>
                        <div className="pt-4 flex gap-4">
                            <button onClick={() => navigate('analytics')} className="px-6 py-3 rounded-2xl bg-[var(--accent-primary)] text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[var(--accent-primary)]/20">
                                View Detailed Analytics
                            </button>
                            <button className="px-6 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] font-black text-xs uppercase tracking-widest hover:bg-[var(--border-primary)] transition-all">
                                Export Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[40px] p-8 text-white relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                        <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a.997.997 0 00-.12-.47c1.183-.22 2.12-.124 2.12.47v3h-2zM4.12 14.53c-.118.1-.12.28-.12.47v3H2v-3c0-.594.937-.69 2.12-.47z" /></svg>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-4">Team Coordination</h3>
                        <p className="text-indigo-100 font-medium mb-8 leading-relaxed max-w-md">
                            Seamlessly move leads between departments. Every action is logged and tracked in real-time.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 opacity-60">Avg. Response Time</p>
                                <p className="text-2xl font-black mt-1">14.2 min</p>
                            </div>
                            <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 opacity-60">Conversion Rate</p>
                                <p className="text-2xl font-black mt-1">24.5%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
