import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const key = import.meta.env.VITE_PUSHER_APP_KEY;
if (!key) {
  console.error('Missing VITE_PUSHER_APP_KEY in .env');
}

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'pusher',
  key,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: import.meta.env.VITE_PUSHER_FORCE_TLS === 'true',
  // If developing behind a proxy with self-signed certs, you could set forceTLS:false and wsHost/wsPort.
});