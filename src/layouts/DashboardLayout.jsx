import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

import DynamicSidebar from '../components/DynamicSidebar';
import TokenStatus from '../components/TokenStatus';
import tokenManager from '../utils/tokenManager';
import { dashboardConfig } from '../dashboards/dashboardConfig';
import { getRoleDisplayName, getDashboardTitleFromPath } from '../utils/roleRedirect';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  /* Global Theme Management */
  const { theme, toggleTheme } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [user, setUser] = useState(null);

  // Find current dashboard & page
  const currentDashboard = dashboardConfig.find(db =>
    location.pathname.startsWith(db.basePath)
  );

  const currentPage = currentDashboard?.pages.find(page => {
    const fullPath = `${currentDashboard.basePath}${page.path ? '/' + page.path : ''}`;
    return (
      location.pathname === fullPath ||
      location.pathname === fullPath + '/'
    );
  });

  // Load user data
  useEffect(() => {
    const userData = tokenManager.getUser();
    setUser(userData);
  }, []);

  // Dynamic page title (tab title)
  useEffect(() => {
    const role = user?.role || user?.department;
    const roleLabel = role ? getRoleDisplayName(role) : null;

    const baseTitle = 'Lead Sync ';
    const dashboardLabel = currentDashboard?.name || getDashboardTitleFromPath(location.pathname);
    const pageLabel = currentPage?.name;

    const parts = [baseTitle];
    if (dashboardLabel) parts.push(dashboardLabel);
    if (pageLabel && pageLabel !== dashboardLabel) parts.push(pageLabel);
    if (roleLabel) parts.push(roleLabel);

    document.title = parts.filter(Boolean).join(' • ');
  }, [location.pathname, currentDashboard?.name, currentPage?.name, user?.role, user?.department]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Token validation & redirect
  useEffect(() => {
    if (!tokenManager.getToken() || !tokenManager.isCurrentTokenValid()) {
      tokenManager.clearAuthData();
      window.location.href = '/login';
      return;
    }

    tokenManager.initializeMonitoring();
  }, [navigate]);

  const handleLogout = () => {
    tokenManager.clearAuthData();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] transition-colors duration-300">
      <TokenStatus />

      <DynamicSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggle={() => setIsSidebarOpen(prev => !prev)}
        user={user}
      />

      {/* Floating Sidebar Toggle Button (Desktop) - appears when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-[70] w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border-2"
          style={{ 
            backgroundColor: 'var(--accent-primary)', 
            borderColor: 'var(--accent-primary)',
            color: 'white'
          }}
          title="Show Sidebar"
        >
          <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
          }`}
      >
        {/* Header */}
        <header
          className="h-16 border-b flex items-center justify-between px-4 md:px-6 transition-colors duration-300"
          style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}
        >
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden`}
              style={{ color: 'var(--text-primary)' }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop sidebar toggle - shows when sidebar is closed */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-all duration-300 group border-2"
                style={{ 
                  color: 'var(--accent-primary)',
                  borderColor: 'var(--accent-primary)',
                  backgroundColor: 'var(--accent-primary)/10'
                }}
                title="Show Sidebar"
              >
                <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h16" />
                </svg>
              </button>
            )}

            {/* Dashboard info */}
            {currentDashboard && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                  {currentDashboard.icon || '📊'}
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider opacity-60" style={{ color: 'var(--text-secondary)' }}>
                    Dashboard
                  </div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {currentDashboard.name}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              style={{ color: 'var(--text-primary)' }}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                // Sun Icon for Dark Mode (to switch to Light)
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                // Moon Icon for Light Mode (to switch to Dark)
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Current context pill */}
            {currentDashboard && (
              <div className="hidden sm:flex flex-col items-end px-3 py-1 rounded-lg border"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
                  Workspace
                </span>
                <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-primary)' }}>
                  <span className="font-extrabold">{currentDashboard.name}</span>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <span className="opacity-70">{currentPage?.name || 'Overview'}</span>
                </div>
              </div>
            )}

            {/* Notification */}
            <button
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] relative transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-primary)]" />
            </button>

            {/* User profile & logout */}
            <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="text-right">
                <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</div>
                <div className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 mt-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                  {user?.department || user?.role || 'Team'}
                </div>
              </div>

              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg transition-transform hover:scale-105 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                }}
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}