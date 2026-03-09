import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenManager from '../utils/tokenManager';
import SharedLoader from './SharedLoader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = tokenManager.getToken();

    if (token) {
      if (!tokenManager.isCurrentTokenValid()) {
        console.log('Expired or invalid token detected in ProtectedRoute, redirecting...');
        tokenManager.clearAuthData();
        window.location.href = '/login';
        return;
      }

      const userData = tokenManager.getUser();

      // Role Authorization Check
      if (allowedRoles.length > 0) {
        const userRole = userData.role || userData.department;
        const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
        const normalizedUserRole = userRole?.toLowerCase();

        if (!normalizedUserRole || !normalizedAllowedRoles.includes(normalizedUserRole)) {
          console.log('Unauthorized access attempt:', { userRole, allowedRoles });

          // Redirect to their own dashboard based on their actual role
          if (normalizedUserRole === 'admin') window.location.href = '/gds/admin';
          else if (normalizedUserRole === 'manager') window.location.href = '/gds/manager';
          else if (normalizedUserRole === 'data minors') window.location.href = '/gds/data-minor';
          else if (normalizedUserRole === 'lead qualifiers') window.location.href = '/gds/lead-qualifier';
          else if (normalizedUserRole === 'verifier') window.location.href = '/gds/verifier';
          else window.location.href = '/';

          return;
        }
      }

      setIsAuthenticated(true);
      setUser(userData);
    } else {
      window.location.href = '/login';
    }

    setLoading(false);
  }, [allowedRoles]);

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
