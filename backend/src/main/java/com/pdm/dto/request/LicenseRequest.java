package com.pdm.dto.request;

import com.pdm.entity.LicenseType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class LicenseRequest {
    @NotNull  private LicenseType licenseType;
    @NotBlank private String licenseNumber;
    private String state;
    private String country;
    private LocalDate issuedDate;
    private LocalDate expiryDate;
    private boolean doNotDisplayInDirectory;
}
