import { apiSlice } from '@/app/apiSlice';
import type { OrganizationLocation, OrganizationLocationFormValues } from '@/features/organization/types/organizationLocation';

export const organizationLocationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // "All the locations belonging to this one parent Organization" - e.g. AIIMS Delhi,
    // AIIMS Chennai, all under the AIIMS Organization.
    getLocationsByOrganization: builder.query<OrganizationLocation[], string>({
      query: (organizationId) => `/organization-locations?organizationId=${organizationId}`,
      providesTags: (result) =>
        result
          ? [...result.map((l) => ({ type: 'OrganizationLocation' as const, id: l.id })), { type: 'OrganizationLocation', id: 'LIST' }]
          : [{ type: 'OrganizationLocation', id: 'LIST' }],
    }),

    createOrganizationLocation: builder.mutation<OrganizationLocation, OrganizationLocationFormValues>({
      query: (body) => ({ url: '/organization-locations', method: 'POST', body }),
      invalidatesTags: [{ type: 'OrganizationLocation', id: 'LIST' }],
    }),
  }),
});

export const { useGetLocationsByOrganizationQuery, useCreateOrganizationLocationMutation } = organizationLocationApi;
