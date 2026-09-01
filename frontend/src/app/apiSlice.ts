import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Practitioner', 'Organization', 'OrganizationLocation', 'PractitionerRole',
             'Specialty', 'License', 'Credentialing', 'Attestation', 'Note', 'Ticket', 'DqRule'],
  endpoints: () => ({}),
});
