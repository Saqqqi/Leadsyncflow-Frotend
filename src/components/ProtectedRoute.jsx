import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status and token expiry
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
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
          console.log('Expired token detected in ProtectedRoute, redirecting...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiry');
          window.location.href = '/login';
          return;
        }
        
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error checking token or parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiry');
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }
    
    setLoading(false);
  }, [navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ 
               backgroundColor: 'var(--bg-primary)',
               backgroundImage: 'linear-gradient(135deg, rgba(27, 60, 83, 0.95) 0%, rgba(35, 76, 106, 0.9) 100%)'
           }}>
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p style={{ color: 'var(--text-primary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the useEffect will redirect
  if (!isAuthenticated || !user) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
