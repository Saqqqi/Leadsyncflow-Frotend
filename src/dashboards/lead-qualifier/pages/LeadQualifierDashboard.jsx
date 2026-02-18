import React, { useState, useEffect } from 'react';
import { useLeadManager } from '../hooks/useLeadManager';
import SharedLoader from '../../../components/SharedLoader';
import StatCard from '../components/StatCard';
import LeadIdentity from '../components/LeadIdentity';
import { getStatusStyle } from '../utils/statusStyles';

export default function LeadQualifierDashboard() {
  const { leads: allLeads, loading, refreshLeads, error } = useLeadManager();
  const [stats, setStats] = useState({
    total: 0,
    qualified: 0,
    pending: 0,
    dead: 0,
    inConversation: 0,
    monthlyLeads: [],
    lastLead: null,
    monthPerformance: 0
  });

  useEffect(() => {
    if (allLeads) {
      processLeadsData(allLeads);
    }
  }, [allLeads]);

  const processLeadsData = (leads) => {
    // Group leads by month
    const monthlyGroups = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let monthQualified = 0;
    let monthTotal = 0;

    leads.forEach(l => {
      const date = new Date(l.assignedAt || l.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthName = months[month];

      const key = `${monthName} ${year}`;
      monthlyGroups[key] = (monthlyGroups[key] || 0) + 1;

      if (month === currentMonth && year === currentYear) {
        monthTotal++;
        if (l.lqStatus === 'QUALIFIED') monthQualified++;
      }
    });

    const monthlyLeads = Object.entries(monthlyGroups)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => new Date(b.name) - new Date(a.name))
      .slice(0, 4);

    const qualified = leads.filter(l => l.lqStatus === 'QUALIFIED').length;
    const dead = leads.filter(l => l.lqStatus === 'DEAD').length;
    const inConv = leads.filter(l => l.lqStatus === 'IN_CONVERSATION' || l.lqStatus === 'REACHED').length;
    const pending = leads.filter(l => !l.lqStatus || l.lqStatus === 'PENDING').length;

    const lastLead = leads.length > 0
      ? [...leads].sort((a, b) => new Date(b.assignedAt || b.createdAt) - new Date(a.assignedAt || a.createdAt))[0]
      : null;

    setStats({
      total: leads.length,
      qualified,
      pending,
      dead,
      inConversation: inConv,
      monthlyLeads,
      lastLead,
      monthPerformance: monthTotal > 0 ? (monthQualified / monthTotal) * 100 : 0
    });
  };

  if (loading && allLeads.length === 0) return <SharedLoader />;

  return (
    <div className="space-y-8 animate-fadeIn">
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold animate-fadeIn">
          ⚠ {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--test-primary)] tracking-tight">Pipeline Overview</h1>
          <p className="text-[var(--text-secondary)] text-sm font-medium">Real-time metrics for your lead qualification queue</p>
        </div>
        <button
          onClick={refreshLeads}
          className="px-5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs font-bold hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-300 flex items-center gap-2 border border-[var(--border-primary)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <StatCard title="Active Queue" value={stats.total} subtitle="Leads Assigned" color="bg-teal-500/10 text-teal-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Qualified" value={stats.qualified} subtitle={`${((stats.qualified / (stats.total || 1)) * 100).toFixed(0)}% Conv`} color="bg-emerald-500/10 text-emerald-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z" /></svg>} />
        <StatCard title="Reached" value={stats.inConversation} subtitle="Wait Reply" color="bg-indigo-500/10 text-indigo-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>} />
        <StatCard title="Dead" value={stats.dead} subtitle="Closed Lost" color="bg-rose-500/10 text-rose-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />
        <StatCard title="Last Target" value={stats.lastLead ? stats.lastLead.name?.split(' ')[0] : 'None'} subtitle={stats.lastLead ? new Date(stats.lastLead.assignedAt || stats.lastLead.createdAt).toLocaleDateString() : '-'} color="bg-purple-500/10 text-purple-500" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden shadow-xl animate-slideUp w-full">
        <div className="px-5 py-3 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-tertiary)]/20">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tighter">Latest Pipeline Entry</h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Monitoring</span>
            </div>
          </div>
          <p className="text-[var(--text-tertiary)] text-[8px] uppercase font-black tracking-[0.2em] opacity-40">Most Recent Acquisition</p>
        </div>
        <div className="p-4">
          {stats.lastLead ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <LeadIdentity lead={stats.lastLead} size="lg" />
                <div className="w-1 h-8 bg-[var(--border-primary)] opacity-20 hidden md:block" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1">Assigned Context</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[10px] font-black text-[var(--text-primary)]">
                      {new Date(stats.lastLead.assignedAt || stats.lastLead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="ml-2 font-bold opacity-40">{new Date(stats.lastLead.assignedAt || stats.lastLead.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.15em] shadow-md transition-all duration-300 hover:brightness-110 ${getStatusStyle(stats.lastLead.lqStatus)}`}>
                ● {stats.lastLead.lqStatus || 'NEW ENTRY'}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 opacity-20"><p className="text-xs font-black uppercase tracking-widest text-center">Queue currently empty</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
