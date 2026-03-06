import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../../api/manager.api';
import { Link } from 'react-router-dom';
import SharedLoader from '../../../components/SharedLoader';

const StatCard = ({ title, value, subValue, icon, trend, colorClass, onClick }) => (
    <div
        onClick={onClick}
        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-4 rounded-[24px] hover:border-[var(--accent-primary)]/40 transition-all duration-500 group shadow-lg hover:shadow-xl cursor-pointer"
    >
        <div className="flex justify-between items-start mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${colorClass}`}>
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            {trend && (
                <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
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

const QuickActionCard = ({ to, icon, title, description, colorClass }) => (
    <Link
        to={to}
        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 rounded-[24px] hover:border-[var(--accent-primary)]/40 transition-all duration-500 group shadow-lg hover:shadow-xl flex items-start gap-4"
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${colorClass}`}>
            {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <div className="flex-1">
            <h3 className="text-sm font-black text-[var(--text-primary)] mb-1">{title}</h3>
            <p className="text-xs text-[var(--text-tertiary)] font-medium opacity-70">{description}</p>
        </div>
        <svg className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </Link>
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
            title: "DECISION REQUIRED",
            value: leads.filter(l => l.stage === 'MANAGER').length,
            subValue: "Pending Review",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            colorClass: "bg-amber-500/10 text-amber-500",
            onClick: () => window.location.href = '/gds/manager/new-leads'
        },
        {
            title: "TOTAL APPROVED",
            value: leads.filter(l => l.stage === 'COMPLETED' || l.stage === 'DONE' || l.stage === 'MANAGER_APPROVED').length,
            subValue: "Accepted Leads",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            colorClass: "bg-emerald-500/10 text-emerald-500",
            onClick: () => window.location.href = '/gds/manager/approved'
        },
        {
            title: "REJECTED LEADS",
            value: leads.filter(l => l.stage === 'REJECTED').length,
            subValue: "Declined Opportunities",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            colorClass: "bg-rose-500/10 text-rose-500",
            onClick: () => window.location.href = '/gds/manager/rejected'
        },
        {
            title: "UNPAID PIPELINE",
            value: leads.filter(l => (l.stage === 'COMPLETED' || l.stage === 'DONE' || l.stage === 'MANAGER_APPROVED') && l.status === 'UNPAID').length,
            subValue: "Waiting Status",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
            colorClass: "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]",
            onClick: () => window.location.href = '/gds/manager/unpaid'
        },
        {
            title: "TOTAL LEADS",
            value: leads.length,
            subValue: "All Time",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
            colorClass: "bg-blue-500/10 text-blue-500",
            onClick: () => window.location.href = '/gds/manager/all-leads'
        },
        {
            title: "CONVERSION RATE",
            value: leads.length ? Math.round((leads.filter(l => l.stage === 'COMPLETED' || l.stage === 'DONE').length / leads.length) * 100) : 0,
            subValue: "%",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
            colorClass: "bg-purple-500/10 text-purple-500",
            trend: { isPositive: true, value: 12 },
            onClick: () => window.location.href = '/gds/manager/analytics'
        },
        {
            title: "AVG DEAL SIZE",
            value: "$2.4k",
            subValue: "Per Deal",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            colorClass: "bg-indigo-500/10 text-indigo-500",
            onClick: () => window.location.href = '/gds/manager/analytics'
        },
        {
            title: "RESPONSE TIME",
            value: "4.2h",
            subValue: "Avg. First Response",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            colorClass: "bg-cyan-500/10 text-cyan-500",
            trend: { isPositive: false, value: 8 },
            onClick: () => window.location.href = '/gds/manager/analytics'
        }
    ];

    const quickActions = [
        {
            to: "/gds/manager/new-leads",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            title: "Review Pending Leads",
            description: `${leads.filter(l => l.stage === 'MANAGER').length} leads waiting for decision`,
            colorClass: "bg-amber-500/10 text-amber-500"
        },
        {
            to: "/gds/manager/unpaid",
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
            title: "Update Unpaid Leads",
            description: `${leads.filter(l => (l.stage === 'COMPLETED' || l.stage === 'DONE') && l.status === 'UNPAID').length} leads need payment update`,
            colorClass: "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
        }
    ];

    if (loading) return <SharedLoader />;

    return (
        <div className="space-y-8 animate-fadeIn max-w-[1600px] mx-auto px-6 py-8">
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Manager Command Center</h1>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px] font-black uppercase tracking-widest border border-[var(--accent-primary)]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                            LIVE
                        </span>
                    </div>
                    <p className="text-[var(--text-tertiary)] text-sm font-medium opacity-60">Real-time performance metrics and lead intelligence</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/gds/manager/new-leads" className="px-8 py-4 rounded-2xl bg-[var(--accent-primary)] text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-[var(--accent-primary)]/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Take Decisions
                    </Link>
                </div>
            </div>

            {/* Stats Grid - Responsive layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActions.map((action, i) => <QuickActionCard key={i} {...action} />)}
            </div>

            {/* Summary Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)] rounded-[20px] p-4">
                    <span className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1">Today's Decisions</span>
                    <span className="text-2xl font-black text-[var(--text-primary)]">8</span>
                </div>
                <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)] rounded-[20px] p-4">
                    <span className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1">This Week</span>
                    <span className="text-2xl font-black text-[var(--text-primary)]">24</span>
                </div>
                <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)] rounded-[20px] p-4">
                    <span className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1">This Month</span>
                    <span className="text-2xl font-black text-[var(--text-primary)]">86</span>
                </div>
                <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)] rounded-[20px] p-4">
                    <span className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1">Success Rate</span>
                    <span className="text-2xl font-black text-emerald-500">78%</span>
                </div>
            </div>
        </div>
    );
}