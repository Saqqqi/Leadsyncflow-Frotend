import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { dashboardConfig } from '../dashboards/dashboardConfig';

export default function DynamicSidebar({ isOpen, onClose }) {
  const location = useLocation();

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
        fixed top-0 left-0 z-50 h-full transform transition-transform duration-300 ease-in-out
        w-48 md:w-56 lg:w-64
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
           style={{ backgroundColor: 'var(--bg-secondary)' }}>
        
        {/* Sidebar Header */}
        <div className="h-16 border-b flex items-center px-4 md:px-6" 
             style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg"
                 style={{ 
                   background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                   boxShadow: '0 4px 12px rgba(69, 104, 130, 0.3)'
                 }}>
              <svg className="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-base md:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Lead Sync Flow
            </span>
          </div>
          
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 md:p-4 space-y-1 md:space-y-2">
          {currentDashboard && (
            <div className="space-y-1 md:space-y-2">
              {/* Current Dashboard Header */}
              <div className="mb-3 md:mb-4">
                <div className="flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <span className="flex-shrink-0 text-lg md:text-xl">{currentDashboard.icon}</span>
                  <span className="font-semibold text-sm md:text-base" style={{ color: 'var(--accent-primary)' }}>
                    {currentDashboard.name}
                  </span>
                </div>
              </div>

              {/* Current Dashboard Pages */}
              {currentDashboard.pages.filter(page => page.showInSidebar !== false).map((page) => {
                const pagePath = `${currentDashboard.basePath}${page.path ? '/' + page.path : ''}`;
                const isPageActive = currentPath === pagePath;
                const showInSidebar = page.showInSidebar !== false; // Default to true

                return (
                  <Link
                    key={pagePath}
                    to={pagePath}
                    onClick={onClose}
                    className={`
                      flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg transition-all duration-200
                      ${isPageActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    style={{ 
                      color: isPageActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    <span className="flex-shrink-0 text-base md:text-lg">{page.icon}</span>
                    <span className="text-sm md:text-base">{page.name}</span>
                    {isPageActive && (
                      <div className="ml-auto w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" 
                           style={{ backgroundColor: 'var(--accent-primary)' }}></div>
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
