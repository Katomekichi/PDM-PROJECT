package com.pdm.dto.response;

import com.pdm.entity.AttestationStatus;
import lombok.Builder;
import lombok.Getter;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter @Builder
public class AttestationResponse {
    private UUID id;
    private UUID practitionerId;
    private AttestationStatus attestationStatus;
    private String attestationSource;
    private LocalDate requestedDate;
    private LocalDate lastAttestationDate;
    private LocalDate nextAttestationDue;
    private Instant createdAt;
}
