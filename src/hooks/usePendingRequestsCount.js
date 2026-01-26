import { useState, useEffect } from 'react';
import { adminAPI } from '../api/admin.api';

export function usePendingRequestsCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    // Set up polling to update count every 30 seconds
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return { count, loading };
}
