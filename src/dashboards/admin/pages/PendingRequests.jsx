import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../api/admin.api';
import SharedLoader from '../../../components/SharedLoader';

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState({});

  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      else setRefreshing(true);

      const data = await adminAPI.getPendingRequests();
      setRequests(data.requests || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching pending requests:', err);
      if (!isBackground) {
        setError(err.response?.data?.message || 'Failed to fetch pending requests');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApprove = async (requestId, role = 'User') => {
    try {
      setActionLoading(requestId);
      await adminAPI.approveRequest(requestId, role);
      setRequests(prev => prev.filter(req => req._id !== requestId));
      setError(null);
      // Notify other components (like Sidebar) to update their counts immediately
      window.dispatchEvent(new CustomEvent('pendingRequestsUpdated', { detail: { change: -1 } }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve request');
      console.error('Error approving request:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionLoading(requestId);
      await adminAPI.rejectRequest(requestId);
      setRequests(prev => prev.filter(req => req._id !== requestId));
      setError(null);
      // Notify other components (like Sidebar) to update their counts immediately
      window.dispatchEvent(new CustomEvent('pendingRequestsUpdated', { detail: { change: -1 } }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request');
      console.error('Error rejecting request:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <SharedLoader />;
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom right, var(--color-primary), var(--bg-secondary), var(--accent-secondary))' }}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-10" style={{ background: 'var(--accent-success)', filter: 'blur(60px)' }}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-10" style={{ background: 'var(--accent-primary)', filter: 'blur(80px)' }}></div>
      </div>
      {/* Header */}
      <div className="mb-8">
        <div className="rounded-2xl p-8 border backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--accent-success) / 20', border: '2px solid var(--accent-success) / 30' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--accent-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Pending Requests
                </h1>
                <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Manage and approve user registration requests
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex flex-col items-end">
                <button
                  onClick={() => fetchPendingRequests(true)}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <svg
                    className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                    style={{ color: 'var(--accent-success)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </span>
                </button>
                <p className="text-[10px] mt-1 font-bold uppercase tracking-tighter opacity-50" style={{ color: 'var(--text-tertiary)' }}>
                  Last Checked: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>

              <div
                className="px-8 py-3 rounded-2xl border backdrop-blur-md flex items-center gap-5 min-w-[240px] transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--accent-success) / 10',
                  borderColor: 'var(--accent-success) / 30',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div className="p-3.5 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: 'var(--accent-success) / 20' }}>
                  <svg className="w-8 h-8" style={{ color: 'var(--accent-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <span className="text-3xl font-black leading-none tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {requests.length}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-widest opacity-90" style={{ color: 'var(--accent-success)' }}>
                    Pending Requests
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl p-6 border backdrop-blur-sm animate-pulse" style={{ backgroundColor: 'var(--accent-error) / 10', borderColor: 'var(--accent-error) / 30' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-2 rounded-full" style={{ backgroundColor: 'var(--accent-error) / 20' }}>
                <svg className="h-6 w-6" style={{ color: 'var(--accent-error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold" style={{ color: 'var(--accent-error)' }}>{error}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--accent-error) / 70' }}>Please try again</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        {requests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 border" style={{ backgroundColor: 'var(--accent-success) / 20', borderColor: 'var(--accent-success) / 50' }}>
              <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>All Caught Up!</h3>
            <p className="max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              No pending user registration requests at the moment. All user requests have been processed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      User Information
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Department
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Request Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                {requests.map((request, index) => (
                  <tr key={request._id} className="transition-all duration-200" style={{ hover: { backgroundColor: 'var(--bg-tertiary)' } }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg" style={{ backgroundColor: 'var(--accent-success)' }}>
                          {request.name ? request.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{request.name}</div>
                          <div className="text-sm flex items-center" style={{ color: 'var(--text-secondary)' }}>
                            <svg className="w-3 h-3 mr-1" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {request.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border" style={{ backgroundColor: 'var(--accent-success) / 20', color: 'var(--accent-success)', borderColor: 'var(--accent-success) / 50' }}>
                        <svg className="w-3 h-3 mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {request.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm flex items-center" style={{ color: 'var(--text-secondary)' }}>
                        <svg className="w-4 h-4 mr-2" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(request.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <select
                          value={selectedRoles[request._id] || ''}
                          onChange={(e) => setSelectedRoles({ ...selectedRoles, [request._id]: e.target.value })}
                          className="px-3 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--border-primary)',
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            focusRingColor: 'var(--accent-primary)'
                          }}
                          disabled={actionLoading === request._id}
                        >
                          <option value="" disabled>Select Role</option>
                          <option value="Data Minors">Data Minors</option>
                          <option value="Lead Qualifiers">Lead Qualifiers</option>
                          <option value="Verifier">Verifier</option>
                          <option value="Manager">Manager</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleApprove(request._id, selectedRoles[request._id])}
                          disabled={actionLoading === request._id || !selectedRoles[request._id]}
                          className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                          style={{
                            background: 'linear-gradient(to right, var(--accent-success), var(--accent-success))',
                            boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)'
                          }}
                        >
                          {actionLoading === request._id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          disabled={actionLoading === request._id}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                        >
                          {actionLoading === request._id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
