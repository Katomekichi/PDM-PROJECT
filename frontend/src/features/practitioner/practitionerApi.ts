import { apiSlice } from '@/app/apiSlice';
import type { Page } from '@/types/common';
import type { Practitioner, PractitionerFormValues } from '@/types/practitioner';

export const practitionerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchPractitioners: builder.query<Page<Practitioner>, { npi?: string; lastName?: string; page?: number; size?: number }>({
      query: ({ npi, lastName, page = 0, size = 20 }) => {
        const params = new URLSearchParams();
        if (npi) params.set('npi', npi);
        if (lastName) params.set('lastName', lastName);
        params.set('page', String(page));
        params.set('size', String(size));
        return `/practitioners?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [...result.content.map((p) => ({ type: 'Practitioner' as const, id: p.id })), { type: 'Practitioner', id: 'LIST' }]
          : [{ type: 'Practitioner', id: 'LIST' }],
    }),

    getPractitioner: builder.query<Practitioner, string>({
      query: (id) => `/practitioners/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Practitioner', id }],
    }),

    createPractitioner: builder.mutation<Practitioner, PractitionerFormValues>({
      query: (body) => ({ url: '/practitioners', method: 'POST', body }),
      invalidatesTags: [{ type: 'Practitioner', id: 'LIST' }],
    }),

    updatePractitioner: builder.mutation<Practitioner, { id: string; body: PractitionerFormValues }>({
      query: ({ id, body }) => ({ url: `/practitioners/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Practitioner', id }, { type: 'Practitioner', id: 'LIST' }],
    }),

    terminatePractitioner: builder.mutation<void, string>({
      query: (id) => ({ url: `/practitioners/${id}/terminate`, method: 'POST' }),
      invalidatesTags: (_res, _err, id) => [{ type: 'Practitioner', id }, { type: 'Practitioner', id: 'LIST' }],
    }),

    reinstatePractitioner: builder.mutation<void, string>({
      query: (id) => ({ url: `/practitioners/${id}/reinstate`, method: 'POST' }),
      invalidatesTags: (_res, _err, id) => [{ type: 'Practitioner', id }, { type: 'Practitioner', id: 'LIST' }],
    }),

    addPractitonerAddresses: builder.mutation<void, string>({
      query: (id) => ({ url: `/practitioners/${id}/address`, method: 'POST' }),
      invalidatesTags: (_res, _err, id) => [{ type: 'Practitioner', id }, { type: 'Practitioner', id: 'LIST' }],
    }),
  }),
});

export const {
  useSearchPractitionersQuery,
  useGetPractitionerQuery,
  useCreatePractitionerMutation,
  useUpdatePractitionerMutation,
  useTerminatePractitionerMutation,
  useReinstatePractitionerMutation,
  useAddPractitonerAddressesMutation
} = practitionerApi;
