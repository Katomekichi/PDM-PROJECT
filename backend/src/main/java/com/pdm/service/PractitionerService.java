package com.pdm.service;

import com.pdm.dto.request.PractitionerRequest;
import com.pdm.dto.response.PractitionerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PractitionerService {
    PractitionerResponse create(PractitionerRequest request);
    PractitionerResponse getById(UUID id);
    Page<PractitionerResponse> search(String npi, String lastName, Pageable pageable);
    PractitionerResponse update(UUID id, PractitionerRequest request);
    void terminate(UUID id);
    void reinstate(UUID id);
}
