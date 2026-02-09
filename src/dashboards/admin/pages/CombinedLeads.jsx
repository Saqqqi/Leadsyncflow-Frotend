import React, { useState, useEffect, useMemo } from 'react';
import { combinedAPI } from '../../../api/combined.api';
import SharedLoader from '../../../components/SharedLoader';

const CombinedLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedContacts, setExpandedContacts] = useState({});
  const [filters, setFilters] = useState({
    stage: '',
    status: '',
    lqStatus: ''
  });

  useEffect(() => {
    fetchCombinedLeads();
  }, [filters]);

  const fetchCombinedLeads = async () => {
    try {
      setLoading(true);
      console.log('🎯 CombinedLeads: Fetching leads with filters:', filters);

      const response = await combinedAPI.getAllLeadsCombined();

      if (response.success) {
        setLeads(response.leads || []);
        console.log('📊 CombinedLeads: Total leads fetched:', response.leads?.length);

        // Log role breakdown
        const dataMinerLeads = response.leads?.filter(l => !l.lqUpdatedBy) || [];
        const leadQualifierLeads = response.leads?.filter(l => l.lqUpdatedBy) || [];
        console.log('👥 Role Breakdown:', {
          dataMinerLeads: dataMinerLeads.length,
          leadQualifierLeads: leadQualifierLeads.length
        });
      }
    } catch (error) {
      console.error('❌ CombinedLeads: Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter leads based on search term and filters
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search filter - search across ALL fields
      const matchesSearch = !searchTerm || (() => {
        const searchLower = searchTerm.toLowerCase();

        // Convert lead to string and search all fields
        const searchableString = [
          // Basic fields
          lead.name || '',
          lead.location || '',
          lead.stage || '',
          lead.status || '',
          lead.lqStatus || '',
          lead.submittedDate || '',
          lead.submittedTime || '',

          // Email addresses
          ...(lead.emails?.map(e => e.value || '') || []),

          // Phone numbers
          ...(lead.phones || []),

          // User names and roles
          lead.createdBy?.name || '',
          lead.createdBy?.email || '',
          lead.createdBy?.role || '',
          lead.lqUpdatedBy?.name || '',
          lead.lqUpdatedBy?.email || '',
          lead.lqUpdatedBy?.role || '',
          lead.assignedTo?.name || '',
          lead.assignedTo?.email || '',
          lead.assignedTo?.role || '',

          // Response source
          lead.responseSource?.type || '',
          lead.responseSource?.value || '',

          // Comments text
          ...(lead.comments?.map(c => c.text || '') || []),

          // Sources
          ...(lead.sources?.map(s => s.name || '') || []),
          ...(lead.sources?.map(s => s.link || '') || [])
        ].join(' ').toLowerCase();

        console.log('🔍 Search Debug:', {
          searchTerm: searchLower,
          searchableString: searchableString.substring(0, 200) + '...',
          found: searchableString.includes(searchLower)
        });

        return searchableString.includes(searchLower);
      })();

      const matchesStage = !filters.stage || lead.stage === filters.stage;
      const matchesStatus = !filters.status || lead.status === filters.status;
      const matchesLqStatus = !filters.lqStatus || lead.lqStatus === filters.lqStatus;

      return matchesSearch && matchesStage && matchesStatus && matchesLqStatus;
    });
  }, [leads, searchTerm, filters]);



  // Toggle contact expansion for a lead
  const toggleContactExpansion = (leadId) => {
    setExpandedContacts(prev => ({
      ...prev,
      [leadId]: !prev[leadId]
    }));
  };

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const stages = [...new Set(leads.map(l => l.stage).filter(Boolean))];
    const statuses = [...new Set(leads.map(l => l.status).filter(Boolean))];
    const lqStatuses = [...new Set(leads.map(l => l.lqStatus).filter(Boolean))];

    return { stages, statuses, lqStatuses };
  }, [leads]);

  if (loading) {
    return <SharedLoader />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto animate-fadeIn min-h-screen">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-5 rounded-full blur-[100px] -mr-32 -mt-32" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 relative z-10">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[var(--accent-success)]/10 rounded-2xl text-[var(--accent-success)] shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)] whitespace-nowrap leading-tight">
                  Combined <span className="text-[var(--accent-success)]">Leads</span>
                </h1>
                <p className="text-[13px] font-bold text-[var(--text-secondary)] opacity-70 italic tracking-tight hidden sm:block">
                  Unified visualization of global lead acquisition pipelines
                </p>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-[var(--border-primary)] opacity-20 hidden md:block" />

            {/* Enhanced Stats Display */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] opacity-60">Total Intelligence</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[var(--text-primary)] tabular-nums">{leads.length}</span>
                    <span className="text-[10px] font-bold text-[var(--accent-success)]/60 uppercase">Nodes</span>
                  </div>
                </div>
              </div>

              <div className="h-6 w-[1px] bg-[var(--border-primary)] opacity-10" />

              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] opacity-60">Verified Nodes</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[var(--accent-success)] tabular-nums">{leads.filter(l => l.lqUpdatedBy).length}</span>
                    <span className="text-[10px] font-bold text-[var(--accent-success)]/60 uppercase text-xs">✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-[var(--border-primary)] opacity-20 hidden lg:block" />

            {/* Sync Block (Styled like PendingRequests) */}
            <div className="flex items-center bg-[var(--bg-tertiary)]/40 border border-[var(--border-primary)]/40 rounded-full pl-1 pr-3 py-1 gap-3 hover:border-[var(--accent-success)]/40 transition-all group/sync-badge">
              <button
                onClick={() => fetchCombinedLeads()}
                disabled={loading}
                className="w-7 h-7 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full hover:bg-[var(--accent-success)] hover:text-white hover:border-[var(--accent-success)] transition-all shadow-sm"
              >
                <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : 'group-hover/sync-badge:rotate-180 transition-transform duration-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-[var(--accent-success)] animate-pulse" />
                  <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Synchronized</span>
                </div>
                <span className="text-[9px] font-black text-[var(--text-primary)] tabular-nums mt-0.5">Real-time</span>
              </div>
            </div>
          </div>

          {/* Integrated Search and Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative w-64 md:w-72 group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--accent-success)] group-focus-within:scale-110 transition-transform">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH INTELLIGENCE..."
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-xs font-bold text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-success)]/20 outline-none transition-all placeholder-gray-500 tracking-widest uppercase"
              />
            </div>

            {/* Filters */}
            <select
              value={filters.stage}
              onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
              className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl px-4 py-2.5 text-xs font-black text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-success)]/20 transition-all uppercase tracking-widest cursor-pointer"
            >
              <option value="">ALL STAGES</option>
              {filterOptions.stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl px-4 py-2.5 text-xs font-black text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-success)]/20 transition-all uppercase tracking-widest cursor-pointer"
            >
              <option value="">ALL STATUSES</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filters.lqStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, lqStatus: e.target.value }))}
              className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl px-4 py-2.5 text-xs font-black text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-success)]/20 transition-all uppercase tracking-widest cursor-pointer"
            >
              <option value="">LQ STATUS</option>
              {filterOptions.lqStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>



      {/* Leads Table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] shadow-xl overflow-hidden animate-slideUp">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Lead / Prospect</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Contact Info</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Stage</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Status</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">LQ Status</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Assignment</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]/50">
              {filteredLeads.map((lead, index) => (
                <tr key={lead._id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors group cursor-default">
                  {/* Lead / Prospect */}
                  <td className="px-4 py-2 align-middle">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border ${lead.lqUpdatedBy
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-600 border-green-500/10'
                        : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-600 border-blue-500/10'
                        }`}>
                        {lead.name?.[0] || 'L'}
                      </div>
                      <div className="max-w-[160px]">
                        <div className="font-bold text-[var(--text-primary)] text-sm break-words">{lead.name || 'Anonymous'}</div>
                        <div className="text-[9px] text-[var(--text-tertiary)] font-medium">
                          📍 {lead.location || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Contact Info Summary */}
                  <td className="px-4 py-2 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">{lead.emails?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">{lead.phones?.length || 0}</span>
                      </div>

                      {/* Expand button if more contacts */}
                      {(lead.emails?.length > 0 || lead.phones?.length > 0) && (
                        <button
                          onClick={() => toggleContactExpansion(lead._id)}
                          className="p-1 rounded-lg bg-[var(--bg-tertiary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all shadow-md"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={expandedContacts[lead._id] ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Expanded contact details */}
                    {expandedContacts[lead._id] && (
                      <div className="mt-2 space-y-1 text-[9px]">
                        {lead.emails?.map((email, idx) => (
                          <div key={`email-${idx}`} className="flex items-center gap-1 text-[var(--text-secondary)]">
                            <div className={`w-1.5 h-1.5 rounded-full ${email.status === 'ACTIVE' ? 'bg-green-400' : 'bg-yellow-400'
                              }`}></div>
                            <span className="truncate">{email.value}</span>
                          </div>
                        ))}
                        {lead.phones?.map((phone, idx) => (
                          <div key={`phone-${idx}`} className="flex items-center gap-1 text-[var(--text-secondary)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            <span>{phone}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  {/* Stage */}
                  <td className="px-4 py-2 align-middle">
                    <span className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border shadow-lg ${lead.stage === 'DONE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      lead.stage === 'MANAGER' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        lead.stage === 'LQ' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                      {lead.stage || 'UNKNOWN'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2 align-middle">
                    <span className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border shadow-lg ${lead.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      lead.status === 'UNPAID' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}>
                      {lead.status || 'PENDING'}
                    </span>
                  </td>

                  {/* LQ Status */}
                  <td className="px-4 py-2 align-middle">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase border w-fit ${lead.lqStatus === 'QUALIFIED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      lead.lqStatus === 'IN_CONVERSATION' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        lead.lqStatus === 'DEAD' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                          lead.lqStatus === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                            'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                      {lead.lqStatus || 'NONE'}
                    </span>
                  </td>
                  {/* Assignment */}
                  <td className="px-4 py-2 align-middle">
                    <div className="space-y-1">
                      {lead.createdBy && (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                          <span className="text-[8px] font-bold text-blue-400">DM</span>
                          <span className="text-[8px] text-[var(--text-secondary)]">{lead.createdBy.name}</span>
                        </div>
                      )}
                      {lead.lqUpdatedBy && (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span className="text-[8px] font-bold text-green-400">LQ</span>
                          <span className="text-[8px] text-[var(--text-secondary)]">{lead.lqUpdatedBy.name}</span>
                        </div>
                      )}
                      {lead.assignedTo && (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                          <span className="text-[8px] font-bold text-purple-400">→</span>
                          <span className="text-[8px] text-[var(--text-secondary)]">{lead.assignedTo.name}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Created */}
                  <td className="px-4 py-2 align-middle">
                    <div className="text-[9px] text-[var(--text-tertiary)] font-medium">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {
          filteredLeads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No leads found matching the current filters.
            </div>
          )
        }
      </div>
      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CombinedLeads;
