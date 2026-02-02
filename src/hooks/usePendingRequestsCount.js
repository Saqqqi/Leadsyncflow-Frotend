import { useState, useEffect } from 'react';
import { adminAPI } from '../api/admin.api';

export function usePendingRequestsCount(userRole) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch for Super Admin roles
    if (userRole !== 'Super Admin' && userRole !== 'Admin') {
      setLoading(false);
      return;
    }

    const fetchCount = async () => {
      try {
        const data = await adminAPI.getPendingRequests();
        setCount(data.requests?.length || 0);
      } catch (error) {
        console.error('Error fetching pending requests count:', error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();

    // Listen for manual updates (e.g. from PendingRequests page)
    const handleUpdate = () => fetchCount();
    window.addEventListener('pendingRequestsUpdated', handleUpdate);

    // Set up polling to update count every 10 seconds
    const interval = setInterval(fetchCount, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('pendingRequestsUpdated', handleUpdate);
    };
  }, [userRole]);

  return { count, loading };
}
