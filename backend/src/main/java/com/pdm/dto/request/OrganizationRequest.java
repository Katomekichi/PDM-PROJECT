package com.pdm.dto.request;

import com.pdm.entity.OrganizationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizationRequest {

    @NotBlank
    @Size(max = 200)
    private String legalName;

    @NotNull
    private OrganizationType organizationType;

    @NotBlank
    @Pattern(regexp = "\\d{10}", message = "NPI must be exactly 10 digits")
    private String npi;

    @NotBlank
    @Size(max = 20)
    private String taxId;
}
