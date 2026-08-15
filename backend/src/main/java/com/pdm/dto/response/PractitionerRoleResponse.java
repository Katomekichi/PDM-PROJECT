package com.pdm.dto.response;

import com.pdm.entity.EntityStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
public class PractitionerRoleResponse {
    private UUID id;
    private UUID practitionerId;
    private String practitionerName; // denormalized for UI convenience
    private UUID organizationLocationId;
    private String organizationLocationName;
    private String roleSpecialty;
    private LocalDate startDate;
    private LocalDate endDate;
    private EntityStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
