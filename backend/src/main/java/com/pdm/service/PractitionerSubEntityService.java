package com.pdm.service;

import com.pdm.dto.request.*;
import com.pdm.dto.response.*;

import java.util.List;
import java.util.UUID;

/**
 * One interface for all practitioner sub-entities (Specialty, License, Credentialing,
 * Attestation, Notes). They follow the same pattern — all are children of a Practitioner,
 * all are fetched by practitioner ID — so one interface keeps the controller slim.
 */
public interface PractitionerSubEntityService {

    // ── Specialty ──
    SpecialtyResponse addSpecialty(UUID practitionerId, SpecialtyRequest request);
    List<SpecialtyResponse> getSpecialties(UUID practitionerId, UUID specialtyId);
    SpecialtyResponse updateSpecialties(UUID practitionerId, UUID specialtyId, SpecialtyRequest request);
    SpecialtyResponse deleteSpecialty(
            UUID practitionerId,
            UUID specialtyId
    );

    // ── License ──
    LicenseResponse addLicense(UUID practitionerId, LicenseRequest request);
    List<LicenseResponse> getLicenses(UUID practitionerId);

    // ── Credentialing ──
    CredentialingResponse addCredentialing(UUID practitionerId, CredentialingRequest request);
    List<CredentialingResponse> getCredentialings(UUID practitionerId);

    // ── Attestation ──
    AttestationResponse addAttestation(UUID practitionerId, AttestationRequest request);
    List<AttestationResponse> getAttestations(UUID practitionerId);

    // ── Notes ──
    // NoteResponse addNote(UUID practitionerId, NoteRequest request, String authorUsername);
    NoteResponse addNote(UUID practitionerId, NoteRequest request);
    List<NoteResponse> getNotes(UUID practitionerId);

    // Address
    AddressResponse addAddress(UUID practitionerId, AddressRequest request);
    List<AddressResponse> getAddress(UUID practitionerId);
    AddressResponse updateAddress(UUID practitionerId, UUID addressId, AddressRequest request);
    AddressResponse deleteAddress(UUID practitionerId, UUID addressId);
}
