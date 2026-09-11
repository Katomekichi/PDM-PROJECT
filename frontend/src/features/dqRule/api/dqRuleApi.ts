import { apiSlice } from '@/app/apiSlice';
import type { Page } from '@/shared/types/common';
import type { DqEntityType, DqRule, DqRuleFormValues } from '@/features/dqRule/types/dqRule';

export const dqRuleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDqRules: builder.query<Page<DqRule>, { entityType?: DqEntityType; page?: number; size?: number }>({
      query: ({ entityType, page = 0, size = 10 } = {}) =>
        `/dq-rules?${entityType ? `entityType=${entityType}&` : ''}page=${page}&size=${size}`,
      providesTags: (result) =>
        result
          ? [...result.content.map((r) => ({ type: 'DqRule' as const, id: r.id })), { type: 'DqRule', id: 'LIST' }]
          : [{ type: 'DqRule', id: 'LIST' }],
    }),

    createDqRule: builder.mutation<DqRule, DqRuleFormValues>({
      query: (body) => ({ url: '/dq-rules', method: 'POST', body }),
      invalidatesTags: [{ type: 'DqRule', id: 'LIST' }],
    }),

    updateDqRule: builder.mutation<DqRule, { id: string; body: DqRuleFormValues }>({
      query: ({ id, body }) => ({ url: `/dq-rules/${id}`, method: 'PUT', body }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'DqRule', id }, { type: 'DqRule', id: 'LIST' }],
    }),

    deleteDqRule: builder.mutation<void, string>({
      query: (id) => ({ url: `/dq-rules/${id}`, method: 'DELETE' }),
      invalidatesTags: (_res, _err, id) => [{ type: 'DqRule', id }, { type: 'DqRule', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDqRulesQuery,
  useCreateDqRuleMutation,
  useUpdateDqRuleMutation,
  useDeleteDqRuleMutation,
} = dqRuleApi;
