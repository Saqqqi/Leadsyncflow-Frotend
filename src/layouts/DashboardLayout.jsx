import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import DynamicSidebar from '../components/DynamicSidebar';
import TokenStatus from '../components/TokenStatus';
import tokenManager from '../utils/tokenManager';
import { dashboardConfig } from '../dashboards/dashboardConfig';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [user, setUser] = useState(null);

  // Find current dashboard and page for header info
  const currentDashboard = dashboardConfig.find(db =>
    location.pathname.startsWith(db.basePath)
  );

  const currentPage = currentDashboard?.pages.find(page => {
    const pagePath = `${currentDashboard.basePath}${page.path ? '/' + page.path : ''}`;
    return location.pathname === pagePath || location.pathname === pagePath + '/';
  });

  useEffect(() => {
    // Get user data on mount
    const userData = tokenManager.getUser();
    setUser(userData);
  }, []);

  // Sync sidebar state with window resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for expired token on component mount
  // Note: tokenManager already handles periodic checks, so we just verify on mount
  useEffect(() => {
    const token = tokenManager.getToken();

    // If no token or token is invalid, redirect to login
    if (!token || !tokenManager.isCurrentTokenValid()) {
      console.log('Invalid or expired token in DashboardLayout, redirecting...');
      tokenManager.clearAuthData();
      window.location.href = '/login';
    }

    // Ensure monitoring is started (tokenManager handles periodic checks)
    tokenManager.initializeMonitoring();
  }, [navigate]);

  // Handle Logout
  const handleLogout = () => {
    tokenManager.clearAuthData();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Token Status Component - Global for all dashboard pages */}
      <TokenStatus />

      {/* Dynamic Sidebar - Always visible on large screens, controlled on mobile */}
      <DynamicSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4 md:px-6"
          style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`${isSidebarOpen ? 'lg:hidden' : 'flex'} p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300`}
              style={{ color: 'var(--text-primary)' }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumbs / Dashboard Name */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                {currentDashboard?.icon || "📊"}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider opacity-50" style={{ color: 'var(--text-primary)' }}>
                  Dashboard
                </span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {currentDashboard?.name || "Leadsync Flow"}
                </span>
              </div>
            </div>
          </div>


          <div className="flex items-center gap-3">
            {/* Dashboard Context Pill */}
            <div className="hidden sm:flex flex-col items-end px-3 py-1 rounded-lg bg-gray-100/50 dark:bg-gray-800/40 border border-blue-500/10 mr-2">
              <span className="text-[8px] font-bold text-blue-600 uppercase tracking-tighter leading-none mb-0.5">
                Workspace
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                  {currentDashboard?.name || "Loading..."}
                </span>
                <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                <span className="text-[11px] font-medium opacity-60 whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                  {currentPage?.name || 'Overview'}
                </span>
              </div>
            </div>

            {/* Notification Button */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
              style={{ color: 'var(--text-primary)' }}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>

            {/* User Profile Section */}
            <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {user?.name || 'User'}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-tight px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-600 border border-green-500/20">
                  {user?.department || user?.role || 'Team'}
                </span>
              </div>

              <div className="group relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg transition-transform hover:scale-105 cursor-pointer shadow-lg"
                  style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="ml-1 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500 transition-all duration-200"
                title="Logout"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}