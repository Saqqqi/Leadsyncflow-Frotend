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
      
      // Clear all auth data using tokenManager
      tokenManager.clearAuthData();
      
      // Auto redirect to login immediately for ALL users and dashboards
      const loginUrl = '/login';
      console.log('Global redirect to login:', loginUrl);
      window.location.href = loginUrl;
    };

    // Listen for token expired events (tokenManager handles periodic checks)
    window.addEventListener('tokenExpired', handleTokenExpired);
    
    // Check immediately using tokenManager (only if not on public route)
    const token = tokenManager.getToken();
    if (token && !tokenManager.isCurrentTokenValid()) {
      handleTokenExpired({ detail: { message: 'Session expired' } });
    }
    
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
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
