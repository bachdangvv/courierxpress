import { useEffect, useState } from 'react';
import { echo } from './echo';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log('✅ Subscribing to courier-location...');
    const channel = echo.channel('courier-location');

    const handler = (payload) => {
      console.log('📡 location.updated:', payload);
      setEvents((prev) => [payload, ...prev].slice(0, 10));
    };

    channel.listen('.location.updated', handler);

    // cleanup avoids duplicate subscriptions in React Fast Refresh
    return () => {
      channel.stopListening('.location.updated', handler);
      echo.leave('courier-location');
    };
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Courier Live Locations</h1>
      <p>Open your Laravel route <code>/test-location</code> to emit an event.</p>

      <ul>
        {events.map((e, i) => (
          <li key={i}>
            <strong>{e.agentId}</strong> → ({e.lat},{' '}{e.lng}) [{e.status}] at {new Date(e.at).toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;