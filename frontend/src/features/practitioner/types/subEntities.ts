// ── Specialty ──────────────────────────────────────────────────────────
export interface Specialty {
  id: string;
  practitionerId: string;
  taxonomyCode: string;
  taxonomyDescription?: string;
  hsdCode?: string;
  specialtySource?: string;
  primary: boolean;
  clinicalInterest?: string;
  boardCertificationBody?: string;
  certificationState?: string;
  certificationCountry?: string;
  createdAt: string;
}

export interface SpecialtyFormValues {
  taxonomyCode: string;
  taxonomyDescription?: string;
  hsdCode?: string;
  specialtySource?: string;
  primary: boolean;
  clinicalInterest?: string;
  boardCertificationBody?: string;
  certificationState?: string;
  certificationCountry?: string;
}

// ── License ────────────────────────────────────────────────────────────
export type LicenseType = 'STATE_LICENSE' | 'DEA' | 'MEDICARE' | 'MEDICAID' | 'OTHER';
export interface License {
  id: string;
  practitionerId: string;
  licenseType: LicenseType;
  licenseNumber: string;
  state?: string;
  country?: string;
  issuedDate?: string;
  expiryDate?: string;
  doNotDisplayInDirectory: boolean;
  status: string;
  createdAt: string;
}
export interface LicenseFormValues {
  licenseType: LicenseType;
  licenseNumber: string;
  state?: string;
  country?: string;
  issuedDate?: string;
  expiryDate?: string;
  doNotDisplayInDirectory: boolean;
}

export interface TerminateFormValues {
  practitionerId: string;
  reason: string;
  createdAt: string;
}

// ── Credentialing ──────────────────────────────────────────────────────
export type CredentialingType = 'INITIAL' | 'RE_CREDENTIALING' | 'DELEGATED' | 'THIRD_PARTY';
export type CredentialingStatus = 'IN_PROGRESS' | 'APPROVED' | 'DENIED' | 'EXPIRED' | 'PENDING_REVIEW';
export type ProcessingStatus = 'NONE' | 'PAYMENT_HOLD' | 'CLAIM_HOLD' | 'DIRECTORY_HOLD' | 'ALL_HOLDS';

export interface Credentialing {
  id: string;
  practitionerId: string;
  credentialingType: CredentialingType;
  credentialingStatus: CredentialingStatus;
  credentialSource?: string;
  sourceAssociateName?: string;
  state?: string;
  dateSentToEntity?: string;
  effectiveDate?: string;
  expiryDate?: string;
  disciplinaryActionReason?: string;
  processingActionNote?: string;
  processingStatus?: ProcessingStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Attestation ────────────────────────────────────────────────────────
export type AttestationStatus = 'ATTESTED' | 'NOT_ATTESTED' | 'OVERDUE';
export interface Attestation {
  id: string;
  practitionerId: string;
  attestationStatus: AttestationStatus;
  attestationSource?: string;
  requestedDate?: string;
  lastAttestationDate?: string;
  nextAttestationDue?: string;
  createdAt: string;
}

// ── Notes ──────────────────────────────────────────────────────────────
export interface PractitionerNoteItem {
  id: string;
  practitionerId: string;
  authorUsername: string;
  content: string;
  createdAt: string;
}

// Address and Contact 
export type AddressType = 'PRACTICE_LOCATION' | 'BILLING' | 'MAILING' | 'HOME';
export type ContactType = 'OFFICE' | 'MOBILE' | 'FAX' | 'ANSWERING_SERVICE' | 'AFTER_HOURS';

export interface PractitionerAddress {
  id: string;
  addressType: AddressType;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  phone: string;
  state: string;
  zipCode: string;
  county?: string;
  country?: string;
  pincode: string;
  effectiveStartDate?: string;
  effectiveEndDate?: string;
  primary: boolean;
}

export interface PractitionerFormAddress {
  addressLine1: string;
  phone: string;
  city: string;
  state: string;
  country?: string;
  pincode: string;
  primary: boolean;
}

export interface PractitionerContact {
  id?: string;
  contactType: ContactType;
  phoneNumber?: string;
  extension?: string;
  faxNumber?: string;
  email?: string;
  isPreferred: boolean;
}

export interface Transaction {
  id?: string;
  entityType?: string;
  entityId?: string;
  parentType?: string;
  parentId?: string;
  operation?: string;
  section?: string;
  changedBy?: string;
  changedAt?: string;
  data?: string;
  oldData?: string;
  newData?: string;
}
