import React, { useState, useEffect } from 'react';
import { useLeadManager } from '../hooks/useLeadManager';

export default function LeadQualifierDashboard() {
  const { leads: allLeads, loading, refreshLeads } = useLeadManager();
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
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    if (allLeads && allLeads.length >= 0) {
      processLeadsData(allLeads);
    }
  }, [allLeads]);

  const processLeadsData = (leads) => {
    setRecentLeads(leads.slice(0, 10));

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

    // Get last 4 months for display
    const monthlyLeads = Object.entries(monthlyGroups)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => new Date(b.name) - new Date(a.name))
      .slice(0, 4);

    const qualified = leads.filter(l => l.lqStatus === 'QUALIFIED').length;
    const dead = leads.filter(l => l.lqStatus === 'DEAD').length;
    const inConv = leads.filter(l => l.lqStatus === 'IN_CONVERSATION').length;
    const pending = leads.filter(l => !l.lqStatus || l.lqStatus === 'PENDING').length;

    // Last assigned lead
    const lastLead = leads.length > 0 ? [...leads].sort((a, b) => new Date(b.assignedAt || b.createdAt) - new Date(a.assignedAt || a.createdAt))[0] : null;

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

  const StatCard = ({ title, value, subtitle, color, icon }) => (
    <div className="relative overflow-hidden bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-primary)] group hover:border-[var(--accent-primary)]/50 transition-all duration-500 shadow-xl">
      <div className="absolute -right-4 -top-4 w-16 h-16 bg-[var(--accent-primary)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent-primary)]/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className={`p-2.5 rounded-xl ${color} shadow-lg shadow-black/20`}>
            {React.cloneElement(icon, { className: "h-5 w-5" })}
          </div>
        </div>
        <div className="space-y-0.5">
          <h3 className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest truncate">{title}</h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[var(--text-primary)]">{value}</span>
            {subtitle && <span className="text-[9px] text-[var(--text-tertiary)] font-bold truncate">{subtitle}</span>}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-[var(--accent-primary)]/40 border-b-[var(--accent-primary)] animate-spin-slow" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
            Pipeline Overview
          </h1>
          <p className="text-[var(--text-secondary)] text-sm font-medium">
            Real-time metrics for your lead qualification queue
          </p>
        </div>
        <button
          onClick={refreshLeads}
          className="px-5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs font-bold hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-300 flex items-center gap-2 border border-[var(--border-primary)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard
          title="Active Queue"
          value={stats.total}
          subtitle="Leads Assigned"
          color="bg-teal-500/10 text-teal-500"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          title="Qualified"
          value={stats.qualified}
          subtitle={`${((stats.qualified / (stats.total || 1)) * 100).toFixed(0)}% Conv`}
          color="bg-emerald-500/10 text-emerald-500"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
        <StatCard
          title="This Month"
          value={`${stats.monthPerformance.toFixed(0)}%`}
          subtitle="Efficiency"
          color="bg-amber-500/10 text-amber-500"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          title="Conversations"
          value={stats.inConversation}
          subtitle="Wait Reply"
          color="bg-indigo-500/10 text-indigo-500"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
        />
        <StatCard
          title="Last Assigned"
          value={stats.lastLead ? stats.lastLead.name?.split(' ')[0] : 'None'}
          subtitle={stats.lastLead ? new Date(stats.lastLead.assignedAt || stats.lastLead.createdAt).toLocaleDateString() : '-'}
          color="bg-purple-500/10 text-purple-500"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Dead"
          value={stats.dead}
          subtitle="Closed Lost"
          color="bg-rose-500/10 text-rose-500"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity List */}
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-primary)] overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-tertiary)]/30">
            <div>
              <h2 className="text-xl font-black text-[var(--text-primary)]">Recent Assignments</h2>
              <p className="text-[var(--text-tertiary)] text-[10px] uppercase font-bold tracking-widest mt-1">Last {recentLeads.length} items</p>
            </div>
            <button className="text-[var(--accent-primary)] hover:underline text-xs font-bold uppercase tracking-wider">
              View Pipeline
            </button>
          </div>
          <div className="divide-y divide-[var(--border-primary)]">
            {recentLeads.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-[var(--text-secondary)] font-medium">Your queue is currently empty</p>
              </div>
            ) : (
              recentLeads.map(lead => (
                <div key={lead._id} className="p-5 hover:bg-[var(--bg-tertiary)]/20 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary)]/60 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[var(--accent-primary)]/20 group-hover:scale-110 transition-transform">
                      {lead.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-[var(--text-primary)] font-bold text-base leading-tight">{lead.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider">{lead.location || 'Global'}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--border-primary)]" />
                        <span className="text-[10px] text-[var(--text-tertiary)] font-bold">{new Date(lead.assignedAt || lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest shadow-sm ${lead.lqStatus === 'QUALIFIED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    lead.lqStatus === 'DEAD' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                      lead.lqStatus === 'IN_CONVERSATION' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                    {lead.lqStatus || 'NEW'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-primary)] p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-black text-[var(--text-primary)]">Monthly Analytics</h3>
            <p className="text-[var(--text-tertiary)] text-[10px] uppercase font-bold tracking-widest">Leads per Month</p>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 px-2">
            {stats.monthlyLeads.slice().reverse().map((m, i) => (
              <div key={i} className="flex-1 group relative flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full bg-gradient-to-t from-[var(--accent-primary)] to-[var(--accent-primary)]/40 rounded-t-xl transition-all duration-500 group-hover:to-[var(--accent-primary)] group-hover:shadow-[0_0_20px_rgba(0,190,155,0.4)]"
                  style={{ height: `${(m.count / (Math.max(...stats.monthlyLeads.map(ml => ml.count)) || 1)) * 100}%` }}
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-tertiary)] px-2 py-1 rounded text-[10px] font-black pointer-events-none border border-[var(--border-primary)]">
                  {m.count} Leads
                </div>
                <span className="text-[9px] text-[var(--text-tertiary)] font-black uppercase tracking-widest text-center">{m.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--border-primary)] space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-secondary)] font-medium">Performance Rating</span>
              <span className="text-[var(--accent-primary)] font-black">{(stats.monthPerformance / 10).toFixed(1)} / 10</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-primary)] transition-all duration-1000"
                style={{ width: `${stats.monthPerformance}%` }}
              />
            </div>
            <p className="text-[10px] text-[var(--text-tertiary)] font-bold italic leading-relaxed">
              You converted <span className="text-[var(--accent-primary)]">{stats.monthPerformance.toFixed(0)}%</span> of leads assigned this month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
