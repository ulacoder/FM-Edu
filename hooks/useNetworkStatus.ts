import { useEffect, useState } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<'4g' | '3g' | '2g' | 'slow' | 'offline'>('4g');

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updateConnectionType = () => {
      // @ts-ignore
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      if (!navigator.onLine) {
        setConnectionType('offline');
        return;
      }

      if (connection) {
        const effectiveType = connection.effectiveType;

        if (effectiveType === '4g') {
          setConnectionType('4g');
        } else if (effectiveType === '3g') {
          setConnectionType('3g');
        } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
          setConnectionType('2g');
        } else {
          setConnectionType('slow');
        }
      }
    };

    updateOnlineStatus();
    updateConnectionType();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateConnectionType);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if (connection) {
        connection.removeEventListener('change', updateConnectionType);
      }
    };
  }, []);

  return { isOnline, connectionType, isSlowConnection: connectionType === '2g' || connectionType === '3g' || connectionType === 'slow' };
}
