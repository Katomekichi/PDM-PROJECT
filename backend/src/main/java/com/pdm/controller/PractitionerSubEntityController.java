package com.pdm.controller;

import com.pdm.dto.request.*;
import com.pdm.dto.response.*;
import com.pdm.service.PractitionerSubEntityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * All sub-entity endpoints live under /api/v1/practitioners/{id}/* to make clear that
 * these are children of a Practitioner, not independent resources.
 *
 * RBAC rules here mirror the transcript's logic:
 *  - Any authenticated user can GET (read data)
 *  - Only PD_ASSOCIATE or PD_ADMIN can POST new sub-entities
 *  - Only PD_ADMIN can affect credentialing records (they control payment/directory holds)
 */
@RestController
@RequestMapping("/api/v1/practitioners/{practitionerId}")
@RequiredArgsConstructor
public class PractitionerSubEntityController {

    private final PractitionerSubEntityService service;

    // ── Specialty ──────────────────────────────────────────────────────────────
    @PostMapping("/specialties")
    @ResponseStatus(HttpStatus.CREATED)
    // @PreAuthorize("hasAnyRole('PD_ASSOCIATE','PD_ADMIN')")
    public SpecialtyResponse addSpecialty(@PathVariable UUID practitionerId,
                                          @Valid @RequestBody SpecialtyRequest request) {
        return service.addSpecialty(practitionerId, request);
    }

    @GetMapping("/specialties")
    public List<SpecialtyResponse> getSpecialties(@PathVariable UUID practitionerId, UUID specialtyId) {
        return service.getSpecialties(practitionerId, specialtyId);
    }

    @PutMapping("/specialties/{specialtyId}")
    @ResponseStatus(HttpStatus.OK)
    public SpecialtyResponse updateSpecialty(
            @PathVariable UUID practitionerId,
            @PathVariable UUID specialtyId,
            @RequestBody SpecialtyRequest request) {

            return service.updateSpecialties(practitionerId, specialtyId, request);
    }

    @DeleteMapping("/specialties/{specialtyId}")
    @ResponseStatus(HttpStatus.OK)
    public SpecialtyResponse deleteSpecialty(
            @PathVariable UUID practitionerId,
            @PathVariable UUID specialtyId) {

            return service.deleteSpecialty(practitionerId, specialtyId);
    }

    // ── License ────────────────────────────────────────────────────────────────
    @PostMapping("/licenses")
    @ResponseStatus(HttpStatus.CREATED)
    // @PreAuthorize("hasAnyRole('PD_ASSOCIATE','PD_ADMIN')")
    public LicenseResponse addLicense(@PathVariable UUID practitionerId,
                                       @Valid @RequestBody LicenseRequest request) {
        return service.addLicense(practitionerId, request);
    }

    @GetMapping("/licenses")
    // @PreAuthorize("hasAnyRole('PD_ASSOCIATE','PD_ADMIN')")
    public List<LicenseResponse> getLicenses(@PathVariable UUID practitionerId) {
        return service.getLicenses(practitionerId);
    }

    // ── Credentialing ──────────────────────────────────────────────────────────
    @PostMapping("/credentialings")
    @ResponseStatus(HttpStatus.CREATED)
    // @PreAuthorize("hasRole('PD_ADMIN')")
    public CredentialingResponse addCredentialing(@PathVariable UUID practitionerId,
                                                   @Valid @RequestBody CredentialingRequest request) {
        return service.addCredentialing(practitionerId, request);
    }

    @GetMapping("/credentialings")
    public List<CredentialingResponse> getCredentialings(@PathVariable UUID practitionerId) {
        return service.getCredentialings(practitionerId);
    }

    // ── Attestation ────────────────────────────────────────────────────────────
    @PostMapping("/attestations")
    @ResponseStatus(HttpStatus.CREATED)
    // @PreAuthorize("hasAnyRole('PD_ASSOCIATE','PD_ADMIN')")
    public AttestationResponse addAttestation(@PathVariable UUID practitionerId,
                                               @Valid @RequestBody AttestationRequest request) {
        return service.addAttestation(practitionerId, request);
    }

    @GetMapping("/attestations")
    public List<AttestationResponse> getAttestations(@PathVariable UUID practitionerId) {
        return service.getAttestations(practitionerId);
    }

    // ── Notes ──────────────────────────────────────────────────────────────────
    // @PostMapping("/notes")
    // @ResponseStatus(HttpStatus.CREATED)
    // // @PreAuthorize("hasAnyRole('PD_ASSOCIATE','PD_ADMIN')")
    // public NoteResponse addNote(@PathVariable UUID practitionerId,
    //                              @Valid @RequestBody NoteRequest request,
    //                              Authentication authentication) {
    //     // Notes carry the author's username so PD associates can see who wrote what.
    //     return service.addNote(practitionerId, request, authentication.getName());
    // }

    @PostMapping("/notes")
    @ResponseStatus(HttpStatus.CREATED)
    // @PreAuthorize("hasAnyRole('PD_ASSOCIATE','PD_ADMIN')")
    public NoteResponse addNote(@PathVariable UUID practitionerId,
                                 @Valid @RequestBody NoteRequest request
                                 ) {
        // Notes carry the author's username so PD associates can see who wrote what.
        return service.addNote(practitionerId, request);
    }

    @GetMapping("/notes")
    public List<NoteResponse> getNotes(@PathVariable UUID practitionerId) {
        return service.getNotes(practitionerId);
    }

    // Address
    @PostMapping("/address")
    @ResponseStatus(HttpStatus.CREATED)
    public AddressResponse addAddress(@PathVariable UUID practitionerId,
                                 @Valid @RequestBody AddressRequest request
                                 ) {
        return service.addAddress(practitionerId, request);
    }

    @GetMapping("/address")
    public List<AddressResponse> getAddress(@PathVariable UUID practitionerId) {
        return service.getAddress(practitionerId);
    }

    @PutMapping("/address/{addressId}")
    @ResponseStatus(HttpStatus.OK)
    public AddressResponse updateAddress(@PathVariable UUID practitionerId, UUID addressId, @RequestBody AddressRequest request) {
        return service.updateAddress(practitionerId, addressId, request);
    }

    @DeleteMapping("address/{addressId}")
    @ResponseStatus(HttpStatus.OK)
    public AddressResponse deleteAddress(@PathVariable UUID practitionerId, UUID addressId) {
        return service.deleteAddress(practitionerId, addressId);
    }
}
