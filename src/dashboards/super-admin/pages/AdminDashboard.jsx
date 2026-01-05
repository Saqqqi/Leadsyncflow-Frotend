import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLeads: 0,
    activeUsers: 0,
    conversionRate: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Mock data for demonstration
    setStats({
      totalUsers: 1247,
      totalLeads: 5632,
      activeUsers: 892,
      conversionRate: 68.5,
    });

    setRecentActivity([
      { id: 1, user: 'John Doe', action: 'Created new lead', time: '2 minutes ago', type: 'success' },
      { id: 2, user: 'Jane Smith', action: 'Updated user profile', time: '5 minutes ago', type: 'info' },
      { id: 3, user: 'Bob Johnson', action: 'Deleted lead', time: '12 minutes ago', type: 'warning' },
      { id: 4, user: 'Alice Brown', action: 'Added new user', time: '1 hour ago', type: 'success' },
      { id: 5, user: 'Charlie Wilson', action: 'Modified settings', time: '2 hours ago', type: 'info' },
    ]);
  }, []);

  const StatCard = ({ title, value, icon, trend, color }) => (
    <div className="rounded-xl p-6 border" 
         style={{ 
           backgroundColor: 'var(--bg-secondary)', 
           borderColor: 'var(--border-primary)' 
         }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {title}
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <span style={{ color: trend > 0 ? '#10b981' : '#ef4444' }}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="ml-2" style={{ color: 'var(--text-tertiary)' }}>
                from last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Admin Dashboard
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
          Welcome back! Here's what's happening with your system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          trend={12.5}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Leads"
          value={stats.totalLeads.toLocaleString()}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          trend={8.2}
          color="bg-green-500"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          trend={-3.1}
          color="bg-purple-500"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          }
          trend={5.7}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl border p-6" 
             style={{ 
               backgroundColor: 'var(--bg-secondary)', 
               borderColor: 'var(--border-primary)' 
             }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-0"
                   style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {activity.user}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {activity.action}
                    </p>
                  </div>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border p-6" 
             style={{ 
               backgroundColor: 'var(--bg-secondary)', 
               borderColor: 'var(--border-primary)' 
             }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)'
                    }}>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium">Add New User</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)'
                    }}>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium">Generate Report</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)'
                    }}>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">System Settings</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}