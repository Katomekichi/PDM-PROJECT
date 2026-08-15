package com.pdm.service.impl;

import com.pdm.dto.request.OrganizationRequest;
import com.pdm.dto.response.OrganizationResponse;
import com.pdm.entity.EntityStatus;
import com.pdm.entity.Organization;
import com.pdm.exception.DuplicateResourceException;
import com.pdm.exception.ResourceNotFoundException;
import com.pdm.mapper.OrganizationMapper;
import com.pdm.repository.OrganizationRepository;
import com.pdm.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationMapper organizationMapper;

    @Override
    public OrganizationResponse create(OrganizationRequest request) {
        // Business rules: Tax ID unique, NPI unique (Section 7).
        if (organizationRepository.existsByTaxId(request.getTaxId())) {
            throw new DuplicateResourceException("An organization with Tax ID " + request.getTaxId() + " already exists");
        }
        if (organizationRepository.existsByNpi(request.getNpi())) {
            throw new DuplicateResourceException("An organization with NPI " + request.getNpi() + " already exists");
        }
        Organization entity = organizationMapper.toEntity(request);
        entity.setStatus(EntityStatus.ACTIVE);
        return organizationMapper.toResponse(organizationRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public OrganizationResponse getById(UUID id) {
        return organizationMapper.toResponse(findOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrganizationResponse> getAll(Pageable pageable) {
        return organizationRepository.findAll(pageable).map(organizationMapper::toResponse);
    }

    @Override
    public OrganizationResponse update(UUID id, OrganizationRequest request) {
        Organization entity = findOrThrow(id);
        if (!entity.getTaxId().equals(request.getTaxId()) && organizationRepository.existsByTaxId(request.getTaxId())) {
            throw new DuplicateResourceException("An organization with Tax ID " + request.getTaxId() + " already exists");
        }
        organizationMapper.updateEntityFromRequest(request, entity);
        return organizationMapper.toResponse(organizationRepository.save(entity));
    }

    @Override
    public void terminate(UUID id) {
        Organization entity = findOrThrow(id);
        entity.setStatus(EntityStatus.TERMINATED);
        organizationRepository.save(entity);
    }

    private Organization findOrThrow(UUID id) {
        return organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found: " + id));
    }
}
