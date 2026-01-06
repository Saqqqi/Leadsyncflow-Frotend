import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DynamicSidebar from '../components/DynamicSidebar';
import TokenStatus from '../components/TokenStatus';
import tokenManager from '../utils/tokenManager';

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Only for mobile

  // Check for expired token on component mount and periodically
  useEffect(() => {
    const checkAndRedirect = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Parse token to check expiry
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);
          
          // Check if token is expired
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            console.log('Expired token detected in DashboardLayout, redirecting...');
            
            // Clear all auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiry');
            
            // Redirect to login - works for ALL dashboards
            window.location.href = '/login';
          }
        } catch (error) {
          console.error('Error checking token:', error);
          // If token is invalid, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiry');
          window.location.href = '/login';
        }
      } else {
        // No token found, redirect to login
        window.location.href = '/login';
      }
    };

    // Check immediately
    checkAndRedirect();
    
    // Also check every 10 seconds for better responsiveness
    const interval = setInterval(checkAndRedirect, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Token Status Component - Global for all dashboard pages */}
      <TokenStatus />
      
      {/* Dynamic Sidebar - Always visible on large screens, controlled on mobile */}
      <DynamicSidebar 
        isOpen={true} // Always visible on desktop
        onClose={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 md:ml-56">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4 md:px-6"
                style={{ borderColor: 'var(--border-primary)' }}>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    style={{ color: 'var(--text-primary)' }}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span style={{ color: 'var(--text-primary)' }}>Admin User</span>
            </div>

            <button 
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: 'var(--text-primary)' }}
              title="Logout"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
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