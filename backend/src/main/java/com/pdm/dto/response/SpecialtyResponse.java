package com.pdm.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.time.Instant;
import java.util.UUID;

@Getter @Builder
public class SpecialtyResponse {
    private UUID id;
    private UUID practitionerId;
    private String taxonomyCode;
    private String taxonomyDescription;
    private String hsdCode;
    private String specialtySource;
    private boolean primary;
    private String clinicalInterest;
    private String boardCertificationBody;
    private String certificationState;
    private String certificationCountry;
    private Instant createdAt;
}
