package com.pdm.service.impl;

import com.pdm.dto.request.PractitionerRoleRequest;
import com.pdm.dto.response.PractitionerRoleResponse;
import com.pdm.entity.EntityStatus;
import com.pdm.entity.OrganizationLocation;
import com.pdm.entity.Practitioner;
import com.pdm.entity.PractitionerRole;
import com.pdm.exception.ResourceNotFoundException;
import com.pdm.mapper.PractitionerRoleMapper;
import com.pdm.repository.OrganizationLocationRepository;
import com.pdm.repository.PractitionerRepository;
import com.pdm.repository.PractitionerRoleRepository;
import com.pdm.service.PractitionerRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * This is the service that answers the exact question you asked: "in which org location is
 * he attached." A PractitionerRole record is the answer - it's the join between Practitioner
 * and OrganizationLocation, carrying the specialty/role and the effective date range.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PractitionerRoleServiceImpl implements PractitionerRoleService {

    private final PractitionerRoleRepository roleRepository;
    private final PractitionerRepository practitionerRepository;
    private final OrganizationLocationRepository locationRepository;
    private final PractitionerRoleMapper roleMapper;

    @Override
    public PractitionerRoleResponse assign(PractitionerRoleRequest request) {
        // Business rule: Practitioner Role requires BOTH a Practitioner and an
        // Organization Location to already exist - we fetch and validate both before
        // creating the relationship, never just trust the incoming IDs.
        Practitioner practitioner = practitionerRepository.findById(request.getPractitionerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cannot assign role: Practitioner not found: " + request.getPractitionerId()));

        OrganizationLocation location = locationRepository.findById(request.getOrganizationLocationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cannot assign role: Organization Location not found: " + request.getOrganizationLocationId()));

        PractitionerRole role = new PractitionerRole();
        role.setPractitioner(practitioner);
        role.setOrganizationLocation(location);
        role.setRoleSpecialty(request.getRoleSpecialty());
        role.setStartDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now());
        role.setEndDate(request.getEndDate());
        role.setStatus(EntityStatus.ACTIVE);

        return roleMapper.toResponse(roleRepository.save(role));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PractitionerRoleResponse> getByPractitioner(UUID practitionerId) {
        return roleRepository.findByPractitionerId(practitionerId).stream()
                .map(roleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PractitionerRoleResponse> getByOrganizationLocation(UUID organizationLocationId) {
        return roleRepository.findByOrganizationLocationId(organizationLocationId).stream()
                .map(roleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void endRole(UUID id) {
        PractitionerRole role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Practitioner Role not found: " + id));
        role.setStatus(EntityStatus.TERMINATED);
        role.setEndDate(LocalDate.now());
        roleRepository.save(role);
    }
}
