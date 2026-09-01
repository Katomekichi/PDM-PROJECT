import { apiSlice } from '@/app/apiSlice';
import type { Page } from '@/types/common';
import type { Ticket, TicketEntityType, TicketStatus } from '@/types/ticket';

export const ticketApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<Page<Ticket>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 } = {}) => `/tickets?page=${page}&size=${size}`,
      providesTags: (result) =>
        result
          ? [...result.content.map((t) => ({ type: 'Ticket' as const, id: t.id })), { type: 'Ticket', id: 'LIST' }]
          : [{ type: 'Ticket', id: 'LIST' }],
    }),

    createTicket: builder.mutation<Ticket, { entityType: TicketEntityType }>({
      query: (body) => ({ url: '/tickets', method: 'POST', body }),
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    updateTicketStatus: builder.mutation<Ticket, { id: string; status: TicketStatus; providerName?: string }>({
      query: ({ id, ...body }) => ({ url: `/tickets/${id}/status`, method: 'PATCH', body }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Ticket', id }, { type: 'Ticket', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketStatusMutation,
} = ticketApi;
