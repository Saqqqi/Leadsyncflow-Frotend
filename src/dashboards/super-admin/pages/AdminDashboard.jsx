import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPendingRequests: 0,
    activeUsers: 0,
  });

  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleForm, setRoleForm] = useState({
    role: '',
    status: 'pending',
    department: ''
  });

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
        id: 2, 
        name: 'Jane Smith', 
        email: 'jane.smith@example.com',
        department: 'Marketing',
        currentRole: 'Marketing Analyst',
        requestedRole: 'Marketing Manager',
        requestDate: '2024-01-20',
        requestTime: '10:30 AM'
      },
      { 
        id: 4, 
        name: 'Alice Brown', 
        email: 'alice.brown@example.com',
        department: 'HR',
        currentRole: 'HR Executive',
        requestedRole: 'HR Manager',
        requestDate: '2024-01-22',
        requestTime: '02:15 PM'
      },
      { 
        id: 6, 
        name: 'David Lee', 
        email: 'david.lee@example.com',
        department: 'Operations',
        currentRole: 'Operations Executive',
        requestedRole: 'Operations Manager',
        requestDate: '2024-01-23',
        requestTime: '09:45 AM'
      },
      { 
        id: 8, 
        name: 'Frank Miller', 
        email: 'frank.m@example.com',
        department: 'Sales',
        currentRole: 'Sales Representative',
        requestedRole: 'Sales Manager',
        requestDate: '2024-01-21',
        requestTime: '11:20 AM'
      },
      { 
        id: 9, 
        name: 'Sarah Johnson', 
        email: 'sarah.j@example.com',
        department: 'Engineering',
        currentRole: 'Junior Developer',
        requestedRole: 'Software Engineer',
        requestDate: '2024-01-24',
        requestTime: '08:00 AM'
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

  const handleRoleClick = (user) => {
    setSelectedUser(user);
    setRoleForm({
      role: user.requestedRole || user.currentRole,
      status: 'pending',
      department: user.department
    });
    setShowRoleModal(true);
  };

  const handleRoleSubmit = () => {
    // Remove user from pending list when approved/disapproved
    setPendingUsers(pendingUsers.filter(user => user.id !== selectedUser.id));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalPendingRequests: prev.totalPendingRequests - 1,
      totalUsers: roleForm.status === 'approved' ? prev.totalUsers + 1 : prev.totalUsers,
      activeUsers: roleForm.status === 'approved' ? prev.activeUsers + 1 : prev.activeUsers
    }));
    
    setShowRoleModal(false);
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
                Review and assign roles to new user requests
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
                  Current Role
                </th>
                <th className="text-left p-6 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Requested Role
                </th>
                <th className="text-left p-6 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Requested On
                </th>
                <th className="text-left p-6 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id} 
                    className="border-b hover:bg-opacity-50 transition-all duration-200 hover:scale-[1.002]"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      backgroundColor: 'var(--bg-primary)'
                    }}>
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
                  <td className="p-6">
                    <span className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 text-sm font-medium">
                      {user.department}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-medium px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800"
                          style={{ color: 'var(--text-primary)' }}>
                      {user.currentRole}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 text-amber-700 dark:text-amber-300">
                      {user.requestedRole}
                    </span>
                  </td>
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
                  <td className="p-6">
                    <button 
                      onClick={() => handleRoleClick(user)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Assign Role
                    </button>
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
      </div>

      {/* Role Assignment Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="rounded-2xl border w-full max-w-lg transform transition-all duration-300 animate-slideUp"
               style={{ 
                 backgroundColor: 'var(--bg-secondary)', 
                 borderColor: 'var(--border-primary)',
                 boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
               }}>
            <div className="p-8 border-b" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Assign Role
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {selectedUser.name} • {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Department
                  </label>
                  <select 
                    value={roleForm.department}
                    onChange={(e) => setRoleForm({...roleForm, department: e.target.value})}
                    className="w-full p-4 rounded-xl border transition-all hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-primary)'
                    }}
                  >
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Customer Support">Customer Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Role
                  </label>
                  <select 
                    value={roleForm.role}
                    onChange={(e) => setRoleForm({...roleForm, role: e.target.value})}
                    className="w-full p-4 rounded-xl border transition-all hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-primary)'
                    }}
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Manager">Manager</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Senior">Senior</option>
                    <option value="Junior">Junior</option>
                    <option value="Guest">Guest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Approval Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setRoleForm({...roleForm, status: 'approved'})}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      roleForm.status === 'approved' 
                      ? 'border-green-500 bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      roleForm.status === 'approved' 
                      ? 'bg-green-500' 
                      : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <svg className={`h-6 w-6 ${roleForm.status === 'approved' ? 'text-white' : 'text-gray-400'}`} 
                           fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={`font-semibold ${roleForm.status === 'approved' ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                      Approve
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setRoleForm({...roleForm, status: 'disapproved'})}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      roleForm.status === 'disapproved' 
                      ? 'border-red-500 bg-gradient-to-b from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      roleForm.status === 'disapproved' 
                      ? 'bg-red-500' 
                      : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <svg className={`h-6 w-6 ${roleForm.status === 'disapproved' ? 'text-white' : 'text-gray-400'}`} 
                           fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className={`font-semibold ${roleForm.status === 'disapproved' ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'}`}>
                      Disapprove
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setRoleForm({...roleForm, status: 'pending'})}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      roleForm.status === 'pending' 
                      ? 'border-amber-500 bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      roleForm.status === 'pending' 
                      ? 'bg-amber-500' 
                      : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <svg className={`h-6 w-6 ${roleForm.status === 'pending' ? 'text-white' : 'text-gray-400'}`} 
                           fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className={`font-semibold ${roleForm.status === 'pending' ? 'text-amber-700 dark:text-amber-300' : 'text-gray-600 dark:text-gray-400'}`}>
                      Keep Pending
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 border-t flex justify-end gap-4" 
                 style={{ borderColor: 'var(--border-primary)' }}>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="px-6 py-3 text-sm font-medium rounded-xl border transition-all hover:scale-105 active:scale-95"
                style={{ 
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)'
                }}>
                Cancel
              </button>
              <button 
                onClick={handleRoleSubmit}
                className="px-6 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105 active:scale-95 hover:shadow-lg">
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}