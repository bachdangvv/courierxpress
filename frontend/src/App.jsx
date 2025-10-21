import React, { useEffect } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js'; // ✅ quan trọng!


window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb', // ✅ Laravel 11+ có sẵn broadcaster này
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: false,
  enabledTransports: ['ws'],
});

export default function App() {
  useEffect(() => {
    echo.channel('courier-location')
      .listen('.location.updated', (e) => {
        console.log('📡 New location event received:', e);
      });
  }, []);

  return (
      <div className="h-screen w-screen flex justify-center items-center text-center bg-gray-900 p-2">
    <h1 className="block text-3xl font-bold text-white">Listening for location updates...</h1>
      </div>
  );
}
