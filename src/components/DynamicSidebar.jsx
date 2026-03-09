import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { dashboardConfig } from '../dashboards/dashboardConfig';

export default function DynamicSidebar({ isOpen, isCollapsed, onClose, onToggle, onToggleCollapse, user }) {
  const location = useLocation();
  const userRole = user?.role || user?.department;

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
        border-r border-[var(--border-primary)] shadow-xl group/sidebar bg-[var(--bg-secondary)]
        sm:fixed sm:translate-x-0 sm:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Border Click Zone - "Drag to make it less" indicator */}
        <div
          onClick={onToggleCollapse}
          className={`
            absolute top-0 -right-1 w-2.5 h-full cursor-col-resize z-[65] 
            hover:bg-[var(--accent-primary)]/20 transition-all duration-300 group/border
            flex items-center justify-center hidden lg:flex
          `}
        >
          <div className="w-0.5 h-16 bg-[var(--accent-primary)] opacity-0 group-hover/border:opacity-100 rounded-full transition-opacity" />
        </div>

        {/* Sidebar Header */}
        <div className={`h-20 border-b border-[var(--border-primary)] flex items-center relative transition-all duration-300 ${isCollapsed ? 'justify-center px-1' : 'px-4 md:px-6'}`}>
          {!isCollapsed ? (
            <>
              {/* Hide Button (X) */}
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-tertiary)] hover:text-red-500 transition-all active:scale-95"
                title="Hide Sidebar"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Logo (Centered between buttons) */}
              <div className="flex-1 flex justify-center px-2 overflow-hidden">
                <img
                  src="/Logo - Lead Sync.(Lght Mode).svg"
                  alt="Lead Sync Flow Logo"
                  className="h-14 w-auto dark:hidden object-contain"
                />
                <img
                  src="/Logo - Lead Sync.(Dark Mode).svg"
                  alt="Lead Sync Flow Logo"
                  className="h-14 w-auto hidden dark:block object-contain"
                />
              </div>

              {/* Collapse Button (<<) */}
              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg hover:bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] transition-all active:scale-95"
                title="Collapse Menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={onToggleCollapse}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all active:scale-95"
              title="Expand Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`p-4 space-y-4 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'px-2' : ''}`} style={{ maxHeight: 'calc(100vh - 128px)' }}>
          {!currentDashboard && !isCollapsed && (
            <div className="px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
              Configuration Unknown
            </div>
          )}
          {currentDashboard && (
            <div className="space-y-2">
              {/* Current Dashboard Header */}
              <div className="mb-3 md:mb-4">
                <div className={`flex items-center gap-2 md:gap-3 rounded-xl transition-all duration-300 ${isCollapsed ? 'justify-center p-2' : 'px-3 py-2'}`}
                  style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                  <span className={`flex-shrink-0 text-lg md:text-xl text-[var(--accent-primary)]`}>{currentDashboard.icon}</span>
                  {!isCollapsed && (
                    <span className="font-black text-sm md:text-base uppercase tracking-wider truncate" style={{ color: 'var(--accent-primary)' }}>
                      {currentDashboard.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Current Dashboard Pages */}
              {currentDashboard.pages.filter(page => {
                if (page.showInSidebar === false) return false;
                if (page.allowedRoles && (!userRole || !page.allowedRoles.includes(userRole))) return false;
                return true;
              }).map((page) => {
                const pagePath = `${currentDashboard.basePath}${page.path ? '/' + page.path : ''}`;
                const isPageActive = currentPath === pagePath;

                return (
                  <Link
                    key={pagePath}
                    to={pagePath}
                    title={isCollapsed ? page.name : ""}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center transition-all duration-300 group/item relative ${isCollapsed ? 'justify-center px-0 py-2.5 rounded-xl gap-0' : 'gap-2 md:gap-3 px-3 py-2.5 rounded-xl'} ${isPageActive
                      ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    <span className={`flex-shrink-0 text-base md:text-lg ${isPageActive ? 'text-white' : 'group-hover/item:text-[var(--accent-primary)]'}`}>
                      {page.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="text-sm md:text-base font-bold truncate">
                        {page.name}
                      </span>
                    )}
                    {isPageActive && (
                      <div className={`absolute rounded-full bg-white shadow-[0_0_8px_white] ${isCollapsed ? 'right-1 w-1 h-4' : 'ml-auto w-1.5 h-1.5 static'}`} />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 transition-all duration-300 ${isCollapsed ? 'px-1 py-4' : ''}`}>
          <div className="text-center">
            {!isCollapsed ? (
              <>
                <p className="text-xs text-[var(--text-tertiary)] font-bold">
                  Multi-Dashboard System
                </p>
                <p className="text-xs mt-1 text-[var(--text-tertiary)] opacity-60">
                  Version 2.0.0
                </p>
              </>
            ) : (
              <span className="text-[10px] font-black text-[var(--text-tertiary)] opacity-60">V2</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
