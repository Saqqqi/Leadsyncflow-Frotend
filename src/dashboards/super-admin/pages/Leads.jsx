import React, { useState, useEffect } from 'react';

export default function LeadsManagement() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');

  useEffect(() => {
    // Mock data
    setLeads([
      { 
        id: 1, 
        name: 'Acme Corporation', 
        email: 'contact@acme.com', 
        phone: '+1 555-0123',
        status: 'New', 
        source: 'Website',
        value: '$50,000',
        assignedTo: 'John Doe',
        createdAt: '2024-01-05',
        lastActivity: '2 hours ago'
      },
      { 
        id: 2, 
        name: 'Tech Solutions Inc', 
        email: 'info@techsolutions.com', 
        phone: '+1 555-0124',
        status: 'Contacted', 
        source: 'LinkedIn',
        value: '$75,000',
        assignedTo: 'Jane Smith',
        createdAt: '2024-01-04',
        lastActivity: '1 day ago'
      },
      { 
        id: 3, 
        name: 'Global Enterprises', 
        email: 'hello@global.com', 
        phone: '+1 555-0125',
        status: 'Qualified', 
        source: 'Referral',
        value: '$120,000',
        assignedTo: 'Bob Johnson',
        createdAt: '2024-01-03',
        lastActivity: '3 days ago'
      },
      { 
        id: 4, 
        name: 'Startup Labs', 
        email: 'team@startuplabs.com', 
        phone: '+1 555-0126',
        status: 'Converted', 
        source: 'Cold Call',
        value: '$25,000',
        assignedTo: 'Alice Brown',
        createdAt: '2024-01-02',
        lastActivity: '1 week ago'
      },
      { 
        id: 5, 
        name: 'Innovation Co', 
        email: 'contact@innovation.com', 
        phone: '+1 555-0127',
        status: 'Lost', 
        source: 'Email Campaign',
        value: '$30,000',
        assignedTo: 'Charlie Wilson',
        createdAt: '2024-01-01',
        lastActivity: '2 weeks ago'
      },
    ]);
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Qualified': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Converted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Lost': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Leads Management
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            Track and manage your sales leads
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            boxShadow: '0 4px 12px rgba(69, 104, 130, 0.3)'
          }}
        >
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lead
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 border" 
             style={{ 
               backgroundColor: 'var(--bg-secondary)', 
               borderColor: 'var(--border-primary)' 
             }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Total Leads
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                {leads.length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4 border" 
             style={{ 
               backgroundColor: 'var(--bg-secondary)', 
               borderColor: 'var(--border-primary)' 
             }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                New Leads
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                {leads.filter(l => l.status === 'New').length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4 border" 
             style={{ 
               backgroundColor: 'var(--bg-secondary)', 
               borderColor: 'var(--border-primary)' 
             }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Converted
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                {leads.filter(l => l.status === 'Converted').length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4 border" 
             style={{ 
               backgroundColor: 'var(--bg-secondary)', 
               borderColor: 'var(--border-primary)' 
             }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Total Value
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                $300K
              </p>
            </div>
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            style={{ 
              borderColor: 'var(--border-primary)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              focusRingColor: 'var(--accent-primary)'
            }}
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
          style={{ 
            borderColor: 'var(--border-primary)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            focusRingColor: 'var(--accent-primary)'
          }}
        >
          <option value="all">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
          style={{ 
            borderColor: 'var(--border-primary)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            focusRingColor: 'var(--accent-primary)'
          }}
        >
          <option value="all">All Sources</option>
          <option value="Website">Website</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Referral">Referral</option>
          <option value="Cold Call">Cold Call</option>
          <option value="Email Campaign">Email Campaign</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl border overflow-hidden" 
           style={{ 
             backgroundColor: 'var(--bg-secondary)', 
             borderColor: 'var(--border-primary)' 
           }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}>
                  Lead Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}>
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}>
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}>
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}>
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {lead.name}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {lead.email}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {lead.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {lead.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {lead.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {lead.lastActivity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
