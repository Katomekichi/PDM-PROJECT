import type { EntityStatus } from '@/shared/types/common';

export type NpiType = 'TYPE_1_INDIVIDUAL' | 'TYPE_2_ORGANIZATION';

export type PractitionerType =
  | 'PRIMARY_CARE_PHYSICIAN'
  | 'HOSPITALIST'
  | 'SPECIALIST'
  | 'MEDICAL_TECHNICIAN'
  | 'NON_PHYSICIAN'
  | 'SOCIAL_WORKER'
  | 'OTHER';

// Mirrors PractitionerResponse.java exactly - keep these two in sync when the API changes.
export interface Practitioner {
  id: string;
  healthPlanId: string;
  npi: string;
  npiType: NpiType;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  practitionerType: PractitionerType;
  autoAssignPcp: boolean;
  status: EntityStatus;
  firstActiveDate?: string;
  gender?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

// Mirrors PractitionerRequest.java - the create/update payload shape.
export interface PractitionerFormValues {
  npi: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  practitionerType: PractitionerType;
  autoAssignPcp: boolean;
  firstActiveDate?: string;
  gender?: string;
  dateOfBirth?: string;
}
