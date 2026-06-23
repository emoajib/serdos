import React, { createContext, useContext, useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const RealtimeContext = createContext(null);

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
export const RealtimeProvider = ({ children }) => {
  const [echo, setEcho] = useState(null);

  useEffect(() => {
    const echoInstance = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
      wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
      forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss'],
    });

    setEcho(echoInstance);

    return () => {
      if (echoInstance) echoInstance.disconnect();
    };
  }, []);

  return (
    <RealtimeContext.Provider value={echo}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);
