package com.pdm.service;

import com.pdm.dto.request.OrganizationRequest;
import com.pdm.dto.response.OrganizationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface OrganizationService {
    OrganizationResponse create(OrganizationRequest request);
    OrganizationResponse getById(UUID id);
    Page<OrganizationResponse> getAll(Pageable pageable);
    OrganizationResponse update(UUID id, OrganizationRequest request);
    void terminate(UUID id);
}
