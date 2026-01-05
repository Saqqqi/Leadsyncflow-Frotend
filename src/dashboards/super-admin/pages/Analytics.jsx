import React, { useState, useEffect } from 'react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Mock chart data
    setChartData([
      { date: 'Jan 1', leads: 12, conversions: 3, revenue: 15000 },
      { date: 'Jan 2', leads: 19, conversions: 5, revenue: 25000 },
      { date: 'Jan 3', leads: 15, conversions: 4, revenue: 20000 },
      { date: 'Jan 4', leads: 25, conversions: 8, revenue: 40000 },
      { date: 'Jan 5', leads: 22, conversions: 6, revenue: 30000 },
      { date: 'Jan 6', leads: 30, conversions: 10, revenue: 50000 },
      { date: 'Jan 7', leads: 28, conversions: 9, revenue: 45000 },
    ]);
  }, []);

  const metrics = [
    { 
      title: 'Total Leads', 
      value: '1,234', 
      change: '+12.5%', 
      trend: 'up',
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    { 
      title: 'Conversion Rate', 
      value: '68.5%', 
      change: '+5.2%', 
      trend: 'up',
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    { 
      title: 'Revenue', 
      value: '$245.6K', 
      change: '+18.3%', 
      trend: 'up',
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-purple-500'
    },
    { 
      title: 'Active Users', 
      value: '892', 
      change: '-2.1%', 
      trend: 'down',
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-orange-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Analytics Dashboard
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            Track your performance and growth metrics
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
          style={{ 
            borderColor: 'var(--border-primary)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            focusRingColor: 'var(--accent-primary)'
          }}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="rounded-xl p-6 border" 
               style={{ 
                 backgroundColor: 'var(--bg-secondary)', 
                 borderColor: 'var(--border-primary)' 
               }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {metric.title}
                </p>
                <p className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                  {metric.value}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <span style={{ color: metric.trend === 'up' ? '#10b981' : '#ef4444' }}>
                    {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
                  </span>
                  <span className="ml-2" style={{ color: 'var(--text-tertiary)' }}>
                    from last period
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${metric.color}`}>
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Chart */}
        <div className="rounded-xl border p-6" 
             style={{ 
               backgroundColor: 'var(--bg-secondary)', 
               borderColor: 'var(--border-primary)' 
             }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Leads Overview
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                  style={{ 
                    height: `${(data.leads / 30) * 100}%`,
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                  }}
                ></div>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {data.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversions Chart */}
        <div className="rounded-xl border p-6" 
             style={{ 
               backgroundColor: 'var(--bg-secondary)', 
               borderColor: 'var(--border-primary)' 
             }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Conversion Funnel
          </h2>
          <div className="space-y-3">
            {[
              { stage: 'Total Leads', count: 1250, percentage: 100, color: 'bg-blue-500' },
              { stage: 'Qualified', count: 890, percentage: 71, color: 'bg-purple-500' },
              { stage: 'Contacted', count: 670, percentage: 54, color: 'bg-yellow-500' },
              { stage: 'Converted', count: 450, percentage: 36, color: 'bg-green-500' },
            ].map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-primary)' }}>{stage.stage}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{stage.count} ({stage.percentage}%)</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div 
                    className={`h-2 rounded-full ${stage.color}`}
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border p-6" 
           style={{ 
             backgroundColor: 'var(--bg-secondary)', 
             borderColor: 'var(--border-primary)' 
           }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Revenue Trends
        </h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ 
                  height: `${(data.revenue / 50000) * 100}%`,
                  background: 'linear-gradient(135deg, #10b981, #059669)'
                }}
              ></div>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {data.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6" 
             style={{ 
               backgroundColor: 'var(--bg-secondary)', 
               borderColor: 'var(--border-primary)' 
             }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Top Lead Sources
          </h2>
          <div className="space-y-3">
            {[
              { source: 'Website', leads: 450, percentage: 36 },
              { source: 'LinkedIn', leads: 320, percentage: 26 },
              { source: 'Referral', leads: 280, percentage: 22 },
              { source: 'Email Campaign', leads: 120, percentage: 10 },
              { source: 'Cold Call', leads: 80, percentage: 6 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.source}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.leads}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-900/20" 
                        style={{ color: 'var(--text-secondary)' }}>
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-6" 
             style={{ 
               backgroundColor: 'var(--bg-secondary)', 
               borderColor: 'var(--border-primary)' 
             }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Team Performance
          </h2>
          <div className="space-y-3">
            {[
              { name: 'John Doe', leads: 89, conversions: 45, rate: '50.6%' },
              { name: 'Jane Smith', leads: 76, conversions: 38, rate: '50.0%' },
              { name: 'Bob Johnson', leads: 92, conversions: 42, rate: '45.7%' },
              { name: 'Alice Brown', leads: 68, conversions: 35, rate: '51.5%' },
              { name: 'Charlie Wilson', leads: 71, conversions: 32, rate: '45.1%' },
            ].map((person, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0"
                   style={{ borderColor: 'var(--border-primary)' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {person.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {person.leads} leads, {person.conversions} conversions
                  </p>
                </div>
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                  {person.rate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
