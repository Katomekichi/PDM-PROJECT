package com.pdm.service;

import com.pdm.dto.request.PractitionerRoleRequest;
import com.pdm.dto.response.PractitionerRoleResponse;

import java.util.List;
import java.util.UUID;

public interface PractitionerRoleService {
    /** This is THE operation that answers "attach this practitioner to this org location". */
    PractitionerRoleResponse assign(PractitionerRoleRequest request);
    List<PractitionerRoleResponse> getByPractitioner(UUID practitionerId);
    List<PractitionerRoleResponse> getByOrganizationLocation(UUID organizationLocationId);
    void endRole(UUID id);
}
