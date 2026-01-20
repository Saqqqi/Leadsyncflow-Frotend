import React, { memo } from 'react';

const LeadFilters = memo(({
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    activeTab,
    setActiveTab,
    counts,
    customDate,
    setCustomDate
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Search & Tabs Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                <div className="relative group w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[var(--accent-primary)] transition-all shadow-sm group-hover:border-[var(--accent-primary)]/40"
                    />
                    <svg className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex bg-[var(--bg-secondary)]/50 rounded-xl p-1 border border-[var(--border-primary)] overflow-x-auto w-full sm:w-auto">
                    {['ALL', 'PENDING', 'IN_CONVERSATION', 'QUALIFIED', 'DEAD'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === tab
                                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            {tab === 'ALL' ? 'All' : tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Date Filters Row - Compact */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto bg-[var(--bg-secondary)]/30 p-1.5 rounded-2xl border border-[var(--border-primary)]/50">
                <div className="hidden lg:block px-2 text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Filter By:</div>

                <div className="flex items-center bg-[var(--bg-tertiary)]/20 rounded-xl p-0.5">
                    {[
                        { id: 'ALL', label: 'All' },
                        { id: 'TODAY', label: 'Today' },
                        { id: 'THIS_WEEK', label: 'Week' },
                        { id: 'THIS_MONTH', label: 'Month' }
                    ].map(preset => (
                        <button
                            key={preset.id}
                            disabled={!!customDate}
                            onClick={() => setDateFilter(preset.id)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${dateFilter === preset.id && !customDate
                                ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-sm'
                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30'
                                }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                <div className="h-4 w-[1px] bg-[var(--border-primary)] mx-1" />

                <div className="relative group">
                    <input
                        type="date"
                        value={customDate}
                        onChange={(e) => {
                            setCustomDate(e.target.value);
                            if (e.target.value) setDateFilter('ALL');
                        }}
                        className="bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] text-[9px] font-bold uppercase rounded-xl px-3 py-1.5 focus:outline-none focus:border-[var(--accent-primary)] transition-all cursor-pointer w-32"
                    />
                    {customDate && (
                        <button
                            onClick={() => setCustomDate('')}
                            className="absolute right-7 top-1/2 -translate-y-1/2 text-[var(--accent-error)]"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});

export default LeadFilters;
