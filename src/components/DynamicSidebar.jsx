import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { dashboardConfig } from '../dashboards/dashboardConfig';

export default function DynamicSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedDashboard, setExpandedDashboard] = useState(null);

  // Find current dashboard and page
  const currentPath = location.pathname;
  const currentDashboard = dashboardConfig.find(dashboard => 
    currentPath.startsWith(dashboard.basePath)
  );

  const toggleDashboard = (dashboardId) => {
    if (expandedDashboard === dashboardId) {
      setExpandedDashboard(null);
    } else {
      setExpandedDashboard(dashboardId);
    }
  };

  const handleDashboardClick = (dashboard) => {
    // Navigate to dashboard main page and expand it
    navigate(dashboard.basePath);
    setExpandedDashboard(dashboard.id);
  };

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
        fixed top-0 left-0 z-50 w-64 h-full transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
           style={{ backgroundColor: 'var(--bg-secondary)' }}>
        
        {/* Sidebar Header */}
        <div className="h-16 border-b flex items-center px-6" 
             style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                 style={{ 
                   background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                   boxShadow: '0 4px 12px rgba(69, 104, 130, 0.3)'
                 }}>
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
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
        <nav className="p-4 space-y-2">
          {dashboardConfig.map((dashboard) => {
            const isDashboardActive = currentPath.startsWith(dashboard.basePath);
            const isExpanded = expandedDashboard === dashboard.id;

            return (
              <div key={dashboard.id} className="space-y-1">
                {/* Dashboard Header */}
                <button
                  onClick={() => handleDashboardClick(dashboard)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${isDashboardActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                  style={{ 
                    color: isDashboardActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span className="flex-shrink-0">{dashboard.icon}</span>
                  <span className="font-medium flex-1 text-left">{dashboard.name}</span>
                  <svg 
                    className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dashboard Pages */}
                {isExpanded && (
                  <div className="ml-4 space-y-1">
                    {dashboard.pages.filter(page => page.showInSidebar !== false).map((page) => {
                      const pagePath = `${dashboard.basePath}${page.path ? '/' + page.path : ''}`;
                      const isPageActive = currentPath === pagePath;
                      const showInSidebar = page.showInSidebar !== false; // Default to true

                      return (
                        <Link
                          key={pagePath}
                          to={pagePath}
                          onClick={onClose}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                            ${isPageActive 
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }
                          `}
                          style={{ 
                            color: isPageActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                          }}
                        >
                          <span className="flex-shrink-0">{page.icon}</span>
                          <span className="text-sm">{page.name}</span>
                          {isPageActive && (
                            <div className="ml-auto w-2 h-2 rounded-full" 
                                 style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
