import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, AuthState } from '@/features/auth/types/auth';

const TOKEN_KEY = 'pdm_token';
const USER_KEY  = 'pdm_user';

// On page refresh, restore the full session from localStorage.
function loadSession(): Pick<AuthState, 'username' | 'fullName' | 'roles'> {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : { username: null, fullName: null, roles: [] };
  } catch {
    return { username: null, fullName: null, roles: [] };
  }
}

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_KEY),
  ...loadSession(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.token    = action.payload.token;
      state.username = action.payload.username;
      state.fullName = action.payload.fullName;
      state.roles    = action.payload.roles;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify({
        username: action.payload.username,
        fullName: action.payload.fullName,
        roles:    action.payload.roles,
      }));
    },
    logout: (state) => {
      state.token    = null;
      state.username = null;
      state.fullName = null;
      state.roles    = [];
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentToken    = (s: { auth: AuthState }) => s.auth.token;
export const selectCurrentUser     = (s: { auth: AuthState }) => s.auth.username;
export const selectFullName        = (s: { auth: AuthState }) => s.auth.fullName;
export const selectCurrentRoles    = (s: { auth: AuthState }) => s.auth.roles;
export const selectIsAdmin         = (s: { auth: AuthState }) => s.auth.roles.includes('PD_ADMIN');
export const selectIsAuthenticated = (s: { auth: AuthState }) => !!s.auth.token;
