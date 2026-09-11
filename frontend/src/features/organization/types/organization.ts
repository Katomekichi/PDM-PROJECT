import type { EntityStatus } from '@/shared/types/common';
import type { NpiType } from '@/features/practitioner/types/practitioner';

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
