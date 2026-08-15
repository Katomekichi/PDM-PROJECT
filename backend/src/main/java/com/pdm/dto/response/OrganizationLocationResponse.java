package com.pdm.dto.response;

import com.pdm.entity.EntityStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class OrganizationLocationResponse {
    private UUID id;
    private UUID organizationId;
    private String organizationName; // denormalized for convenience so the UI doesn't need a 2nd call
    private String locationName;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String phone;
    private EntityStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
