package com.pdm.dto.request;

import com.pdm.entity.PractitionerType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * What the API accepts on create/update. Deliberately separate from the JPA entity:
 * the request shape is a contract with the frontend and should not change just because
 * we refactor the entity internally (e.g. adding a Demographics child table later should
 * NOT be a breaking API change if we keep the DTO stable and just change the mapper).
 */
@Getter
@Setter
public class PractitionerRequest {

    @NotBlank
    @Pattern(regexp = "\\d{10}", message = "NPI must be exactly 10 digits")
    private String npi;

    @NotBlank
    @Size(max = 100)
    private String firstName;

    @Size(max = 100)
    private String middleName;

    @NotBlank
    @Size(max = 100)
    private String lastName;

    @Size(max = 20)
    private String suffix;

    @NotNull
    private PractitionerType practitionerType;

    private boolean autoAssignPcp;

    private LocalDate firstActiveDate;

    private String gender;

    private LocalDate dateOfBirth;
}
