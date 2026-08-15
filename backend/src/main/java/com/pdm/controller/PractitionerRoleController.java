package com.pdm.controller;

import com.pdm.dto.request.PractitionerRoleRequest;
import com.pdm.dto.response.PractitionerRoleResponse;
import com.pdm.service.PractitionerRoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

/**
 * This controller is the literal answer to "attach practitioner X to org location Y."
 * POST /api/v1/practitioner-roles  { practitionerId, organizationLocationId, roleSpecialty, startDate }
 */
@RestController
@RequestMapping("/api/v1/practitioner-roles")
@RequiredArgsConstructor
public class PractitionerRoleController {

    private final PractitionerRoleService roleService;

    @PostMapping
    public ResponseEntity<PractitionerRoleResponse> assign(@Valid @RequestBody PractitionerRoleRequest request) {
        PractitionerRoleResponse created = roleService.assign(request);
        return ResponseEntity.created(URI.create("/api/v1/practitioner-roles/" + created.getId())).body(created);
    }

    @GetMapping(params = "practitionerId")
    public List<PractitionerRoleResponse> getByPractitioner(@RequestParam UUID practitionerId) {
        return roleService.getByPractitioner(practitionerId);
    }

    @GetMapping(params = "organizationLocationId")
    public List<PractitionerRoleResponse> getByOrganizationLocation(@RequestParam UUID organizationLocationId) {
        return roleService.getByOrganizationLocation(organizationLocationId);
    }

    @PostMapping("/{id}/end")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void endRole(@PathVariable UUID id) {
        roleService.endRole(id);
    }
}
