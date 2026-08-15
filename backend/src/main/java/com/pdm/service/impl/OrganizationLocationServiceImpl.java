package com.pdm.service.impl;

import com.pdm.dto.request.OrganizationLocationRequest;
import com.pdm.dto.response.OrganizationLocationResponse;
import com.pdm.entity.Organization;
import com.pdm.entity.OrganizationLocation;
import com.pdm.exception.ResourceNotFoundException;
import com.pdm.mapper.OrganizationLocationMapper;
import com.pdm.repository.OrganizationLocationRepository;
import com.pdm.repository.OrganizationRepository;
import com.pdm.service.OrganizationLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationLocationServiceImpl implements OrganizationLocationService {

    private final OrganizationLocationRepository locationRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationLocationMapper locationMapper;

    @Override
    public OrganizationLocationResponse create(OrganizationLocationRequest request) {
        // Business rule: an Organization Location cannot exist without its parent Organization.
        Organization organization = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cannot create location: Organization not found: " + request.getOrganizationId()));

        OrganizationLocation entity = new OrganizationLocation();
        entity.setOrganization(organization);
        entity.setLocationName(request.getLocationName());
        entity.setAddressLine1(request.getAddressLine1());
        entity.setAddressLine2(request.getAddressLine2());
        entity.setCity(request.getCity());
        entity.setState(request.getState());
        entity.setPostalCode(request.getPostalCode());
        if (request.getCountry() != null) {
            entity.setCountry(request.getCountry());
        }
        entity.setPhone(request.getPhone());

        return locationMapper.toResponse(locationRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public OrganizationLocationResponse getById(UUID id) {
        return locationMapper.toResponse(findOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrganizationLocationResponse> getByOrganization(UUID organizationId) {
        return locationRepository.findByOrganizationId(organizationId).stream()
                .map(locationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrganizationLocationResponse update(UUID id, OrganizationLocationRequest request) {
        OrganizationLocation entity = findOrThrow(id);
        entity.setLocationName(request.getLocationName());
        entity.setAddressLine1(request.getAddressLine1());
        entity.setAddressLine2(request.getAddressLine2());
        entity.setCity(request.getCity());
        entity.setState(request.getState());
        entity.setPostalCode(request.getPostalCode());
        entity.setPhone(request.getPhone());
        return locationMapper.toResponse(locationRepository.save(entity));
    }

    private OrganizationLocation findOrThrow(UUID id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization Location not found: " + id));
    }
}
