import React, { useState, useEffect, useMemo } from 'react';
import { combinedAPI } from '../../../api/combined.api';
import SharedLoader from '../../../components/SharedLoader';

const CombinedLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedContacts, setExpandedContacts] = useState({});
  const [filters, setFilters] = useState({
    stage: '',
    lqStatus: ''
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [copiedId, setCopiedId] = useState(null);





  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
    itemsPerPage: 20
  });

  useEffect(() => {
    fetchCombinedLeads();
  }, [filters, pagination.currentPage, searchTerm]); // Trigger fetch on any filter/page change

  // Debounced search effect could be added here for optimization

  const fetchCombinedLeads = async () => {
    try {
      setLoading(true);

      const skip = (pagination.currentPage - 1) * pagination.itemsPerPage;

      // Prepare filters - remove limit/skip from filter object, pass separately
      const filterParams = {
        ...filters,
        search: searchTerm // Keep search if user still tries to use it, though backend ignores it
      };

      // Remove empty filters
      Object.keys(filterParams).forEach(key => {
        if (filterParams[key] === '' || filterParams[key] === null) {
          delete filterParams[key];
        }
      });

      const response = await combinedAPI.getAllLeadsCombined(
        pagination.itemsPerPage,
        skip,
        filterParams
      );

      if (response.success) {
        setLeads(response.leads || []);

        // Calculate total leads based on the active stage filter
        // If no stage filter is active, use global combined total
        let totalLeads = response.total || 0;

        if (filters.stage) {
          const s = filters.stage.trim().toUpperCase();

          if (s === 'DM' && response.counts?.dm !== undefined) {
            totalLeads = response.counts.dm;
          } else if (s === 'VERIFIER' && response.counts?.verifier !== undefined) {
            totalLeads = response.counts.verifier;
          } else if (s === 'LQ' && response.counts?.lq !== undefined) {
            totalLeads = response.counts.lq;
          }
        }

        // Ensure totalLeads is at least the number of items on current page
        if (totalLeads < (response.leads?.length || 0)) {
          totalLeads = response.leads.length;
        }

        const totalPages = Math.ceil(totalLeads / pagination.itemsPerPage);

        setPagination(prev => ({
          ...prev,
          totalPages: totalPages || 1,
          totalLeads: totalLeads
        }));
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Hardcoded filter options since we aren't fetching ALL leads
  const filterOptions = {
    stages: ['DM', 'Verifier', 'LQ', 'DONE'],
    lqStatuses: ['PENDING', 'IN_CONVERSATION', 'DEAD', 'QUALIFIED']
  };

  // leads are already filtered from backend
  const filteredLeads = leads;



  // Handle contact modal
  const openContactDetails = (lead) => {
    setSelectedLead(lead);
  };

  const closeContactDetails = () => {
    setSelectedLead(null);
    setCopiedId(null);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isInitialLoading) {
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
                    <span className="text-2xl font-black text-[var(--text-primary)] tabular-nums">{pagination.totalLeads}</span>
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


            {(!filters.stage || filters.stage === 'LQ') && (
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
            )}
          </div>
        </div>
      </div>



      {/* Leads Table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[32px] shadow-xl overflow-hidden animate-slideUp relative">
        {/* Table Loading Overlay */}
        {loading && !isInitialLoading && (
          <div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent-success)]/30 overflow-hidden z-[50]">
            <div className="w-1/2 h-full bg-[var(--accent-success)] animate-[shimmer_1.5s_infinite]" style={{
              background: 'linear-gradient(90deg, transparent, var(--accent-success), transparent)'
            }}></div>
          </div>
        )}

        <div className={`overflow-x-auto transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Lead / Prospect</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Contact Info</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Stage</th>
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

                      {/* View button */}
                      {(lead.emails?.length > 0 || lead.phones?.length > 0) && (
                        <button
                          onClick={() => openContactDetails(lead)}
                          className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:!text-white transition-all duration-300 shadow-sm border border-[var(--accent-primary)]/20 font-black text-[9px] uppercase tracking-wider"
                        >
                          View Details
                        </button>
                      )}
                    </div>
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

        {/* Filters & Empty State */}
        {filteredLeads.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No leads found matching the current filters.
          </div>
        )
        }

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)]/30 flex items-center justify-between">
          <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
            Showing <span className="text-[var(--text-primary)]">{filteredLeads.length}</span> of <span className="text-[var(--text-primary)]">{pagination.totalLeads}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] disabled:opacity-50 hover:bg-[var(--bg-tertiary)] transition text-[10px] font-black uppercase tracking-wider"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                let pageNum = i + 1;
                // Simple logic to show current page range
                if (pagination.totalPages > 5) {
                  if (pagination.currentPage > 3) {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  if (pageNum > pagination.totalPages) return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black transition ${pagination.currentPage === pageNum
                      ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] disabled:opacity-50 hover:bg-[var(--bg-tertiary)] transition text-[10px] font-black uppercase tracking-wider"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* No helper functions needed here as they are defined in the component scope. 
      The previous error was due to them being defined inside a block that was removed or scopes that were invalid. 
      Actually, looking at the code, they ARE defined in the component scope at lines 99-112 (in previous versions), 
      but looking at the current file content provided in view_file, they seem to be MISSING from the component body 
      because of a previous replace_file_content that might have overwritten them or they were in a part of the file 
      that was replaced by "..." in a diff and then lost. 
      
      Wait, looking at the file content from step 148, lines 83-97 show handlePageChange and filterOptions. 
      Lines 99-100 show `if (loading) ...`.
      It seems `openContactDetails`, `closeContactDetails`, and `handleCopy` are indeed MISSING from the component body 
      before the return statement.
      
      I need to add them back. I will add them before the `if (loading)` check.
  */}
      {/* Contact Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden animate-slideUp p-0 relative">
            {/* Modal Header - More Compact */}
            <div className="p-5 pb-4 border-b border-white/5 relative">
              <div className="absolute top-0 right-0 p-3">
                <button
                  onClick={closeContactDetails}
                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all text-white/40"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center text-xl font-black shadow-xl ${selectedLead.lqUpdatedBy
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/20'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-blue-500/20'
                  }`}>
                  {selectedLead.name?.[0] || 'L'}
                </div>
                <div>
                  <div className="text-[7px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)] mb-0.5 opacity-60">Lead Intelligence</div>
                  <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight leading-tight truncate max-w-[200px]">{selectedLead.name || 'Anonymous'}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/40">📍 {selectedLead.location || 'GLOBAL'}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${selectedLead.stage === 'DONE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>{selectedLead.stage}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content - Tighter Gaps */}
            <div className="p-5 space-y-5">
              {/* Emails Section - 2 Columns */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-blue-500/10 text-blue-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Emails</span>
                  </div>
                  <span className="text-[8px] font-black text-blue-400/50">{selectedLead.emails?.length || 0} TOTAL</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {selectedLead.emails?.map((email, idx) => (
                    <div key={idx} className="flex flex-col p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group/email relative h-full">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${email.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]'}`} />
                          <span className={`text-[7px] font-black uppercase tracking-tight ${email.status === 'ACTIVE' ? 'text-green-500' : 'text-yellow-500'}`}>{email.status}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(email.value, `email-${idx}`)}
                          className="p-1 rounded-md hover:bg-white/10 text-white/20 hover:text-blue-400 transition-all"
                          title="Copy Email"
                        >
                          {copiedId === `email-${idx}` ? (
                            <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] font-bold text-white group-hover/email:text-blue-400 transition-colors truncate w-full tracking-tight pr-6">{email.value}</span>
                    </div>
                  ))}
                  {(!selectedLead.emails || selectedLead.emails.length === 0) && (
                    <div className="col-span-2 text-center py-3 text-[9px] font-bold text-white/20 uppercase tracking-widest italic border border-dashed border-white/5 rounded-xl">No Synchronized Emails</div>
                  )}
                </div>
              </div>

              {/* Phones Section - 2 Columns */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-green-500/10 text-green-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Phone Lines</span>
                  </div>
                  <span className="text-[8px] font-black text-green-400/50">{selectedLead.phones?.length || 0} TOTAL</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {selectedLead.phones?.map((phone, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-green-500/30 transition-all group/phone">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] flex-shrink-0" />
                        <span className="text-[11px] font-black text-white group-hover/phone:text-green-400 transition-colors tracking-tighter truncate">{phone}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(phone, `phone-${idx}`)}
                        className="p-1 rounded-md hover:bg-white/10 text-white/20 hover:text-green-400 transition-all flex-shrink-0"
                        title="Copy Number"
                      >
                        {copiedId === `phone-${idx}` ? (
                          <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                  {(!selectedLead.phones || selectedLead.phones.length === 0) && (
                    <div className="col-span-2 text-center py-3 text-[9px] font-bold text-white/20 uppercase tracking-widest italic border border-dashed border-white/5 rounded-xl">No Established Lines</div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer - more compact */}
            <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Secure Node</span>
              </div>
              <button
                onClick={closeContactDetails}
                className="px-5 py-2 rounded-lg bg-[var(--accent-primary)] text-white font-black text-[9px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                Exit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
};

export default CombinedLeads;
