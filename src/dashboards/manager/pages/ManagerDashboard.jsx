import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../../api/manager.api';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, subValue, icon, trend, colorClass }) => (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 rounded-[28px] hover:border-[var(--accent-primary)]/40 transition-all duration-500 group shadow-xl hover:shadow-2xl">
        <div className="flex justify-between items-start mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${colorClass}`}>
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            {trend && (
                <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {trend.isPositive ? '↑' : '↓'} {trend.value}%
                </div>
            )}
        </div>
        <div className="space-y-0.5">
            <h3 className="text-[var(--text-tertiary)] text-[9px] font-black uppercase tracking-[0.2em] truncate">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{value}</span>
                {subValue && <span className="text-[10px] font-bold text-[var(--text-tertiary)] opacity-60 truncate">{subValue}</span>}
            </div>
        </div>
    </div>
);

export default function ManagerDashboard() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await managerAPI.getMyLeads({ status: 'all', dashboard: true });
            console.log(response);
            if (response.success) {
                setLeads(response.leads || []);
            }
        } catch (err) {
            console.error("Dashboard fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            title: "Decision Required",
            value: leads.filter(l => l.stage === 'MANAGER').length,
            subValue: "Pending Review",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            colorClass: "bg-amber-500/10 text-amber-500"
        },
        {
            title: "Total Approved",
            value: leads.filter(l => l.stage === 'COMPLETED' || l.stage === 'DONE' || l.stage === 'MANAGER_APPROVED').length,
            subValue: "Accepted Leads",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            colorClass: "bg-emerald-500/10 text-emerald-500"
        },
        {
            title: "Rejected Leads",
            value: leads.filter(l => l.stage === 'REJECTED').length,
            subValue: "Declined Opportunities",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            colorClass: "bg-rose-500/10 text-rose-500"
        },
        {
            title: "Unpaid Pipeline",
            value: leads.filter(l => (l.stage === 'COMPLETED' || l.stage === 'DONE' || l.stage === 'MANAGER_APPROVED') && l.status === 'UNPAID').length,
            subValue: "Waiting Status",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
            colorClass: "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
        }
    ];

    const recentLeads = leads.slice(0, 5);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-10 animate-fadeIn max-w-[1600px] mx-auto px-6 py-4">
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Manager Command Center</h1>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px] font-black uppercase tracking-widest border border-[var(--accent-primary)]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                            Active Session
                        </span>
                        <p className="text-[var(--text-tertiary)] text-xs font-bold opacity-60">Revenue & Pipeline Intelligence v2.0</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link to="/gds/manager/new-leads" className="px-6 py-3 rounded-2xl bg-[var(--accent-primary)] text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[var(--accent-primary)]/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Take Decisions
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pipeline Overview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Recent Opportunities</h2>
                        <Link to="/gds/manager/history" className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-widest hover:underline">View History</Link>
                    </div>

                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--bg-tertiary)]/30 border-b border-[var(--border-primary)]/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Opportunity</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Industry</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest text-center">Stage</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest text-right">Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-primary)]/30">
                                    {recentLeads.map((lead) => (
                                        <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">{lead.name}</span>
                                                    <span className="text-[10px] font-medium text-[var(--text-tertiary)]">{lead.emails?.[0]?.value || 'No Email'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 rounded-lg bg-[var(--bg-tertiary)] text-[10px] font-bold text-[var(--text-secondary)] border border-[var(--border-primary)]/50">
                                                    {lead.industry || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${(lead.stage === 'COMPLETED' || lead.stage === 'DONE' || lead.stage === 'MANAGER_APPROVED') ? 'bg-emerald-500/10 text-emerald-500' :
                                                    lead.stage === 'REJECTED' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                    {lead.stage === 'MANAGER' ? 'PENDING' : (lead.stage === 'COMPLETED' || lead.stage === 'DONE') ? 'COMPLETED' : lead.stage.replace('MANAGER_', '')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`text-[10px] font-black ${lead.status === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>{lead.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Performance & Actions */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight px-4">Performance Insights</h2>
                    <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]/50 border border-[var(--border-primary)] rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest opacity-60">Conversion Rate</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-3 bg-black/30 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-indigo-500 w-[68%] relative">
                                            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                                        </div>
                                    </div>
                                    <span className="text-lg font-black text-[var(--text-primary)]">68%</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest opacity-60">Quota Progress</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-3 bg-black/30 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[42%] relative">
                                            <div className="absolute inset-0 bg-white/10 animate-shimmer" />
                                        </div>
                                    </div>
                                    <span className="text-lg font-black text-[var(--text-primary)]">42%</span>
                                </div>
                            </div>

                            <div className="pt-4 grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-3xl bg-black/20 border border-white/5 text-center">
                                    <span className="block text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1">Avg Deal</span>
                                    <span className="text-lg font-black text-[var(--text-primary)]">$1.2k</span>
                                </div>
                                <div className="p-4 rounded-3xl bg-black/20 border border-white/5 text-center">
                                    <span className="block text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1">Velocity</span>
                                    <span className="text-lg font-black text-[var(--text-primary)]">4.2d</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Gradient Blob */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    </div>

                    <div className="bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 rounded-[40px] p-8 space-y-4">
                        <h3 className="text-xs font-black text-[var(--accent-primary)] uppercase tracking-widest">Manager Tip</h3>
                        <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed opacity-80">
                            Closing priority should be given to Stark Industries this week. Data metrics suggest a 92% likelihood of conversion.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
