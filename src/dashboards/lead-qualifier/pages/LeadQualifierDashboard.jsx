import React, { useState, useEffect, useCallback } from 'react';
import { lqAPI } from '../../../api/lead-qualifier.api';
import SharedLoader from '../../../components/SharedLoader';
import StatCard from '../components/StatCard';


export default function LeadQualifierDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    qualified: 0,
    pending: 0,
    dead: 0,
    inConversation: 0,
    submittedToManager: 0,
    qualifiedOverall: 0,
    lastLead: null
  });

  const [dateFilter, setDateFilter] = useState('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let filters = {};
      if (dateFilter === 'today') {
        filters.today = 'true';
      } else if (dateFilter === 'custom') {
        if (customFrom) filters.from = customFrom;
        if (customTo) filters.to = customTo;
      }

      const statsRes = await lqAPI.getStats(filters);

      if (statsRes.success) {
        const s = statsRes.stats;
        setStats({
          total: s.totalLeadsInLQ || 0,
          qualified: s.qualifiedInLQ || 0,
          pending: s.pendingInLQ || 0,
          dead: s.deadInLQ || 0,
          inConversation: s.reachedInLQ || 0,
          submittedToManager: s.submittedToManager || 0,
          qualifiedOverall: s.qualifiedOverall || 0,
          lastLead: null
        });
      } else {
        setError(statsRes.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Network error while loading dashboard. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [dateFilter, customFrom, customTo]);

  // Will fetch only ONCE on mount. Manual fetch handled by Search / Refresh later.
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !stats.lastLead && stats.total === 0) return <SharedLoader />;

  return (
    <div className="space-y-8 animate-fadeIn">
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold animate-fadeIn">
          ⚠ {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--test-primary)] tracking-tight">Lead Qualifier Dashboard</h1>
          <p className="text-[var(--text-secondary)] text-sm font-medium">Track all lead stages: Pending, Reached, Qualified, Dead, and Submitted</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 bg-[var(--bg-secondary)] p-2 rounded-2xl border border-[var(--border-primary)] shadow-sm">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] border-none text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today (PKT)</option>
            <option value="custom">Custom Date</option>
          </select>

          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2 animate-fadeIn bg-[var(--bg-tertiary)] rounded-xl px-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="px-2 py-2 bg-transparent text-sm text-[var(--text-primary)] focus:outline-none cursor-pointer"
              />
              <span className="text-[var(--text-tertiary)] font-bold text-sm select-none">to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="px-2 py-2 bg-transparent text-sm text-[var(--text-primary)] focus:outline-none cursor-pointer"
              />
            </div>
          )}

          <button
            onClick={fetchDashboardData}
            className="px-5 py-2 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Search
          </button>

          <div className="w-px h-6 bg-[var(--border-primary)] mx-1 hidden sm:block"></div>

          <button
            onClick={() => {
              setDateFilter('all');
              setCustomFrom('');
              setCustomTo('');
              // Small delay to allow state to settle before fetch
              setTimeout(fetchDashboardData, 0);
            }}
            className="px-5 py-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-bold hover:bg-[var(--border-primary)] active:scale-95 transition-all duration-300 flex items-center gap-2 border border-transparent hover:border-[var(--border-primary)]"
            title="Reset to All Time and Refresh"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Queue" value={stats.total} subtitle="Leads Assigned" color="bg-teal-500/10 text-teal-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Pending" value={stats.pending} subtitle="Not Yet Contacted" color="bg-amber-500/10 text-amber-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Qualified" value={stats.qualified} subtitle={`${((stats.qualified / (stats.total || 1)) * 100).toFixed(0)}% Conv`} color="bg-emerald-500/10 text-emerald-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z" /></svg>} />
        <StatCard title="Reached" value={stats.inConversation} subtitle="Wait Reply" color="bg-indigo-500/10 text-indigo-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>} />
        <StatCard title="Dead" value={stats.dead} subtitle="Closed Lost" color="bg-rose-500/10 text-rose-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />
        <StatCard title="Submitted" value={stats.submittedToManager} subtitle="Sent to Manager" color="bg-blue-500/10 text-blue-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>} />
        <StatCard title="Qualified (Overall)" value={stats.qualifiedOverall} subtitle="All Time" color="bg-fuchsia-500/10 text-fuchsia-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
      </div>

    </div>
  );
}
