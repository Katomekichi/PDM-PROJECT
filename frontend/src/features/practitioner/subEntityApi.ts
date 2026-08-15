import { apiSlice } from '@/app/apiSlice';
import type {
  Specialty, SpecialtyFormValues,
  License, LicenseFormValues,
  Credentialing,
  Attestation, AttestationStatus,
  PractitionerNoteItem,
  PractitionerAddress,
  Transaction,
  PractitionerFormAddress
} from '@/types/subEntities';

export const subEntityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Specialties ──
    getSpecialties: builder.query<Specialty[], string>({
      query: (id) => `/practitioners/${id}/specialties`,
      providesTags: (_res, _err, id) => [{ type: 'Specialty', id }],
    }),
    addSpecialty: builder.mutation<Specialty, { practitionerId: string; body: SpecialtyFormValues }>({
      query: ({ practitionerId, body }) => ({ url: `/practitioners/${practitionerId}/specialties`, method: 'POST', body }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Specialty', id: practitionerId }],
    }),
    updateSpecialty: builder.mutation<Specialty, { specialtiesId: string; practitionerId: string; body: SpecialtyFormValues }>({
      query: ({ practitionerId, specialtiesId, body }) => ({ url: `/practitioners/${practitionerId}/specialties/${specialtiesId}`, method: 'PUT', body }),
      invalidatesTags: (_res, _err, { practitionerId, specialtiesId }) => [{ type: 'Specialty', id: practitionerId, specialtiesId: specialtiesId }],
    }),
    deleteSpecialty: builder.mutation<void, { practitionerId: string; specialtiesId: string }>({
      query: ({ practitionerId, specialtiesId }) => ({ url: `/practitioners/${practitionerId}/specialties/${specialtiesId}`, method: 'DELETE' }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Specialty', id: practitionerId }],
    }),


    // ── Licenses ──
    getLicenses: builder.query<License[], string>({
      query: (id) => `/practitioners/${id}/licenses`,
      providesTags: (_res, _err, id) => [{ type: 'License', id }],
    }),
    addLicense: builder.mutation<License, { practitionerId: string; body: LicenseFormValues }>({
      query: ({ practitionerId, body }) => ({ url: `/practitioners/${practitionerId}/licenses`, method: 'POST', body }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'License', id: practitionerId }],
    }),
    updateLicense: builder.mutation<License, { practitionerId: string; licenseId: string; body: LicenseFormValues }>({
      query: ({ practitionerId, licenseId, body }) => ({ url: `/practitioners/${practitionerId}/licenses/${licenseId}`, method: 'PUT', body }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'License', id: practitionerId }],
    }),
    deleteLicense: builder.mutation<void, { practitionerId: string; licenseId: string }>({
      query: ({ practitionerId, licenseId }) => ({ url: `/practitioners/${practitionerId}/licenses/${licenseId}`, method: 'DELETE' }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'License', id: practitionerId }],
    }),

    // ── Credentialing ──
    getCredentialings: builder.query<Credentialing[], string>({
      query: (id) => `/practitioners/${id}/credentialings`,
      providesTags: (_res, _err, id) => [{ type: 'Credentialing', id }],
    }),
    addCredentialing: builder.mutation<Credentialing, { practitionerId: string; body: Partial<Credentialing> }>({
      query: ({ practitionerId, body }) => ({ url: `/practitioners/${practitionerId}/credentialings`, method: 'POST', body }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Credentialing', id: practitionerId }],
    }),
    updateCredentialing: builder.mutation<Credentialing, { practitionerId: string; credentialingId: string; body: Partial<Credentialing> }>({
      query: ({ practitionerId, credentialingId, body }) => ({ url: `/practitioners/${practitionerId}/credentialings/${credentialingId}`, method: 'PUT', body }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Credentialing', id: practitionerId }],
    }),
    deleteCredentialing: builder.mutation<void, { practitionerId: string; credentialingId: string }>({
      query: ({ practitionerId, credentialingId }) => ({ url: `/practitioners/${practitionerId}/credentialings/${credentialingId}`, method: 'DELETE' }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Credentialing', id: practitionerId }],
    }),

    // ── Attestation ──
    getAttestations: builder.query<Attestation[], string>({
      query: (id) => `/practitioners/${id}/attestations`,
      providesTags: (_res, _err, id) => [{ type: 'Attestation', id }],
    }),
    addAttestation: builder.mutation<Attestation, { practitionerId: string; body: { attestationStatus: AttestationStatus; attestationSource?: string; lastAttestationDate?: string } }>({
      query: ({ practitionerId, body }) => ({ url: `/practitioners/${practitionerId}/attestations`, method: 'POST', body }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Attestation', id: practitionerId }],
    }),
    updateAttestation: builder.mutation<Attestation, { practitionerId: string; attestationId: string; body: { attestationStatus: AttestationStatus; attestationSource?: string; lastAttestationDate?: string } }>({
      query: ({ practitionerId, attestationId, body }) => ({ url: `/practitioners/${practitionerId}/attestations/${attestationId}`, method: 'PUT', body }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Attestation', id: practitionerId }],
    }),
    deleteAttestation: builder.mutation<void, { practitionerId: string; attestationId: string }>({
      query: ({ practitionerId, attestationId }) => ({ url: `/practitioners/${practitionerId}/attestations/${attestationId}`, method: 'DELETE' }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Attestation', id: practitionerId }],
    }),

    // ── Notes ──
    getNotes: builder.query<PractitionerNoteItem[], string>({
      query: (id) => `/practitioners/${id}/notes`,
      providesTags: (_res, _err, id) => [{ type: 'Note', id }],
    }),
    addNote: builder.mutation<PractitionerNoteItem, { practitionerId: string; content: string }>({
      query: ({ practitionerId, content }) => ({ url: `/practitioners/${practitionerId}/notes`, method: 'POST', body: { content } }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Note', id: practitionerId }],
    }),
    updateNote: builder.mutation<PractitionerNoteItem, { practitionerId: string; noteId: string; content: string }>({
      query: ({ practitionerId, noteId, content }) => ({ url: `/practitioners/${practitionerId}/notes/${noteId}`, method: 'PUT', body: { content } }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Note', id: practitionerId }],
    }),
    deleteNote: builder.mutation<void, { practitionerId: string; noteId: string }>({
      query: ({ practitionerId, noteId }) => ({ url: `/practitioners/${practitionerId}/notes/${noteId}`, method: 'DELETE' }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Note', id: practitionerId }],
    }),

    // transactions
    getTransactions: builder.query<Transaction[], string>({
      query: (practitionerId) =>
          `/practitioners/${practitionerId}/transactions`,
    }),

    // ── Address ──
    getAddress: builder.query<PractitionerAddress[], string>({
      query: (id) => `/practitioners/${id}/address`,
      providesTags: (_res, _err, id) => [{ type: 'Practitioner', id }],
    }),
    addAddress: builder.mutation<PractitionerAddress, { practitionerId: string; body: PractitionerFormAddress }>({
      query: ({ practitionerId, body }) => ({ url: `/practitioners/${practitionerId}/address`, method: 'POST', body }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Practitioner', id: practitionerId }],
    }),
    updateAddress: builder.mutation<PractitionerAddress, { practitionerId: string; addressId: string; body: PractitionerFormAddress; }>({
      query: ({ practitionerId, addressId, body }) => ({ url: `/practitioners/${practitionerId}/address/${addressId}`, method: 'PUT', body }),
      invalidatesTags: (_res, _err, { practitionerId, addressId }) => [{ type: 'Practitioner', id: practitionerId, addressId: addressId }],
    }),
    deleteAddress: builder.mutation<void, { practitionerId: string; addressId: string; }>({
      query: ({ practitionerId, addressId }) => ({ url: `/practitioners/${practitionerId}/address/${addressId}`, method: 'DELETE' }),
      invalidatesTags: (_res, _err, { practitionerId }) => [{ type: 'Practitioner', id: practitionerId }],
    })
  }),
});

export const {
  useGetSpecialtiesQuery, useAddSpecialtyMutation,
  useGetLicensesQuery, useAddLicenseMutation,
  useGetCredentialingsQuery, useAddCredentialingMutation,
  useGetAttestationsQuery, useAddAttestationMutation,
  useGetNotesQuery, useAddNoteMutation, useAddAddressMutation, useUpdateAddressMutation, useGetAddressQuery, useGetTransactionsQuery, useUpdateSpecialtyMutation, useDeleteSpecialtyMutation, useDeleteAddressMutation,
  useUpdateLicenseMutation, useDeleteLicenseMutation,
  useUpdateCredentialingMutation, useDeleteCredentialingMutation,
  useUpdateAttestationMutation, useDeleteAttestationMutation,
  useUpdateNoteMutation, useDeleteNoteMutation,
} = subEntityApi;
