import React, { useState } from 'react';
import dataMinorAPI from '../../../api/data-minor';

const VerifierDashboard = () => {
    // Static data for design purposes
    const stats = [
        {
            label: 'Pending Verification',
            value: '142',
            trend: '+12%',
            trendUp: true,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'var(--accent-warning)',
            bg: 'var(--accent-warning)',
        },
        {
            label: 'Verified Today',
            value: '48',
            trend: '+5%',
            trendUp: true,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'var(--accent-success)',
            bg: 'var(--accent-success)',
        },
        {
            label: 'Active Leads',
            value: '856',
            trend: '+24%',
            trendUp: true,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: 'var(--accent-primary)',
            bg: 'var(--accent-primary)',
        },
        {
            label: 'Bounced / Dead',
            value: '23',
            trend: '-2%',
            trendUp: false,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            ),
            color: 'var(--accent-error)',
            bg: 'var(--accent-error)',
        },
    ];

    const [isProcessing, setIsProcessing] = useState(false);

    const handleProcessAllLeads = async () => {
        if (!window.confirm("Are you sure you want to attempt to move ALL verified leads to Lead Qualifiers?")) return;

        setIsProcessing(true);
        try {
            // 1. Fetch leads (max 100 for batch processing)
            const response = await dataMinorAPI.getVerifierLeads(100, 0);

            if (response.success && response.leads) {
                const leads = response.leads;
                let movedCount = 0;
                let errorCount = 0;

                // 2. Process each lead
                const promises = leads.map(async (lead) => {
                    // Check if lead has any verified emails (not PENDING)
                    const hasVerifiedEmail = lead.emails && lead.emails.some(e => e.status && e.status !== 'PENDING');

                    if (hasVerifiedEmail) {
                        try {
                            await dataMinorAPI.moveLeadToLeadQualifiers(lead._id);
                            movedCount++;
                        } catch (err) {
                            console.error(`Failed to move lead ${lead._id}`, err);
                            errorCount++;
                        }
                    } else {
                        // Lead has no verified emails, skip
                    }
                });

                await Promise.all(promises);

                alert(`Process Complete:\nMoved: ${movedCount}\nErrors/Skipped: ${errorCount}`);
            }
        } catch (error) {
            console.error('Batch process failed:', error);
            alert('Failed to process leads');
        } finally {
            setIsProcessing(false);
        }
    };

    const recentActivity = [
        { id: 1, action: 'Verified Email', subject: 'sarah.k@techcorp.io', status: 'ACTIVE', time: '2 mins ago' },
        { id: 2, action: 'Marked Bounced', subject: 'invalid.user@domain.net', status: 'BOUNCED', time: '15 mins ago' },
        { id: 3, action: 'Verified Email', subject: 'j.smith@innovate.com', status: 'ACTIVE', time: '32 mins ago' },
        { id: 4, action: 'Marked Dead', subject: 'old.contact@legacy.org', status: 'DEAD', time: '1 hour ago' },
        { id: 5, action: 'Verified Email', subject: 'contact@startuplab.co', status: 'ACTIVE', time: '2 hours ago' },
    ];

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8 min-h-screen animate-in fade-in slide-in-from-bottom-5 duration-700"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
                        Dashboard Overview
                    </h1>
                    <p className="text-sm font-medium mt-1 opacity-80" style={{ color: 'var(--text-secondary)' }}>
                        Welcome back! Here's your verification performance.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleProcessAllLeads}
                        disabled={isProcessing}
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                        style={{ background: 'var(--accent-primary)' }}
                    >
                        {isProcessing ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        )}
                        <span>{isProcessing ? 'Processing...' : 'Move All Ready'}</span>
                    </button>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full border hidden sm:inline-block"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}>
                        Last Updated: Just now
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((stat, index) => (
                    <div key={index}
                        className="group relative overflow-hidden rounded-xl border p-4 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl cursor-default"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-primary)'
                        }}>

                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 rounded-lg transition-colors group-hover:bg-[var(--bg-primary)]"
                                style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                                {React.cloneElement(stat.icon, { className: "w-4 h-4" })}
                            </div>
                            <div className={`px-2 py-1 rounded-[6px] text-[10px] font-bold flex items-center gap-1 ${stat.trendUp ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                                <span>{stat.trendUp ? '↑' : '↓'}</span>
                                {stat.trend}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                                {stat.value}
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                                {stat.label}
                            </p>
                        </div>

                        {/* Decorative bottom line */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                            style={{ backgroundColor: stat.color }}></div>
                    </div>
                ))}
            </div>

            {/* Content Split: Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content Area (Placeholder for Chart/Graph) */}
                <div className="lg:col-span-2 rounded-2xl border p-6 flex flex-col"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Verification Activity</h3>
                        <select className="text-xs font-bold bg-transparent border-0 outline-none cursor-pointer"
                            style={{ color: 'var(--text-secondary)' }}>
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>

                    {/* Visual Placeholder for Graph */}
                    <div className="flex-1 flex items-end justify-between gap-2 h-64 px-4 pb-2 border-b border-dashed"
                        style={{ borderColor: 'var(--border-primary)' }}>
                        {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                            <div key={i} className="w-full relative group cursor-pointer">
                                <div className="absolute bottom-0 inset-x-1 rounded-t-lg transition-all duration-500 hover:opacity-100 opacity-80"
                                    style={{
                                        height: `${height}%`,
                                        backgroundColor: i === 5 ? 'var(--accent-primary)' : 'var(--bg-tertiary)'
                                    }}>
                                </div>
                                <div className="absolute -top-8 inset-x-0 text-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ color: 'var(--text-primary)' }}>
                                    {height}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-bold uppercase tracking-wide opacity-50"
                        style={{ color: 'var(--text-secondary)' }}>
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="rounded-2xl border p-6"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                    <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--text-primary)' }}>Recent Actions</h3>

                    <div className="space-y-6">
                        {recentActivity.map((item) => (
                            <div key={item.id} className="flex gap-4 relative">
                                {/* Timeline Line */}
                                <div className="absolute left-2 top-8 bottom-0 w-0.5 -ml-px bg-gradient-to-b from-[var(--border-primary)] to-transparent opacity-50 last:hidden"></div>

                                <div className={`relative z-10 w-4 h-4 rounded-full border-2 mt-1.5 bg-[var(--bg-secondary)] flex-shrink-0`}
                                    style={{
                                        borderColor: item.status === 'ACTIVE' ? 'var(--accent-success)' :
                                            item.status === 'BOUNCED' ? 'var(--accent-error)' : 'var(--text-secondary)'
                                    }}>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                            {item.action}
                                        </p>
                                        <span className="text-[10px] font-medium whitespace-nowrap opacity-60"
                                            style={{ color: 'var(--text-secondary)' }}>
                                            {item.time}
                                        </span>
                                    </div>
                                    <p className="text-xs truncate opacity-70 mt-0.5 font-mono" style={{ color: 'var(--text-secondary)' }}>
                                        {item.subject}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[var(--bg-tertiary)]"
                        style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}>
                        View All History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifierDashboard;
