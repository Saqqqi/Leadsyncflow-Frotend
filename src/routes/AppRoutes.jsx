import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SignupPage from '../auth/Signup';
import LoginPage from '../auth/login';
import LandingPage from '../pages/LandingPage';
import DynamicRoutes from './DynamicRoutes';
import TokenStatus from '../components/TokenStatus';
import tokenManager from '../utils/tokenManager';

function AppRoutesWithTokenManagement() {
  const location = useLocation();
  const normalizedPath = location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const isPublicRoute =
    normalizedPath === '/' ||
    normalizedPath === '/login' ||
    normalizedPath === '/signup';

  const navigate = useNavigate();

  // Token validation & expiry handling (protected routes only)
  useEffect(() => {
    const handleExit = (message) => {
      console.log('Session Guard:', message);
      tokenManager.clearAuthData();
      navigate('/', { replace: true });
    };

    if (isPublicRoute) {
      tokenManager.stopExpiryMonitoring();
      return;
    }

    const token = tokenManager.getToken();

    if (!token || !tokenManager.isCurrentTokenValid()) {
      handleExit('Token missing or expired');
      return;
    }

    const handleTokenExpired = (event) => {
      handleExit(event.detail?.message || 'Session expired');
    };

    window.addEventListener('tokenExpired', handleTokenExpired);
    tokenManager.startExpiryMonitoring();

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, [location.pathname, isPublicRoute, navigate]);

  return (
    <>
      {/* Public & protected route handling */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/*" element={<DynamicRoutes />} />
      </Routes>
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
