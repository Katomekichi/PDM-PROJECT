import { apiSlice } from '@/app/apiSlice';
import type { PractitionerRole, PractitionerRoleFormValues } from '@/features/practitioner/types/practitionerRole';

/**
 * This file is the frontend counterpart to "in which org location is he attached" -
 * it fetches/creates PractitionerRole records, the join between Practitioner and
 * OrganizationLocation.
 */
export const practitionerRoleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRolesByPractitioner: builder.query<PractitionerRole[], string>({
      query: (practitionerId) => `/practitioner-roles?practitionerId=${practitionerId}`,
      providesTags: (result) =>
        result
          ? [...result.map((r) => ({ type: 'PractitionerRole' as const, id: r.id })), { type: 'PractitionerRole', id: 'LIST' }]
          : [{ type: 'PractitionerRole', id: 'LIST' }],
    }),

    assignPractitionerRole: builder.mutation<PractitionerRole, PractitionerRoleFormValues>({
      query: (body) => ({ url: '/practitioner-roles', method: 'POST', body }),
      invalidatesTags: [{ type: 'PractitionerRole', id: 'LIST' }],
    }),

    endPractitionerRole: builder.mutation<void, string>({
      query: (id) => ({ url: `/practitioner-roles/${id}/end`, method: 'POST' }),
      invalidatesTags: [{ type: 'PractitionerRole', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetRolesByPractitionerQuery,
  useAssignPractitionerRoleMutation,
  useEndPractitionerRoleMutation,
} = practitionerRoleApi;
