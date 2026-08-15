import { apiSlice } from '@/app/apiSlice';
import type { Page } from '@/types/common';
import type { Organization, OrganizationFormValues } from '@/types/organization';

export const organizationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query<Page<Organization>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => `/organizations?page=${page}&size=${size}`,
      providesTags: (result) =>
        result
          ? [...result.content.map((o) => ({ type: 'Organization' as const, id: o.id })), { type: 'Organization', id: 'LIST' }]
          : [{ type: 'Organization', id: 'LIST' }],
    }),

    getOrganization: builder.query<Organization, string>({
      query: (id) => `/organizations/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Organization', id }],
    }),

    createOrganization: builder.mutation<Organization, OrganizationFormValues>({
      query: (body) => ({ url: '/organizations', method: 'POST', body }),
      invalidatesTags: [{ type: 'Organization', id: 'LIST' }],
    }),

    updateOrganization: builder.mutation<Organization, { id: string; body: OrganizationFormValues }>({
      query: ({ id, body }) => ({ url: `/organizations/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Organization', id }, { type: 'Organization', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
} = organizationApi;
