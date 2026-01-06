import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import SignupPage from '../auth/Signup';
import LoginPage from '../auth/login';
import DynamicRoutes from './DynamicRoutes';
import TokenStatus from '../components/TokenStatus';
import tokenManager from '../utils/tokenManager';

function AppRoutesWithTokenManagement() {
  const location = useLocation();
  const isPublicRoute = location.pathname === '/' || location.pathname === '/login';

  // Handle global token expiry events and periodic checks (ONLY on protected routes)
  useEffect(() => {
    // Don't run token checks on public routes (login/signup)
    if (isPublicRoute) {
      // Stop monitoring if on public route
      tokenManager.stopExpiryMonitoring();
      return;
    }

    const handleTokenExpired = (event) => {
      console.log('Global token expiry handler:', event.detail?.message || 'Token expired');
      
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');
      
      // Auto redirect to login immediately for ALL users and dashboards
      const loginUrl = '/login';
      console.log('Global redirect to login:', loginUrl);
      window.location.href = loginUrl;
    };

    // Periodic check for expired tokens (works for all dashboards, but NOT on login page)
    const checkTokenExpiry = () => {
      // Don't check if we're on a public route
      if (window.location.pathname === '/' || window.location.pathname === '/login') {
        return;
      }

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
            console.log('Expired token detected in global check, redirecting...');
            handleTokenExpired({ detail: { message: 'Session expired' } });
          }
        } catch (error) {
          console.error('Error checking token in global handler:', error);
        }
      }
    };

    // Check immediately (only if not on public route)
    checkTokenExpiry();
    
    // Listen for token expired events
    window.addEventListener('tokenExpired', handleTokenExpired);
    
    // Check every 10 seconds for expired tokens
    const interval = setInterval(checkTokenExpiry, 10000);
    
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
      clearInterval(interval);
    };
  }, [isPublicRoute]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* All Dynamic Dashboard Routes */}
        <Route path="/*" element={<DynamicRoutes />} />
      </Routes>
      
      {/* Global Token Status Component - ONLY show on protected routes */}
      {!isPublicRoute && <TokenStatus />}
    </>
  );
}

export default function AppRoutes() {
    return (
        <Router>
            <AppRoutesWithTokenManagement />
        </Router>
    );
}
