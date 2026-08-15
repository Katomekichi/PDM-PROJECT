import type { EntityStatus } from './common';

export interface OrganizationLocation {
  id: string;
  organizationId: string;
  organizationName: string;
  locationName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationLocationFormValues {
  organizationId: string;
  locationName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  phone?: string;
}
