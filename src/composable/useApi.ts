import { HttpClient } from '@/services/http';
import { useAuthStore } from '@/stores/authStore.ts'

export function useApi() {
  const auth = useAuthStore();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = auth.getUser?.token!
  const api = new HttpClient(API_BASE, () =>token );


  return { api };
}
