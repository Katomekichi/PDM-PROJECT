package com.pdm.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SpecialtyRequest {
    @NotBlank private String taxonomyCode;
    private String taxonomyDescription;
    private String hsdCode;
    private String specialtySource;
    private boolean primary;
    private String clinicalInterest;
    private String boardCertificationBody;
    private String certificationState;
    private String certificationCountry;
}
