package com.pdm.dto.response;

import com.pdm.entity.EntityStatus;
import com.pdm.entity.LicenseType;
import lombok.Builder;
import lombok.Getter;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter @Builder
public class LicenseResponse {
    private UUID id;
    private UUID practitionerId;
    private LicenseType licenseType;
    private String licenseNumber;
    private String state;
    private String country;
    private LocalDate issuedDate;
    private LocalDate expiryDate;
    private boolean doNotDisplayInDirectory;
    private EntityStatus status;
    private Instant createdAt;
}
