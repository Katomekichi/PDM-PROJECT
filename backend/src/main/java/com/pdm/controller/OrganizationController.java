package com.pdm.controller;

import com.pdm.dto.request.OrganizationRequest;
import com.pdm.dto.response.OrganizationResponse;
import com.pdm.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping
    public ResponseEntity<OrganizationResponse> create(@Valid @RequestBody OrganizationRequest request) {
        OrganizationResponse created = organizationService.create(request);
        return ResponseEntity.created(URI.create("/api/v1/organizations/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public OrganizationResponse getById(@PathVariable UUID id) {
        return organizationService.getById(id);
    }

    @GetMapping
    public Page<OrganizationResponse> getAll(Pageable pageable) {
        return organizationService.getAll(pageable);
    }

    @PatchMapping("/{id}")
    public OrganizationResponse update(@PathVariable UUID id, @Valid @RequestBody OrganizationRequest request) {
        return organizationService.update(id, request);
    }

    @PostMapping("/{id}/terminate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void terminate(@PathVariable UUID id) {
        organizationService.terminate(id);
    }
}
