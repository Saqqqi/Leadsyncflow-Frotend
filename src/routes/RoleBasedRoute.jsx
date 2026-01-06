import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserRole, hasRequiredRole } from '../utils/roleRedirect';
import tokenManager from '../utils/tokenManager';

export const RoleBasedRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const userRole = getUserRole();

  // Check if user is authenticated using tokenManager
  const token = tokenManager.getToken();
  if (!token || !tokenManager.isCurrentTokenValid()) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!hasRequiredRole(userRole, requiredRoles)) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Note: For ProtectedRoute, use the one from src/components/ProtectedRoute.jsx
// which has full token validation and loading states

export default RoleBasedRoute;