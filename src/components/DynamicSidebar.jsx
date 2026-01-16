import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { dashboardConfig } from '../dashboards/dashboardConfig';
import { useLeadCounts } from '../hooks/useLeadCounts';

export default function DynamicSidebar({ isOpen, onClose, onToggle, user }) {
  const location = useLocation();
  const userRole = user?.role || user?.department;
  const counts = useLeadCounts(userRole);

  // Find current dashboard and page
  const currentPath = location.pathname;
  const currentDashboard = dashboardConfig.find(dashboard =>
    currentPath.startsWith(dashboard.basePath)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-[60] h-full transform transition-all duration-300 ease-in-out
        w-64 border-r shadow-2xl group/sidebar
        sm:fixed sm:translate-x-0 sm:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>

        {/* Sidebar Header */}
        <div className="h-20 border-b flex items-center justify-center px-4 md:px-6"
          style={{ borderColor: 'var(--border-primary)' }}>
          {/* Mobile close button */}
          <button
            onClick={onToggle}
            className="absolute left-4 md:left-6 p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all active:scale-95"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center">
            <img 
              src="/Logo - Lead Sync.(Lght Mode).svg" 
              alt="Lead Sync Flow Logo" 
              className="h-20 w-20 md:h-24 md:w-24 dark:hidden"
            />
            <img 
              src="/Logo - Lead Sync.(Dark Mode).svg" 
              alt="Lead Sync Flow Logo" 
              className="h-20 w-20 md:h-24 md:w-24 hidden dark:block"
            />
          </div>
        </div>

        {/* Sidebar Expansion Toggle Line (Desktop) */}
        <div
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-24 items-center justify-center cursor-pointer group/toggle z-10"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <div className="w-1 h-12 rounded-full bg-gray-300 dark:bg-gray-700 group-hover/toggle:bg-blue-500 transition-all duration-300 group-hover/toggle:h-16"></div>
          {/* Floating Arrow Icon on the Line */}
          <div className="absolute right-0 w-5 h-5 bg-white dark:bg-gray-800 border-y border-l rounded-l-md flex items-center justify-center opacity-0 group-hover/toggle:opacity-100 transition-opacity transform"
            style={{ borderColor: 'var(--border-primary)' }}>
            <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 128px)' }}>
          {!currentDashboard && (
            <div className="px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
              Configuration Unknown
            </div>
          )}
          {currentDashboard && (
            <div className="space-y-2">
              {/* Current Dashboard Header */}
              <div className="mb-3 md:mb-4">
                <div className="flex items-center gap-2 md:gap-3 px-3 py-2 rounded-xl"
                  style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                  <span className="flex-shrink-0 text-lg md:text-xl text-[var(--accent-primary)]">{currentDashboard.icon}</span>
                  <span className="font-black text-sm md:text-base uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>
                    {currentDashboard.name}
                  </span>
                </div>
              </div>

              {/* Current Dashboard Pages */}
              {currentDashboard.pages.filter(page => {
                // Check if page should be shown in sidebar
                if (page.showInSidebar === false) return false;

                // Check role permissions if defined
                if (page.allowedRoles && (!userRole || !page.allowedRoles.includes(userRole))) {
                  return false;
                }

                return true;
              }).map((page) => {
                const pagePath = `${currentDashboard.basePath}${page.path ? '/' + page.path : ''}`;
                const isPageActive = currentPath === pagePath;
                const showInSidebar = page.showInSidebar !== false; // Default to true

                return (
                  <Link
                    key={pagePath}
                    to={pagePath}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="flex items-center gap-2 md:gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group/item"
                    style={{
                      backgroundColor: isPageActive ? 'var(--accent-primary)' : 'transparent',
                      color: isPageActive ? '#FFFFFF' : 'var(--text-secondary)',
                      boxShadow: isPageActive ? '0 10px 20px -5px var(--accent-primary)' : 'none'
                    }}
                  >
                    <span className={`flex-shrink-0 text-base md:text-lg ${isPageActive ? 'text-white' : 'group-hover/item:text-[var(--accent-primary)]'}`}>
                      {page.icon}
                    </span>
                    <span className={`text-sm md:text-base font-bold ${isPageActive ? 'text-white' : 'group-hover/item:text-[var(--text-primary)]'}`}>
                      {page.name}
                    </span>
                    {page.name === 'New Leads' && counts.newLeads > 0 && (
                      <span className="ml-auto bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-lg shadow-rose-500/40">
                        {counts.newLeads}
                      </span>
                    )}
                    {isPageActive && !(page.name === 'New Leads' && counts.newLeads > 0) && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t"
          style={{ borderColor: 'var(--border-primary)' }}>
          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Multi-Dashboard System
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
              Version 2.0.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
