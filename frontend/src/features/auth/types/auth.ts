export type UserRole = 'PD_ASSOCIATE' | 'PD_ADMIN' | 'READ_ONLY';

export interface AuthState {
  token: string | null;
  username: string | null;
  fullName: string | null;
  roles: UserRole[];
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  fullName: string;
  roles: UserRole[];
}
