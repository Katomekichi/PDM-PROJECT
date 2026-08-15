import type { EntityStatus } from './common';

// This is the "in which org location is he attached" relationship, mirrored from the backend.
export interface PractitionerRole {
  id: string;
  practitionerId: string;
  practitionerName: string;
  organizationLocationId: string;
  organizationLocationName: string;
  roleSpecialty: string;
  startDate: string;
  endDate?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PractitionerRoleFormValues {
  practitionerId: string;
  organizationLocationId: string;
  roleSpecialty: string;
  startDate: string;
  endDate?: string;
}
