// Role-based routing utility
export const getRoleBasedRedirect = (userRole) => {
  const roleRedirectMap = {
    'Super Admin': '/gds/super-admin',
    'Lead qualifiers': '/gds/lead-qualifier',
    'Team lead( Lead qualifiers,)': '/gds/lead-qualifier',
    'Data Minors': '/gds/data-minor'
  };

  return roleRedirectMap[userRole] || '/gds/super-admin'; // Default fallback
};

import tokenManager from './tokenManager';

export const getUserRole = () => {
  // Get user role from token payload instead of localStorage
  const user = tokenManager.getUser();
  return user ? (user.role || user.department || null) : null;
};

export const hasRequiredRole = (userRole, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(userRole);
};
