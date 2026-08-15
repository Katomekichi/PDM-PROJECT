package com.pdm.dto.response;

import com.pdm.entity.EntityStatus;
import com.pdm.entity.NpiType;
import com.pdm.entity.OrganizationType;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class OrganizationResponse {
    private UUID id;
    private String legalName;
    private OrganizationType organizationType;
    private String npi;
    private NpiType npiType;
    private String taxId;
    private EntityStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
