import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenManager from '../utils/tokenManager';
import SharedLoader from './SharedLoader';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status and token expiry using tokenManager
    const token = tokenManager.getToken();

    if (token) {
      // Use tokenManager to check if token is valid
      if (!tokenManager.isCurrentTokenValid()) {
        console.log('Expired or invalid token detected in ProtectedRoute, redirecting...');
        tokenManager.clearAuthData();
        window.location.href = '/login';
        return;
      }

      setIsAuthenticated(true);
      // Get user data from token payload if needed
      const userData = tokenManager.getUser();
      setUser(userData);
    } else {
      window.location.href = '/login';
    }

    setLoading(false);
  }, [navigate]);

  // Show loading while checking authentication
  if (loading) {
    return <SharedLoader />;
  }

  // If not authenticated, the useEffect will redirect
  if (!isAuthenticated || !user) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
