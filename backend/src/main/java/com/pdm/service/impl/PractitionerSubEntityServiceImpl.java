package com.pdm.service.impl;

import com.pdm.dto.request.*;
import com.pdm.dto.response.*;
import com.pdm.entity.*;
import com.pdm.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pdm.exception.ResourceNotFoundException;
import com.pdm.repository.*;

import lombok.RequiredArgsConstructor;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PractitionerSubEntityServiceImpl implements PractitionerSubEntityService {

    private final PractitionerRepository practitionerRepository;
    private final PractitionerSpecialtyRepository specialtyRepository;
    private final PractitionerLicenseRepository licenseRepository;
    private final PractitionerCredentialingRepository credentialingRepository;
    private final PractitionerAttestationRepository attestationRepository;
    private final PractitionerNoteRepository noteRepository;
    private final PractitionerAddressRepository addressRepository;
    private final AuditTransactionService auditService;

    // ── Specialty ──────────────────────────────────────────────────────────────
    @Override
    public SpecialtyResponse addSpecialty(UUID practitionerId, SpecialtyRequest req) {
        Practitioner p = findPractitioner(practitionerId);
        PractitionerSpecialty entity = new PractitionerSpecialty();
        entity.setPractitioner(p);
        entity.setTaxonomyCode(req.getTaxonomyCode());
        entity.setTaxonomyDescription(req.getTaxonomyDescription());
        entity.setHsdCode(req.getHsdCode());
        entity.setSpecialtySource(req.getSpecialtySource());
        entity.setPrimary(req.isPrimary());
        entity.setClinicalInterest(req.getClinicalInterest());
        entity.setBoardCertificationBody(req.getBoardCertificationBody());
        entity.setCertificationState(req.getCertificationState());
        entity.setCertificationCountry(req.getCertificationCountry());
        PractitionerSpecialty saved = specialtyRepository.save(entity);
        SpecialtyResponse response = toSpecialtyResponse(saved);

        auditService.createAudit(
            "SPECIALTY",
            saved.getId(),
            practitionerId,
            "CREATE",
            response
        );

        return response;
    }

    @Override
    @Transactional
    public SpecialtyResponse updateSpecialties(
            UUID practitionerId,
            UUID specialtyId,
            SpecialtyRequest request) {

        PractitionerSpecialty specialty =
            specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new ResourceNotFoundException("Specialty not found"));

        specialty.setTaxonomyCode(request.getTaxonomyCode());
        specialty.setTaxonomyDescription(request.getTaxonomyDescription());
        specialty.setHsdCode(request.getHsdCode());
        specialty.setClinicalInterest(request.getClinicalInterest());
        specialty.setSpecialtySource(request.getSpecialtySource());
        specialty.setPrimary(request.isPrimary());

        specialtyRepository.save(specialty);

        return toSpecialtyResponse(specialty);
    }

    @Override
    @Transactional
    public SpecialtyResponse deleteSpecialty(
            UUID practitionerId,
            UUID specialtyId) {

        PractitionerSpecialty specialty =
            specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new ResourceNotFoundException("Specialty not found"));

        specialtyRepository.delete(specialty);
        return toSpecialtyResponse(specialty);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpecialtyResponse> getSpecialties(UUID practitionerId, UUID specialtyId) {
        return specialtyRepository.findByPractitionerId(practitionerId)
        // return specialtyRepository.findByPractitionerId(practitionerId, specialtyId)
                .stream().map(this::toSpecialtyResponse).collect(Collectors.toList());
    }

    // ── License ────────────────────────────────────────────────────────────────
    @Override
    public LicenseResponse addLicense(UUID practitionerId, LicenseRequest req) {
        Practitioner p = findPractitioner(practitionerId);
        PractitionerLicense entity = new PractitionerLicense();
        entity.setPractitioner(p);
        entity.setLicenseType(req.getLicenseType());
        entity.setLicenseNumber(req.getLicenseNumber());
        entity.setState(req.getState());
        entity.setCountry(req.getCountry());
        entity.setIssuedDate(req.getIssuedDate());
        entity.setExpiryDate(req.getExpiryDate());
        entity.setDoNotDisplayInDirectory(req.isDoNotDisplayInDirectory());
        entity.setStatus(EntityStatus.ACTIVE);
        PractitionerLicense saved = licenseRepository.save(entity);
        LicenseResponse response = toLicenseResponse(saved);

        auditService.createAudit(
            "LICENSE",
            saved.getId(),
            practitionerId,
            "CREATE",
            response
        );

        return response;
        // return toLicenseResponse(licenseRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LicenseResponse> getLicenses(UUID practitionerId) {
        return licenseRepository.findByPractitionerId(practitionerId)
                .stream().map(this::toLicenseResponse).collect(Collectors.toList());
    }

    // ── Credentialing ──────────────────────────────────────────────────────────
    @Override
    public CredentialingResponse addCredentialing(UUID practitionerId, CredentialingRequest req) {
        Practitioner p = findPractitioner(practitionerId);
        PractitionerCredentialing entity = new PractitionerCredentialing();
        entity.setPractitioner(p);
        entity.setCredentialingType(req.getCredentialingType());
        entity.setCredentialingStatus(req.getCredentialingStatus());
        entity.setCredentialSource(req.getCredentialSource());
        entity.setSourceAssociateName(req.getSourceAssociateName());
        entity.setState(req.getState());
        entity.setDateSentToEntity(req.getDateSentToEntity());
        entity.setEffectiveDate(req.getEffectiveDate());
        entity.setExpiryDate(req.getExpiryDate());
        entity.setDisciplinaryActionReason(req.getDisciplinaryActionReason());
        entity.setProcessingActionNote(req.getProcessingActionNote());
        entity.setProcessingStatus(req.getProcessingStatus() != null ? req.getProcessingStatus() : ProcessingStatus.NONE);

        PractitionerCredentialing saved = credentialingRepository.save(entity);
        CredentialingResponse response = toCredentialingResponse(saved);
        auditService.createAudit(
            "CREDENTIALING",
            saved.getId(),
            practitionerId,
            "CREATE",
            response
        );

        return response;
        // return toCredentialingResponse(credentialingRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CredentialingResponse> getCredentialings(UUID practitionerId) {
        return credentialingRepository.findByPractitionerId(practitionerId)
                .stream().map(this::toCredentialingResponse).collect(Collectors.toList());
    }

    // ── Attestation ────────────────────────────────────────────────────────────
    @Override
    public AttestationResponse addAttestation(UUID practitionerId, AttestationRequest req) {
        Practitioner p = findPractitioner(practitionerId);
        PractitionerAttestation entity = new PractitionerAttestation();
        entity.setPractitioner(p);
        entity.setAttestationStatus(req.getAttestationStatus());
        entity.setAttestationSource(req.getAttestationSource());
        entity.setRequestedDate(req.getRequestedDate());
        entity.setLastAttestationDate(req.getLastAttestationDate());
        // Business rule: next due = last attestation + 90 days.
        if (req.getLastAttestationDate() != null) {
            entity.setNextAttestationDue(req.getLastAttestationDate().plusDays(90));
        }
        PractitionerAttestation saved = attestationRepository.save(entity);
        AttestationResponse response = toAttestationResponse(saved);
        auditService.createAudit(
            "ATTESTATION",
            saved.getId(),
            practitionerId,
            "CREATE",
            response
        );

        return response;
        // return toAttestationResponse(attestationRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttestationResponse> getAttestations(UUID practitionerId) {
        return attestationRepository.findByPractitionerId(practitionerId)
                .stream().map(this::toAttestationResponse).collect(Collectors.toList());
    }

    // ── Notes ──────────────────────────────────────────────────────────────────
    @Override
    // public NoteResponse addNote(UUID practitionerId, NoteRequest req, String authorUsername) {
    public NoteResponse addNote(UUID practitionerId, NoteRequest req) {
        Practitioner p = findPractitioner(practitionerId);
        PractitionerNote note = new PractitionerNote();
        note.setPractitioner(p);
        note.setAuthorUsername("ANKIT_TEST");
        note.setContent(req.getContent());
        PractitionerNote saved = noteRepository.save(note);
        NoteResponse response = toNoteResponse(saved);
        auditService.createAudit(
            "NOTES",
            saved.getId(),
            practitionerId,
            "CREATE",
            response
        );

        return response;
        // return toNoteResponse(noteRepository.save(note));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoteResponse> getNotes(UUID practitionerId) {
        return noteRepository.findByPractitionerIdOrderByCreatedAtAsc(practitionerId)
                .stream().map(this::toNoteResponse).collect(Collectors.toList());
    }

    // Address
    @Override
    public AddressResponse addAddress(UUID practitionerId, AddressRequest req) {
        Practitioner p = findPractitioner(practitionerId);
        PractitionerAddress address = new PractitionerAddress();
        address.setPractitioner(p);
        // address.setAuthorUsername(authorUsername);
        address.setAddressLine1(req.getAddressLine1());
        address.setPhone(req.getPhone());
        address.setCity(req.getCity());
        address.setState(req.getState());
        address.setCountry(req.getCountry());
        address.setPincode(req.getPincode());
        address.setPrimary(req.isPrimary());
        PractitionerAddress saved = addressRepository.save(address);
        AddressResponse response = toAddressResponse(saved);
        auditService.createAudit(
            "ADDRESS",
            saved.getId(),
            practitionerId,
            "CREATE",
            response
        );

        return response;
        // return toAddressResponse(addressRepository.save(address));
    }

    @Override
    public AddressResponse updateAddress(UUID practitionerId, UUID addressId, AddressRequest req) {
        PractitionerAddress address = addressRepository.findById(addressId)
        .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        address.setAddressLine1(req.getAddressLine1());
        address.setPhone(req.getPhone());
        address.setCity(req.getCity());
        address.setState(req.getState());
        address.setCountry(req.getCountry());
        address.setPincode(req.getPincode());
        address.setPrimary(req.isPrimary());
        addressRepository.save(address);
        return toAddressResponse(address);
    }
    @Override
    @Transactional
    public AddressResponse deleteAddress(UUID practitionerId, UUID addressId) {
        PractitionerAddress address =
            addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Specialty not found"));

        addressRepository.delete(address);
        return toAddressResponse(address);
    } 

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getAddress(UUID practitionerId) {
        return addressRepository.findByPractitionerId(practitionerId)
                .stream().map(this::toAddressResponse).collect(Collectors.toList());
    }

    // ── Helpers ────────────────────────────────────────────────────────────────
    private Practitioner findPractitioner(UUID id) {
        return practitionerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Practitioner not found: " + id));
    }

    private SpecialtyResponse toSpecialtyResponse(PractitionerSpecialty e) {
        return SpecialtyResponse.builder()
                .id(e.getId()).practitionerId(e.getPractitioner().getId())
                .taxonomyCode(e.getTaxonomyCode()).taxonomyDescription(e.getTaxonomyDescription())
                .hsdCode(e.getHsdCode()).specialtySource(e.getSpecialtySource())
                .primary(e.isPrimary()).clinicalInterest(e.getClinicalInterest())
                .boardCertificationBody(e.getBoardCertificationBody())
                .certificationState(e.getCertificationState()).certificationCountry(e.getCertificationCountry())
                .createdAt(e.getCreatedAt()).build();
    }

    private LicenseResponse toLicenseResponse(PractitionerLicense e) {
        return LicenseResponse.builder()
                .id(e.getId()).practitionerId(e.getPractitioner().getId())
                .licenseType(e.getLicenseType()).licenseNumber(e.getLicenseNumber())
                .state(e.getState()).country(e.getCountry())
                .issuedDate(e.getIssuedDate()).expiryDate(e.getExpiryDate())
                .doNotDisplayInDirectory(e.isDoNotDisplayInDirectory()).status(e.getStatus())
                .createdAt(e.getCreatedAt()).build();
    }

    private CredentialingResponse toCredentialingResponse(PractitionerCredentialing e) {
        return CredentialingResponse.builder()
                .id(e.getId()).practitionerId(e.getPractitioner().getId())
                .credentialingType(e.getCredentialingType()).credentialingStatus(e.getCredentialingStatus())
                .credentialSource(e.getCredentialSource()).sourceAssociateName(e.getSourceAssociateName())
                .state(e.getState()).dateSentToEntity(e.getDateSentToEntity())
                .effectiveDate(e.getEffectiveDate()).expiryDate(e.getExpiryDate())
                .disciplinaryActionReason(e.getDisciplinaryActionReason())
                .processingActionNote(e.getProcessingActionNote()).processingStatus(e.getProcessingStatus())
                .createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }

    private AttestationResponse toAttestationResponse(PractitionerAttestation e) {
        return AttestationResponse.builder()
                .id(e.getId()).practitionerId(e.getPractitioner().getId())
                .attestationStatus(e.getAttestationStatus()).attestationSource(e.getAttestationSource())
                .requestedDate(e.getRequestedDate()).lastAttestationDate(e.getLastAttestationDate())
                .nextAttestationDue(e.getNextAttestationDue()).createdAt(e.getCreatedAt()).build();
    }

    private NoteResponse toNoteResponse(PractitionerNote e) {
        return NoteResponse.builder()
                .id(e.getId()).practitionerId(e.getPractitioner().getId())
                .authorUsername(e.getAuthorUsername()).content(e.getContent())
                .createdAt(e.getCreatedAt()).build();
    }

    private AddressResponse toAddressResponse(PractitionerAddress e) {
        return AddressResponse.builder()
                .id(e.getId()).practitionerId(e.getPractitioner().getId())
                .addressLine1(e.getAddressLine1())
                .phone(e.getPhone())
                .city(e.getCity())
                .state(e.getState()).country(e.getCountry())
                .pincode(e.getPincode()).primary(e.isPrimary())
                .createdAt(e.getCreatedAt()).build();
    }
}
