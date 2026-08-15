import type { EntityStatus } from './common';
import type { NpiType } from './practitioner';

export type OrganizationType = 'HOSPITAL' | 'CLINIC' | 'PHARMACY' | 'LABORATORY' | 'OTHER';

export interface Organization {
  id: string;
  legalName: string;
  organizationType: OrganizationType;
  npi: string;
  npiType: NpiType;
  taxId: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationFormValues {
  legalName: string;
  organizationType: OrganizationType;
  npi: string;
  taxId: string;
}
