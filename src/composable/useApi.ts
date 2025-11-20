import { HttpClient } from '@/services/http';

export function useApi() {

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  function getTokenFromStorage(): string | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;

    try {
      return JSON.parse(raw).token;
    } catch {
      return null;
    }
  }

  const api = new HttpClient(API_BASE, () => getTokenFromStorage());

  return { api };
}
