import { useCallback, useEffect, useState } from 'react';
import tokenManager from '../utils/tokenManager';

const PUBLIC_ROUTES = new Set(['/', '/login']);
const LOGIN_PATH = '/login';

const isPublicRoute = () => PUBLIC_ROUTES.has(window.location.pathname);
const redirectToLogin = () => {
  if (!isPublicRoute()) window.location.replace(LOGIN_PATH);
};

export default function TokenStatus() {
  const [status, setStatus] = useState(null);
  const [warning, setWarning] = useState(false);
  const [visible, setVisible] = useState(false);

  const clearAuth = () => tokenManager.clear();

  const updateStatus = useCallback(() => {
    if (isPublicRoute()) return;

    const nextStatus = tokenManager.getTokenStatus();
    setStatus(nextStatus);

    const expiring = nextStatus?.expiringSoon || nextStatus?.expired;
    setWarning(expiring);

    if (nextStatus?.expired) {
      setVisible(true);
      clearAuth();
      setTimeout(redirectToLogin, 800);
    }
  }, []);

  useEffect(() => {
    if (isPublicRoute()) return;

    tokenManager.initializeMonitoring();
    updateStatus();

    const onExpired = () => {
      clearAuth();
      redirectToLogin();
    };

    const onExpiringSoon = updateStatus;
    const onLoginSuccess = () => {
      setVisible(false);
      setWarning(false);
    };

    window.addEventListener('tokenExpired', onExpired);
    window.addEventListener('tokenExpiringSoon', onExpiringSoon);
    window.addEventListener('loginSuccess', onLoginSuccess);

    const intervalId = setInterval(updateStatus, 30000);

    return () => {
      window.removeEventListener('tokenExpired', onExpired);
      window.removeEventListener('tokenExpiringSoon', onExpiringSoon);
      window.removeEventListener('loginSuccess', onLoginSuccess);
      clearInterval(intervalId);
    };
  }, [updateStatus]);

  if (!status?.valid) {
    return (
      <div className={`fixed top-4 right-4 z-50 max-w-sm transition-opacity ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-red-800">Session expired</p>
          <button onClick={redirectToLogin} className="mt-2 text-xs bg-red-100 hover:bg-red-200 px-3 py-2 rounded">
            Go to login
          </button>
        </div>
      </div>
    );
  }

  if (warning) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <div className={`border rounded-lg p-4 shadow-lg ${status.expired ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
          <p className="text-sm font-medium">
            {status.expired ? 'Session expired' : 'Session expiring soon'}
          </p>
          {!status.expired && (
            <p className="text-xs opacity-80">Remaining: {status.formattedTime}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 text-xs text-green-600 opacity-60">
      Session active
    </div>
  );
}
