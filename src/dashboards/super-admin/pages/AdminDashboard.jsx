import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../api/admin.api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPendingRequests: 0,
    activeUsers: 0,
  });

  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Format: { userId: 'approve' | 'disapprove' }

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getPendingRequests();
      const requests = data.requests || [];
      
      // Transform API data to match existing format
      const transformedRequests = requests.map((request, index) => ({
        id: request._id,
        name: request.name,
        email: request.email,
        department: request.department,
        requestDate: new Date(request.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        requestTime: new Date(request.createdAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        assignedRole: '',
        status: 'pending'
      }));

      setPendingUsers(transformedRequests);
      setStats({
        totalUsers: data.totalUsers || 1247, // Fallback to mock if API doesn't provide
        totalPendingRequests: transformedRequests.length,
        activeUsers: data.activeUsers || 892, // Fallback to mock if API doesn't provide
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending requests');
      console.error('Error fetching pending requests:', err);
      // Keep mock data as fallback
      setStats({
        totalUsers: 1247,
        totalPendingRequests: 42,
        activeUsers: 892,
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, trend, bgColor, iconColor }) => (
    <div className="rounded-xl p-4 border transition-all duration-300 hover:shadow-md relative overflow-hidden group w-full min-w-0"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)'
      }}>
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 w-1 h-full ${bgColor.replace('bg-', 'bg-gradient-to-b from-')} opacity-10`}></div>

      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium mb-1 tracking-wide uppercase truncate" style={{ color: 'var(--text-secondary)' }}>
            {title}
          </p>
          <p className="text-2xl lg:text-3xl font-bold mt-2 mb-1 tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs mt-1 flex items-center gap-1 truncate" style={{ color: 'var(--text-tertiary)' }}>
              {trend && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${trend > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                </span>
              )}
              <span className="truncate">{subtitle}</span>
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${bgColor} transition-transform duration-300 group-hover:scale-110 ml-3 flex-shrink-0`}>
          <div className="text-white" style={{ color: iconColor }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  const handleRoleChange = (userId, role) => {
    console.log('Role change:', userId, role); // Debug log
    setPendingUsers(users =>
      users.map(user =>
        user.id === userId ? { ...user, assignedRole: role } : user
      )
    );
  };

  const handleApprove = async (userId) => {
    const user = pendingUsers.find(u => u.id === userId);
    console.log('Approve user:', user); // Debug log
    if (user && user.assignedRole && user.assignedRole.trim() !== '') {
      try {
        setActionLoading({ [userId]: 'approve' });
        await adminAPI.approveRequest(userId, user.assignedRole);
        
        // Remove from pending list
        setPendingUsers(users => users.filter(u => u.id !== userId));

        // Update stats
        setStats(prev => ({
          ...prev,
          totalPendingRequests: prev.totalPendingRequests - 1,
          totalUsers: prev.totalUsers + 1,
          activeUsers: prev.activeUsers + 1
        }));
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to approve request');
        console.error('Error approving request:', err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleDisapprove = async (userId) => {
    try {
      setActionLoading({ [userId]: 'disapprove' });
      await adminAPI.rejectRequest(userId);
      
      // Remove from pending list
      setPendingUsers(users => users.filter(u => u.id !== userId));

      // Update stats
      setStats(prev => ({
        ...prev,
        totalPendingRequests: prev.totalPendingRequests - 1
      }));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request');
      console.error('Error rejecting request:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      disapproved: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-4">


      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Loading Display */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && (
        <>
      {/* 3 Cards in One Row - Responsive */}
      {/* 3 Cards in One Row */}
      <div className="flex gap-4 lg:gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subtitle={`${stats.activeUsers} active`}
          trend={12.5}
          icon={
            <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
          iconColor="#ffffff"
        />

        <StatCard
          title="Pending Requests"
          value={stats.totalPendingRequests}
          subtitle="Awaiting approval"
          trend={8.2}
          icon={
            <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          bgColor="bg-gradient-to-br from-amber-500 to-orange-500"
          iconColor="#ffffff"
        />

        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          subtitle="Currently online"
          trend={-3.1}
          icon={
            <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          bgColor="bg-gradient-to-br from-emerald-500 to-green-600"
          iconColor="#ffffff"
        />
      </div>

      {/* Pending Requests Section - Compact Design */}
      <div className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Pending Approval Requests
              </h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Assign roles and approve/disapprove user requests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs font-medium">
                {pendingUsers.length} requests
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}
                className="border-b">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  User Details
                </th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Department
                </th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Requested On
                </th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Assign Role
                </th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Actions
                </th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id}
                  className="border-b transition-colors duration-150 hover:bg-opacity-50"
                  style={{
                    borderColor: 'var(--border-primary)',
                    backgroundColor: 'var(--bg-primary)'
                  }}>
                  {/* User Details - Compact */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {user.name}
                        </p>
                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Department - Compact */}
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 text-xs font-medium">
                      {user.department}
                    </span>
                  </td>

                  {/* Request Date & Time - Compact */}
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {user.requestDate}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {user.requestTime}
                      </p>
                    </div>
                  </td>

                  {/* Role Dropdown - Compact */}
                  <td className="p-4">
                    <div className="relative min-w-[120px]">
                      <select
                        value={user.assignedRole}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-sm transition-all hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-800 appearance-none bg-no-repeat bg-right pr-8"
                        style={{
                          borderColor: user.assignedRole ? 'var(--border-primary)' : '#ef4444',
                          color: 'var(--text-primary)',
                          backgroundColor: 'var(--bg-primary)',
                          backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")',
                          backgroundSize: '1em 1em'
                        }}
                      >
                        <option value="">Select Role</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Team lead(Lead qualifiers,)">Team Lead (Lead Qualifiers)</option>
                        <option value="Lead qualifiers">Lead Qualifiers</option>
                        <option value="Team lead (data minors )">Team Lead (Data Miners)</option>
                        <option value="data minors">Data Miners</option>
                        <option value="quality assurance">Quality Assurance</option>
                        <option value="Team lead(quality assurance)">Team Lead (Quality Assurance)</option>

                      </select>
                      {!user.assignedRole && (
                        <p className="text-xs text-red-500 mt-1 whitespace-nowrap">Select role</p>
                      )}
                    </div>
                  </td>

                  {/* Action Buttons - Compact */}
                  <td className="p-4">
                    <div className="flex flex-col sm:flex-row gap-2 min-w-[140px]">
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={!user.assignedRole || actionLoading?.[user.id]}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-1.5
                          ${user.assignedRole && !actionLoading?.[user.id]
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-md active:scale-95'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        {actionLoading?.[user.id] === 'approve' ? (
                          <React.Fragment>
                            <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="sm:inline">Approve</span>
                          </React.Fragment>
                        )}
                      </button>

                      <button
                        onClick={() => handleDisapprove(user.id)}
                        disabled={actionLoading?.[user.id]}
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium text-sm hover:from-red-600 hover:to-rose-700 transition-all duration-200 hover:shadow-md active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading?.[user.id] === 'disapprove' ? (
                          <React.Fragment>
                            <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="sm:inline">Disapprove</span>
                          </React.Fragment>
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Status - Compact */}
                  <td className="p-4">
                    <StatusBadge status={user.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pendingUsers.length === 0 && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              No Pending Requests
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              All user requests have been processed
            </p>
          </div>
        )}

        {/* Table Footer - Compact */}
        <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2"
          style={{ borderColor: 'var(--border-primary)' }}>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Showing {pendingUsers.length} pending requests
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs flex items-center" style={{ color: 'var(--text-secondary)' }}>
              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1.5"></span>
              Requires role assignment
            </div>
            <div className="text-xs flex items-center" style={{ color: 'var(--text-secondary)' }}>
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
              Ready to approve
            </div>
          </div>
        </div>
      </div>


      </>
      )}
    </div>
  );
}