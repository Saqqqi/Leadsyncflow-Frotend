import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserRole, hasRequiredRole } from '../utils/roleRedirect';

export const RoleBasedRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const userRole = getUserRole();

  // Check if user is authenticated
  const token = localStorage.getItem('token');
  if (!token) {
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

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RoleBasedRoute;