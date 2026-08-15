package com.pdm.service;

import com.pdm.dto.request.OrganizationLocationRequest;
import com.pdm.dto.response.OrganizationLocationResponse;

import java.util.List;
import java.util.UUID;

public interface OrganizationLocationService {
    OrganizationLocationResponse create(OrganizationLocationRequest request);
    OrganizationLocationResponse getById(UUID id);
    List<OrganizationLocationResponse> getByOrganization(UUID organizationId);
    OrganizationLocationResponse update(UUID id, OrganizationLocationRequest request);
}
