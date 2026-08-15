package com.pdm.controller;

import com.pdm.dto.request.OrganizationLocationRequest;
import com.pdm.dto.response.OrganizationLocationResponse;
import com.pdm.service.OrganizationLocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organization-locations")
@RequiredArgsConstructor
public class OrganizationLocationController {

    private final OrganizationLocationService locationService;

    @PostMapping
    public ResponseEntity<OrganizationLocationResponse> create(@Valid @RequestBody OrganizationLocationRequest request) {
        OrganizationLocationResponse created = locationService.create(request);
        return ResponseEntity.created(URI.create("/api/v1/organization-locations/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public OrganizationLocationResponse getById(@PathVariable UUID id) {
        return locationService.getById(id);
    }

    /** e.g. GET /api/v1/organization-locations?organizationId=... -> all locations ("AIIMS Delhi",
     *  "AIIMS Chennai"...) that belong to one parent Organization ("AIIMS"). */
    @GetMapping
    public List<OrganizationLocationResponse> getByOrganization(@RequestParam UUID organizationId) {
        return locationService.getByOrganization(organizationId);
    }

    @PatchMapping("/{id}")
    public OrganizationLocationResponse update(@PathVariable UUID id, @Valid @RequestBody OrganizationLocationRequest request) {
        return locationService.update(id, request);
    }
}
