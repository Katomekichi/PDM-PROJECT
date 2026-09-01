export type TicketEntityType = 'PRACTITIONER' | 'ORGANIZATION';
export type TicketStatus = 'ACTIVE' | 'CLOSED' | 'CANCELED' | 'FAILED';

export interface Ticket {
  id: string;
  entityType: TicketEntityType;
  status: TicketStatus;
  providerName: string | null;
  createdAt: string;
  updatedAt: string;
}
