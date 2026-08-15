package com.pdm.dto.response;

import com.pdm.entity.EntityStatus;
import com.pdm.entity.NpiType;
import com.pdm.entity.PractitionerType;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
public class PractitionerResponse {
    private UUID id;
    private String healthPlanId;
    private String npi;
    private NpiType npiType;
    private String firstName;
    private String middleName;
    private String lastName;
    private String suffix;
    private PractitionerType practitionerType;
    private boolean autoAssignPcp;
    private EntityStatus status;
    private LocalDate firstActiveDate;
    private String gender;
    private LocalDate dateOfBirth;
    private Instant createdAt;
    private Instant updatedAt;
}
