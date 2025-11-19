// src/services/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from '@/stores/authStore.ts'

// Required by Echo
// @ts-ignore
window.Pusher = Pusher;
// @ts-ignore
let echo: Echo | null = null;

export function useEcho() {
  const authStore = useAuthStore();

  if (!echo) {
    echo = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY,        // same as PUSHER_APP_KEY
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER, // "eu"
      forceTLS: true,
      // If API is not same origin, set host manually or just rely on pusher's cloud
      authEndpoint: `${import.meta.env.VITE_BASE_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${authStore.getAuthUser?.token}`, // adjust to your store
          Accept: 'application/json',
        },
      },
    });

    // Optional debugging
    // @ts-ignore
    Pusher.logToConsole = true;
  }

  return echo!;
}
