import { toast } from 'vue-sonner'
import type { ErrorResponse } from '@/types/api.ts'

interface HttpOptions extends RequestInit {
  headers?: Record<string, string>;
}

export class HttpClient {
  private baseUrl: string;
  private readonly getToken: () => string | null;

  constructor(baseUrl: string, getToken: () => string | null) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
  }

  private buildUrl(path: string) {
    if (/^https?:\/\//.test(path)) return path;
    return `${this.baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  private async request<T>(path: string, options: HttpOptions = {}) {
    const url = this.buildUrl(path);
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const text = await response.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        json = { message: text };
      }

      throw json;
    }

    return await response.json() as Promise<T>;
  }

  get<T>(path: string, opt?: HttpOptions) {
    return this.request<T>(path, { ...opt, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, opt?: HttpOptions) {
    return this.request<T>(path, {
      ...opt,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown, opt?: HttpOptions) {
    return this.request<T>(path, {
      ...opt,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string, opt?: HttpOptions) {
    return this.request<T>(path, { ...opt, method: 'DELETE' });
  }
}
