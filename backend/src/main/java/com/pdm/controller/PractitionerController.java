package com.pdm.controller;

import com.pdm.dto.request.PractitionerRequest;
import com.pdm.dto.response.PractitionerResponse;
import com.pdm.service.PractitionerService;
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
@RequestMapping("/api/v1/practitioners")
@RequiredArgsConstructor
public class PractitionerController {

    private final PractitionerService practitionerService;

    @PostMapping
    public ResponseEntity<PractitionerResponse> create(@Valid @RequestBody PractitionerRequest request) {
        PractitionerResponse created = practitionerService.create(request);
        return ResponseEntity.created(URI.create("/api/v1/practitioners/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public PractitionerResponse getById(@PathVariable UUID id) {
        return practitionerService.getById(id);
    }

    /** Supports GET /api/v1/practitioners?npi=1234567890&lastName=Smith&page=0&size=20 */
    @GetMapping
    public Page<PractitionerResponse> search(
            @RequestParam(required = false) String npi,
            @RequestParam(required = false) String lastName,
            Pageable pageable) {
        return practitionerService.search(npi, lastName, pageable);
    }

    @PatchMapping("/{id}")
    public PractitionerResponse update(@PathVariable UUID id, @Valid @RequestBody PractitionerRequest request) {
        return practitionerService.update(id, request);
    }

    /** Terminate is modeled as an action, not a destructive DELETE - matches how Provider
     *  Service Manager works in the real PDM system (terminate/reinstate, not hard delete). */
    @PostMapping("/{id}/terminate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void terminate(@PathVariable UUID id) {
        practitionerService.terminate(id);
    }

    @PostMapping("/{id}/reinstate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reinstate(@PathVariable UUID id) {
        practitionerService.reinstate(id);
    }
}
