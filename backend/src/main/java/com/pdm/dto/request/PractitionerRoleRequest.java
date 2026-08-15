package com.pdm.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

/** This is the API-level representation of "attach practitioner X to org location Y as role Z". */
@Getter
@Setter
public class PractitionerRoleRequest {

    @NotNull
    private UUID practitionerId;

    @NotNull
    private UUID organizationLocationId;

    @NotBlank
    private String roleSpecialty;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;
}
