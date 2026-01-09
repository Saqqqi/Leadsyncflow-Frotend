import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import SignupPage from '../auth/Signup';
import LoginPage from '../auth/login';
import DynamicRoutes from './DynamicRoutes';
import TokenStatus from '../components/TokenStatus';
import tokenManager from '../utils/tokenManager';

function AppRoutesWithTokenManagement() {
  const location = useLocation();
  const isPublicRoute =
    location.pathname === '/' || location.pathname === '/login';

  // Token validation & expiry handling (protected routes only)
  useEffect(() => {
    const redirectToLogin = (message) => {
      console.log('Redirecting to login:', message);
      tokenManager.clearAuthData();
      window.location.href = '/login';
    };

    if (isPublicRoute) {
      tokenManager.stopExpiryMonitoring();
      return;
    }

    const token = tokenManager.getToken();

    if (!token || !tokenManager.isCurrentTokenValid()) {
      redirectToLogin('Token missing or expired');
      return;
    }

    const handleTokenExpired = (event) => {
      redirectToLogin(event.detail?.message || 'Session expired');
    };

    window.addEventListener('tokenExpired', handleTokenExpired);
    tokenManager.startExpiryMonitoring();

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, [location.pathname, isPublicRoute]);

  return (
    <>
      {/* Public & protected route handling */}
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<DynamicRoutes />} />
      </Routes>

      {/* Token status shown only on protected routes */}
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
