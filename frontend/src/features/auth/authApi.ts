import { apiSlice } from '@/app/apiSlice';
import type { AuthResponse, LoginPayload } from '@/types/auth';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
