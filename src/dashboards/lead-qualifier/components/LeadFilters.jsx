import React, { memo } from 'react';

const LeadFilters = memo(({
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    activeTab,
    setActiveTab,
    counts
}) => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
                <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Lead Pipeline</h1>
                <p className="text-[var(--text-secondary)] text-sm font-medium mt-1">Efficiently manage and qualify your assigned leads</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                {/* Search Field */}
                <div className="relative flex-1 sm:w-80 group">
                    <input
                        type="text"
                        placeholder="Find leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm rounded-2xl px-5 py-3 pl-12 focus:outline-none focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary)]/10 transition-all shadow-xl shadow-black/5 group-hover:border-[var(--accent-primary)]/40"
                    />
                    <svg className="absolute left-4 top-3.5 h-5 w-5 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Date Filter Dropdown */}
                <div className="relative w-full sm:w-48 group">
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full appearance-none bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-black uppercase tracking-widest rounded-2xl px-5 py-3 focus:outline-none focus:border-[var(--accent-primary)] transition-all cursor-pointer group-hover:border-[var(--accent-primary)]/40 pr-10 shadow-lg shadow-black/5"
                    >
                        <option value="ALL">All Dates ({counts.ALL})</option>
                        <option value="TODAY">Today ({counts.TODAY})</option>
                        <option value="THIS_WEEK">This Week ({counts.THIS_WEEK})</option>
                        <option value="PREVIOUS_WEEKS">Previous Weeks ({counts.PREVIOUS_WEEKS})</option>
                        <option value="THIS_MONTH">This Month ({counts.THIS_MONTH})</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-[var(--bg-secondary)] rounded-2xl p-1 shadow-xl shadow-black/5 border border-[var(--border-primary)] overflow-x-auto">
                    {['ALL', 'PENDING', 'IN_CONVERSATION', 'QUALIFIED', 'DEAD'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                                ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20'
                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/30'
                                }`}
                        >
                            {tab === 'ALL' ? 'All Leads' : tab.replace('_', ' ')} ({counts[tab]})
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default LeadFilters;
