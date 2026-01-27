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
    lqStatus: '',
    role: 'all' // 'all', 'dataMiner', 'leadQualifier'
  });

  useEffect(() => {
    fetchCombinedLeads();
  }, [filters]);

  const fetchCombinedLeads = async () => {
    try {
      setLoading(true);
      console.log('🎯 CombinedLeads: Fetching leads with filters:', filters);
      
      let response;
      if (filters.role === 'dataMiner') {
        // Fetch only Data Miner leads
        response = await combinedAPI.getLeadsByRole('DM');
      } else if (filters.role === 'leadQualifier') {
        // Fetch only Lead Qualifier leads
        response = await combinedAPI.getLeadsByRole('LQ');
      } else {
        // Fetch all leads
        response = await combinedAPI.getAllLeadsCombined();
      }
      
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

  // Determine if lead is Data Miner or Lead Qualifier
  const getLeadType = (lead) => {
    // Log the lead data to understand the type determination
    console.log('🔍 Lead Type Debug:', {
      leadId: lead._id,
      name: lead.name,
      stage: lead.stage,
      lqUpdatedBy: lead.lqUpdatedBy,
      createdBy: lead.createdBy,
      assignedTo: lead.assignedTo,
      lqStatus: lead.lqStatus,
      // Show what determines the type
      hasLQUpdater: !!lead.lqUpdatedBy,
      hasCreator: !!lead.createdBy,
      hasAssignment: !!lead.assignedTo
    });
    
    // Type determination logic:
    // If lead.lqUpdatedBy exists -> Lead Qualifier (has been processed by LQ)
    // If no lead.lqUpdatedBy -> Data Miner (only created by DM)
    const type = lead.lqUpdatedBy ? 'Lead Qualifier' : 'Data Miner';
    console.log('📊 Determined Type:', type);
    return type;
  };

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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-[1700px]">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Combined Leads Dashboard</h1>
          <p className="text-gray-300 text-sm sm:text-base">View and manage all Data Miner and Lead Qualifier leads in one place</p>
          
          {/* Stats Cards */}
          <div className="flex justify-center gap-4 sm:gap-6 mt-8 max-w-4xl mx-auto">
            <div className="flex-1 bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-[24px] p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm transform hover:scale-105 transition-all duration-300 min-w-[280px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full blur-[80px] -mr-16 -mt-16 animate-pulse" />
              <div className="flex flex-col items-center justify-between relative z-10 text-center">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 mb-4 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-300 mb-1">Total Leads</p>
                  <p className="text-4xl font-black tracking-tight text-white">{filteredLeads.length}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-gradient-to-br from-cyan-600/20 to-cyan-700/20 border border-cyan-500/30 rounded-[24px] p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm transform hover:scale-105 transition-all duration-300 min-w-[280px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400 opacity-10 rounded-full blur-[80px] -mr-16 -mt-16 animate-pulse" />
              <div className="flex flex-col items-center justify-between relative z-10 text-center">
                <div className="p-3 bg-cyan-500/20 rounded-2xl text-cyan-400 mb-4 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-cyan-300 mb-1">Data Miner Leads</p>
                  <p className="text-4xl font-black tracking-tight text-white">
                    {filteredLeads.filter(l => !l.lqUpdatedBy).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/30 rounded-[24px] p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm transform hover:scale-105 transition-all duration-300 min-w-[280px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-400 opacity-10 rounded-full blur-[80px] -mr-16 -mt-16 animate-pulse" />
              <div className="flex flex-col items-center justify-between relative z-10 text-center">
                <div className="p-3 bg-green-500/20 rounded-2xl text-green-400 mb-4 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-green-300 mb-1">Lead Qualifier Leads</p>
                  <p className="text-4xl font-black tracking-tight text-white">
                    {filteredLeads.filter(l => l.lqUpdatedBy).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 shadow-xl border border-purple-500/20">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px] sm:min-w-[250px]">
            <label className="block text-xs font-medium text-white mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, location, email..."
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pl-8 sm:pl-10 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-xs sm:text-sm font-medium"
              />
              <svg className="absolute left-2.5 sm:left-3.5 top-2 sm:top-3 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Role Filter */}
          <div className="min-w-[120px] sm:min-w-[140px]">
            <label className="block text-xs font-medium text-white mb-1">Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-xs sm:text-sm font-medium"
            >
              <option value="all">All Roles</option>
              <option value="dataMiner">Data Miner Only</option>
              <option value="leadQualifier">Lead Qualifier Only</option>
            </select>
          </div>

          {/* Stage Filter */}
          <div className="min-w-[100px] sm:min-w-[120px]">
            <label className="block text-xs font-medium text-white mb-1">Stage</label>
            <select
              value={filters.stage}
              onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-xs sm:text-sm font-medium"
            >
              <option value="">All Stages</option>
              {filterOptions.stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-[100px] sm:min-w-[120px]">
            <label className="block text-xs font-medium text-white mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-xs sm:text-sm font-medium"
            >
              <option value="">All Statuses</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* LQ Status Filter */}
          <div className="min-w-[100px] sm:min-w-[120px]">
            <label className="block text-xs font-medium text-white mb-1">LQ Status</label>
            <select
              value={filters.lqStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, lqStatus: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-xs sm:text-sm font-medium"
            >
              <option value="">All LQ Statuses</option>
              {filterOptions.lqStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[20px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-slideUp">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Type</th>
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
                  <td className="px-4 py-2 align-middle">
                    <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-md border w-fit ${
                      lead.lqUpdatedBy 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {getLeadType(lead)}
                    </span>
                  </td>
                  
                  {/* Lead / Prospect */}
                  <td className="px-4 py-2 align-middle">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border ${
                        lead.lqUpdatedBy 
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
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              email.status === 'ACTIVE' ? 'bg-green-400' : 'bg-yellow-400'
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
                    <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-md border w-fit ${
                      lead.stage === 'DONE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      lead.stage === 'MANAGER' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      lead.stage === 'LQ' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-gray-500/10 text-gray-500 border-gray-500/20'
                    }`}>
                      {lead.stage || 'UNKNOWN'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2 align-middle">
                    <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-md border w-fit ${
                      lead.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      lead.status === 'UNPAID' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {lead.status || 'PENDING'}
                    </span>
                  </td>

                  {/* LQ Status */}
                  <td className="px-4 py-2 align-middle">
                    <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase border w-fit ${
                      lead.lqStatus === 'QUALIFIED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      lead.lqStatus === 'IN_CONVERSATION' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                      lead.lqStatus === 'DEAD' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                      lead.lqStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                      'bg-gray-500/10 text-gray-600 border-gray-500/20'
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
        
        {filteredLeads.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No leads found matching the current filters.
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default CombinedLeads;
