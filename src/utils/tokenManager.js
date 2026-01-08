// Token Management Utility
class TokenManager {
  constructor() {
    this.TOKEN_KEY = 'token';
    this.USER_KEY = 'user';
    this.TOKEN_EXPIRY_KEY = 'tokenExpiry';
    this.WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry
    this.checkInterval = null;
  }

  // Parse JWT token to get expiry time
  parseToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  // Get token expiry time
  getTokenExpiry(token) {
    const payload = this.parseToken(token);
    return payload ? payload.exp * 1000 : null; // Convert to milliseconds
  }

  // Check if token is expired
  isTokenExpired(token) {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return true;
    return Date.now() >= expiry;
  }

  // Check if token is about to expire (within warning threshold)
  isTokenExpiringSoon(token) {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return true;
    return Date.now() >= (expiry - this.WARNING_THRESHOLD);
  }

  // Get remaining time in milliseconds
  getTokenRemainingTime(token) {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return 0;
    return Math.max(0, expiry - Date.now());
  }

  // Format remaining time for display
  formatRemainingTime(remainingMs) {
    if (remainingMs <= 0) return 'Expired';

    const minutes = Math.floor(remainingMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'Less than 1 minute';
  }

  // Save token with expiry info (user data is NOT stored)
  saveToken(token) {
    const expiry = this.getTokenExpiry(token);

    localStorage.setItem('token', token);

    if (expiry) {
      localStorage.setItem('tokenExpiry', expiry.toString());
    }

    // Start expiry monitoring
    this.startExpiryMonitoring();
  }

  // Get current token
  getToken() {
    return localStorage.getItem('token');
  }

  // Get current user from token payload (not from localStorage)
  getUser() {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.parseToken(token);
    if (!payload) return null;

    // Return user info from token payload
    return {
      id: payload.id || payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      department: payload.department,
      // Add any other fields from token payload
    };
  }

  // Check if current token is valid
  isCurrentTokenValid() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }

  // Clear all auth data
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    this.stopExpiryMonitoring();
  }

  // Start monitoring token expiry
  startExpiryMonitoring() {
    this.stopExpiryMonitoring(); // Clear any existing interval

    const token = this.getToken();
    if (!token) {
      console.log('No token found, not starting monitoring');
      return;
    }

    console.log('Starting token monitoring...');
    this.checkInterval = setInterval(() => {
      const currentToken = this.getToken();
      if (!currentToken || this.isTokenExpired(currentToken)) {
        console.log('Token expired detected in monitoring');
        this.handleTokenExpired();
      } else if (this.isTokenExpiringSoon(currentToken)) {
        this.handleTokenExpiringSoon();
      }
    }, 30000); // Check every 30 seconds for better responsiveness
  }

  // Stop monitoring token expiry
  stopExpiryMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Handle token expired
  handleTokenExpired() {
    console.log('Token expired, logging out...');
    this.clearAuthData();

    // Don't redirect if already on login or signup page (prevent infinite loops)
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '/login') {
      console.log('Already on login/signup page, skipping redirect');
      // Just dispatch event, don't redirect
      window.dispatchEvent(new CustomEvent('tokenExpired', {
        detail: { message: 'Your session has expired. Please log in again.' }
      }));
      return;
    }

    // Auto redirect to login page - force redirect for all users
    const loginUrl = '/login';
    console.log('Redirecting to:', loginUrl);

    // Force redirect using multiple methods
    try {
      // Method 1: Direct assignment
      window.location.href = loginUrl;

      // Method 2: If blocked, try replace
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          window.location.replace(loginUrl);
        }
      }, 100);

      // Method 3: If still blocked, try assign again
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          window.location.assign(loginUrl);
        }
      }, 200);
    } catch (error) {
      console.error('Redirect error:', error);
      // Fallback: force reload with login URL
      if (window.location.pathname !== '/login') {
        window.location.href = loginUrl;
      }
    }

    // Also dispatch custom event for components that might need it
    window.dispatchEvent(new CustomEvent('tokenExpired', {
      detail: { message: 'Your session has expired. Please log in again.' }
    }));
  }

  // Handle token expiring soon
  handleTokenExpiringSoon() {
    const token = this.getToken();
    const remainingTime = this.getTokenRemainingTime(token);

    // Dispatch custom event for warning
    window.dispatchEvent(new CustomEvent('tokenExpiringSoon', {
      detail: {
        remainingTime,
        formattedTime: this.formatRemainingTime(remainingTime)
      }
    }));
  }

  // Get token status
  getTokenStatus() {
    const token = this.getToken();
    if (!token) return { valid: false, expired: true, message: 'No token found' };

    const expiry = this.getTokenExpiry(token);
    const remainingTime = this.getTokenRemainingTime(token);

    return {
      valid: !this.isTokenExpired(token),
      expired: this.isTokenExpired(token),
      expiringSoon: this.isTokenExpiringSoon(token),
      remainingTime,
      formattedTime: this.formatRemainingTime(remainingTime),
      expiry
    };
  }

  // Initialize token monitoring if token exists
  initializeMonitoring() {
    const token = this.getToken();
    if (token) {
      console.log('Token found on initialization, starting monitoring');
      this.startExpiryMonitoring();
    }
  }
}

// Create singleton instance
const tokenManager = new TokenManager();

export default tokenManager;
