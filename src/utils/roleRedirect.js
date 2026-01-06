// Role-based routing utility
export const getRoleBasedRedirect = (userRole) => {
  const roleRedirectMap = {
    'Super Admin': '/gds/super-admin',
    'Lead qualifiers': '/gds/lead-qualifier',
    'Team lead( Lead qualifiers,)': '/gds/lead-qualifier',
    'data minors': '/gds/data-minor',
    'Team lead (data minors )': '/gds/data-minor'
  };

  return roleRedirectMap[userRole] || '/gds/super-admin'; // Default fallback
};

export const getUserRole = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    return user.role || user.department || null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const hasRequiredRole = (userRole, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(userRole);
};
