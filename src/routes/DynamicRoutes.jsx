import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { dashboardConfig } from '../dashboards/dashboardConfig';

// Loading component for lazy loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <svg className="animate-spin h-8 w-8 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  </div>
);

export default function DynamicRoutes() {
  return (
    <Routes>
      {/* Dynamic Dashboard Routes */}
      {dashboardConfig.map((dashboard) => (
        <Route key={dashboard.id} path={dashboard.basePath} element={<DashboardLayout />}>
          {/* Dashboard Pages */}
          {dashboard.pages.map((page) => {
            const pagePath = page.path ? dashboard.basePath + '/' + page.path : dashboard.basePath;
            const PageComponent = page.component;
            
            return (
              <Route
                key={pagePath}
                path={page.path || ''}
                element={
                  <Suspense fallback={<PageLoader />}>
                    <PageComponent />
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      ))}

      {/* Fallback route */}
      <Route path="*" element={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              404 - Page Not Found
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              The page you're looking for doesn't exist.
            </p>
          </div>
        </div>
      } />
    </Routes>
  );
}
