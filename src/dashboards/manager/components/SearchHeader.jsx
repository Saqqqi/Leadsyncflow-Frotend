import React from 'react';

const SearchHeader = ({
    title = "Manager Inbox",
    subtitle = "Review and manage leads",
    searchTerm,
    onSearchChange,
    onRefresh,
    loading,
    icon = (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" />
        </svg>
    )
}) => {
    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-4 md:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)] opacity-5 rounded-full blur-[100px] -mr-32 -mt-32" />

            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 xl:gap-6 relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full xl:w-auto">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-[var(--accent-primary)]/10 rounded-2xl text-[var(--accent-primary)] shadow-inner">
                            {icon}
                        </div>
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight">{title}</h1>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] opacity-60">{subtitle}</p>
                            </div>
                            {onRefresh && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onRefresh();
                                    }}
                                    className="flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-tertiary)]/40 border border-[var(--border-primary)] rounded-xl text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white hover:border-[var(--accent-primary)] transition-all shadow-sm group cursor-pointer"
                                    title="Refresh"
                                >
                                    <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''} text-[var(--accent-primary)] group-hover:text-white transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-wider group-hover:text-white transition-all">
                                        Refresh
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-[var(--bg-tertiary)]/40 border border-[var(--border-primary)] rounded-xl pl-9 pr-8 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] opacity-70 focus:opacity-100 focus:outline-none focus:border-[var(--accent-primary)]/50 transition-all font-medium"
                        />
                        <svg className="absolute left-3 top-3 h-4 w-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {searchTerm && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-2 top-3 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchHeader;