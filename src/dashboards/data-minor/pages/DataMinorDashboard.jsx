import React, { useState, useEffect } from 'react';
import { dataMinorAPI } from '../../../api/data-minor';
import tokenManager from '../../../utils/tokenManager';

const DataMinorDashboard = () => {
    const [production, setProduction] = useState({ today: 0, monthly: 0 });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = tokenManager.getUser();
        setUser(currentUser);

        const fetchStats = async () => {
            try {
                const response = await dataMinorAPI.getMyStats();
                if (response.success) {
                    setProduction({
                        today: response.todayCount,
                        monthly: response.monthCount
                    });
                }
            } catch (error) {
                console.error('Production sync failed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const dailyTarget = 50;
    const efficiency = Math.min(Math.round((production.today / dailyTarget) * 100), 100);

    return (
        <div className="w-full p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
            {/* Full Width Container */}
            <div className="w-full space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center pb-2 px-1">
                    <h1 className="text-xl font-black tracking-tight flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                        DataMinor Dashboard
                    </h1>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                {/* Dashboard Grid - Expanded Width */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                    {/* 1. Identity Segment */}
                    <div className="lg:col-span-3 p-5 rounded-2xl border flex items-center gap-4 group transition-all hover:bg-white/5"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                        <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform">
                            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-black tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
                                {user?.name || 'Miner'}
                            </h2>
                            <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest truncate">
                                {user?.role || 'Data Miner'}
                            </p>
                        </div>
                    </div>

                    {/* 2. Combined Production Metrics */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        {/* Today Output */}
                        <div className="p-5 rounded-2xl border flex flex-col justify-between transition-all hover:bg-white/5"
                            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[8px] font-black opacity-40 uppercase tracking-widest">Today</p>
                                <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>{production.today}</span>
                                <span className="text-[8px] font-black text-emerald-500 uppercase">Leads</span>
                            </div>
                        </div>

                        {/* Monthly Output */}
                        <div className="p-5 rounded-2xl border flex flex-col justify-between transition-all hover:bg-white/5"
                            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[8px] font-black opacity-40 uppercase tracking-widest">Monthly</p>
                                <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>{production.monthly}</span>
                                <span className="text-[8px] font-black text-blue-500 uppercase">Total</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Efficiency Status */}
                    <div className="lg:col-span-4 p-5 rounded-2xl border transition-all hover:bg-white/5"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">Performance Rate</p>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${efficiency > 80 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                {efficiency}%
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${efficiency > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    style={{ width: `${efficiency}%` }}
                                >
                                    <div className="w-full h-full bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-[8px] font-bold opacity-30 mt-1 uppercase tracking-tighter">
                                <span>Output: {production.today}</span>
                                <span>Relay Goal: {dailyTarget}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Info Advisory */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <p className="text-[9px] font-bold opacity-50 tracking-tight" style={{ color: 'var(--text-secondary)' }}>
                        All metrics are synced in real-time. Minimum performance threshold for incentives is <span className="text-blue-500">85% daily efficiency</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DataMinorDashboard;