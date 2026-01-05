import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPendingRequests: 0,
    activeUsers: 0,
  });

  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    // Mock data for demonstration
    setStats({
      totalUsers: 1247,
      totalPendingRequests: 42,
      activeUsers: 892,
    });

    // Only pending users for the list
    setPendingUsers([
      { 
        id: 1, 
        name: 'Jane Smith', 
        email: 'jane.smith@example.com',
        department: 'Marketing',
        requestDate: '2024-01-20',
        requestTime: '10:30 AM',
        assignedRole: '',
        status: 'pending'
      },
      { 
        id: 2, 
        name: 'Alice Brown', 
        email: 'alice.brown@example.com',
        department: 'HR',
        requestDate: '2024-01-22',
        requestTime: '02:15 PM',
        assignedRole: '',
        status: 'pending'
      },
      { 
        id: 3, 
        name: 'David Lee', 
        email: 'david.lee@example.com',
        department: 'Operations',
        requestDate: '2024-01-23',
        requestTime: '09:45 AM',
        assignedRole: '',
        status: 'pending'
      },
      { 
        id: 4, 
        name: 'Frank Miller', 
        email: 'frank.m@example.com',
        department: 'Sales',
        requestDate: '2024-01-21',
        requestTime: '11:20 AM',
        assignedRole: '',
        status: 'pending'
      },
      { 
        id: 5, 
        name: 'Sarah Johnson', 
        email: 'sarah.j@example.com',
        department: 'Engineering',
        requestDate: '2024-01-24',
        requestTime: '08:00 AM',
        assignedRole: '',
        status: 'pending'
      },
    ]);
  }, []);

  const StatCard = ({ title, value, subtitle, icon, trend, bgColor, iconColor }) => (
    <div className="rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group flex-1"
         style={{ 
           backgroundColor: 'var(--bg-secondary)', 
           borderColor: 'var(--border-primary)' 
         }}>
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 w-1 h-full ${bgColor.replace('bg-', 'bg-gradient-to-b from-')} opacity-10`}></div>
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1 tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
            {title}
          </p>
          <p className="text-4xl font-bold mt-3 mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm mt-2 flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
              {trend && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${trend > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                </span>
              )}
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColor} transition-transform duration-300 group-hover:scale-110`}>
          <div className="text-white" style={{ color: iconColor }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  const handleRoleChange = (userId, role) => {
    setPendingUsers(users => 
      users.map(user => 
        user.id === userId ? { ...user, assignedRole: role } : user
      )
    );
  };

  const handleApprove = (userId) => {
    const user = pendingUsers.find(u => u.id === userId);
    if (user && user.assignedRole) {
      // Remove from pending list
      setPendingUsers(users => users.filter(u => u.id !== userId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalPendingRequests: prev.totalPendingRequests - 1,
        totalUsers: prev.totalUsers + 1,
        activeUsers: prev.activeUsers + 1
      }));
    }
  };

  const handleDisapprove = (userId) => {
    // Remove from pending list
    setPendingUsers(users => users.filter(u => u.id !== userId));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalPendingRequests: prev.totalPendingRequests - 1
    }));
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      disapproved: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-lg" style={{ color: 'var(--text-secondary)' }}>
          Manage user requests and system permissions
        </p>
      </div>

      {/* 3 Cards in One Row */}
      <div className="flex gap-4 lg:gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subtitle={`${stats.activeUsers} currently active`}
          trend={12.5}
          icon={
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          bgColor="bg-gradient-to-br from-emerald-500 to-green-600"
          iconColor="#ffffff"
        />
      </div>

      {/* Pending Requests Section */}
      <div className="rounded-2xl border overflow-hidden" 
           style={{ 
             backgroundColor: 'var(--bg-secondary)', 
             borderColor: 'var(--border-primary)'
           }}>
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Pending Approval Requests
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Assign roles and approve/disapprove user requests directly
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-sm font-medium">
                {pendingUsers.length} requests
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }} 
                  className="border-b">
                <th className="text-left p-6 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  User Details
                </th>
                <th className="text-left p-6 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Department
                </th>
                <th className="text-left p-6 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Requested On
                </th>
                <th className="text-left p-6 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Assign Role
                </th>
                <th className="text-left p-6 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Actions
                </th>
                <th className="text-left p-6 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id} 
                    className="border-b transition-all duration-200 hover:bg-opacity-50"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      backgroundColor: 'var(--bg-primary)'
                    }}>
                  {/* User Details */}
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {user.name}
                        </p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Department */}
                  <td className="p-6">
                    <span className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 text-sm font-medium">
                      {user.department}
                    </span>
                  </td>
                  
                  {/* Request Date & Time */}
                  <td className="p-6">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {user.requestDate}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        {user.requestTime}
                      </p>
                    </div>
                  </td>
                  
                  {/* Role Dropdown */}
                  <td className="p-6">
                    <div className="relative">
                      <select 
                        value={user.assignedRole}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border transition-all hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 appearance-none bg-no-repeat bg-right pr-12"
                        style={{ 
                          borderColor: user.assignedRole ? 'var(--border-primary)' : '#ef4444',
                          color: 'var(--text-primary)',
                          backgroundColor: 'var(--bg-primary)',
                          backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")',
                          backgroundSize: '1.5em 1.5em'
                        }}
                      >
                        <option value="">Select Role</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Manager">Manager</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="Senior Employee">Senior Employee</option>
                        <option value="Junior Employee">Junior Employee</option>
                        <option value="Guest User">Guest User</option>
                      </select>
                      {!user.assignedRole && (
                        <p className="text-xs text-red-500 mt-1">Please select a role</p>
                      )}
                    </div>
                  </td>
                  
                  {/* Action Buttons */}
                  <td className="p-6">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleApprove(user.id)}
                        disabled={!user.assignedRole}
                        className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 flex-1 justify-center
                          ${user.assignedRole 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:scale-105 active:scale-95' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                      
                      <button 
                        onClick={() => handleDisapprove(user.id)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium hover:from-red-600 hover:to-rose-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 flex-1 justify-center"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Disapprove
                      </button>
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="p-6">
                    <StatusBadge status={user.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pendingUsers.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
              <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No Pending Requests
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              All user requests have been processed
            </p>
          </div>
        )}

        {/* Table Footer */}
        <div className="p-6 border-t flex justify-between items-center" 
             style={{ borderColor: 'var(--border-primary)' }}>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Showing {pendingUsers.length} pending requests
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
              Requires role assignment
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="rounded-2xl border p-6" 
           style={{ 
             backgroundColor: 'var(--bg-secondary)', 
             borderColor: 'var(--border-primary)'
           }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Quick Stats
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Today's activity summary
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {pendingUsers.filter(u => u.assignedRole).length}
              </div>
              <div className="text-xs uppercase tracking-wide mt-1" style={{ color: 'var(--text-secondary)' }}>
                Ready to Approve
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {pendingUsers.filter(u => !u.assignedRole).length}
              </div>
              <div className="text-xs uppercase tracking-wide mt-1" style={{ color: 'var(--text-secondary)' }}>
                Need Role
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}