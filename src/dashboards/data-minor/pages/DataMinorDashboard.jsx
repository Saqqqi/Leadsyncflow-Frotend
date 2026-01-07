import React from 'react';

const DataMinorDashboard = () => {
    const employees = [
        { id: 1, name: 'John Doe', designation: 'Data Miner', dailyLeads: 25, progress: 80 },
        { id: 2, name: 'Jane Smith', designation: 'Sr. Data Miner', dailyLeads: 40, progress: 95 },
        { id: 3, name: 'Mike Ross', designation: 'Jr. Data Miner', dailyLeads: 15, progress: 60 },
        { id: 4, name: 'Rachel Zane', designation: 'Data Miner', dailyLeads: 30, progress: 85 },
    ];

    const stats = [
        {
            title: 'Monthly Leads',
            count: '1,250',
            trend: '+12%',
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10'
        },
        {
            title: 'Weekly Leads',
            count: '320',
            trend: '+8%',
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-gradient-to-br from-purple-500/10 to-pink-600/10'
        },
        {
            title: 'Today Leads',
            count: '45',
            trend: '+5%',
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'from-emerald-400 to-cyan-500',
            bgColor: 'bg-gradient-to-br from-emerald-400/10 to-cyan-500/10'
        }
    ];

    return (
        <div className="p-3 sm:p-4 md:p-6 space-y-6 md:space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Dashboard Overview
                </h1>
                <p className="text-xs sm:text-sm mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Track your lead generation performance across time periods.
                </p>
            </div>

            {/* Stats Cards - Single Row */}
            <div className="flex flex-row gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="flex-1 min-w-[150px] md:min-w-0 p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden group shadow-sm bg-opacity-50 backdrop-blur-sm"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-primary)',
                        }}
                    >
                        {/* Decorative Background Glow */}
                        <div className={`absolute -right-4 -top-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>

                        {/* Card Content */}
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            {/* Top Row: Icon and Trend */}
                            <div className="flex items-center justify-between gap-2">
                                <div className={`p-2 sm:p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md group-hover:scale-105 transition-transform shrink-0`}>
                                    {stat.icon}
                                </div>
                                <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black tracking-widest flex items-center gap-0.5 border border-emerald-500/20 shrink-0">
                                    <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                    </svg>
                                    {stat.trend}
                                </div>
                            </div>

                            {/* middle Row: Count and Title */}
                            <div className="mt-3 sm:mt-5">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter truncate" style={{ color: 'var(--text-primary)' }}>
                                    {stat.count}
                                </h3>
                                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-60 truncate" style={{ color: 'var(--text-secondary)' }}>
                                    {stat.title}
                                </p>
                            </div>

                            {/* Bottom Row: Status Indicator */}
                            <div className="mt-2 sm:mt-4 flex items-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
                                Live
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Employee Table */}
            <div className="rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm border overflow-hidden"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>

                {/* Table Header */}
                <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-7 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    style={{ borderColor: 'var(--border-primary)' }}>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Team Performance</h2>
                        <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--text-secondary)' }}>Real-time contribution analytics</p>
                    </div>
                    <button className="text-sm font-black flex items-center gap-2 group p-2 pr-3 sm:pr-4 rounded-xl sm:rounded-2xl transition-all hover:bg-white/5 self-start sm:self-auto" style={{ color: 'var(--accent-primary)' }}>
                        <span className="bg-blue-500/10 p-1.5 sm:p-2 rounded-lg sm:rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 2v-6m-8-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                            </svg>
                        </span>
                        Full View
                    </button>
                </div>

                {/* Table Body */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]" style={{ color: 'var(--text-tertiary)' }}>Miner Profile</th>
                                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]" style={{ color: 'var(--text-tertiary)' }}>Tier</th>
                                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]" style={{ color: 'var(--text-tertiary)' }}>Output</th>
                                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]" style={{ color: 'var(--text-tertiary)' }}>Efficiency</th>
                                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-right" style={{ color: 'var(--text-tertiary)' }}>Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                            {employees.map((emp) => (
                                <tr key={emp.id} className="transition-all hover:bg-white/5 group" style={{ backgroundColor: 'var(--bg-primary)' }}>
                                    {/* Profile Column */}
                                    <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg sm:shadow-xl mr-3 sm:mr-4 md:mr-5 group-hover:scale-105 transition-transform text-sm sm:text-base">
                                                {emp.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <span className="font-bold text-sm sm:text-base md:text-lg block tracking-tight" style={{ color: 'var(--text-primary)' }}>{emp.name}</span>
                                                <span className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-500/80 tracking-widest">Active System</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Tier Column */}
                                    <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
                                        <span className="px-2 sm:px-3 md:px-4 py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                            {emp.designation}
                                        </span>
                                    </td>

                                    {/* Output Column */}
                                    <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg sm:text-xl md:text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{emp.dailyLeads}</span>
                                            <span className="text-[9px] sm:text-[10px] font-bold opacity-50 uppercase" style={{ color: 'var(--text-tertiary)' }}>Leads</span>
                                        </div>
                                    </td>

                                    {/* Efficiency Column */}
                                    <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
                                        <div className="w-full max-w-[120px] sm:max-w-[140px]">
                                            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Performance</span>
                                                <span className="text-xs font-black" style={{ color: 'var(--accent-primary)' }}>{emp.progress}%</span>
                                            </div>
                                            <div className="w-full rounded-full h-2 sm:h-3 p-0.5 sm:p-1 flex items-center shadow-inner" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 relative shadow-lg"
                                                    style={{ width: `${emp.progress}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Operations Column */}
                                    <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-right">
                                        <button className="p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all hover:bg-blue-500/10 hover:text-blue-500" style={{ color: 'var(--text-tertiary)' }}>
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataMinorDashboard;