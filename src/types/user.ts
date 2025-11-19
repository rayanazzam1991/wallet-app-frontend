export interface AuthUser {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string;
  balance: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}
