package com.pdm.dto.response;

import com.pdm.entity.CredentialingStatus;
import com.pdm.entity.CredentialingType;
import com.pdm.entity.ProcessingStatus;
import lombok.Builder;
import lombok.Getter;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter @Builder
public class CredentialingResponse {
    private UUID id;
    private UUID practitionerId;
    private CredentialingType credentialingType;
    private CredentialingStatus credentialingStatus;
    private String credentialSource;
    private String sourceAssociateName;
    private String state;
    private LocalDate dateSentToEntity;
    private LocalDate effectiveDate;
    private LocalDate expiryDate;
    private String disciplinaryActionReason;
    private String processingActionNote;
    private ProcessingStatus processingStatus;
    private Instant createdAt;
    private Instant updatedAt;
}
