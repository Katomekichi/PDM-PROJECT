package com.pdm.dto.request;

import com.pdm.entity.CredentialingStatus;
import com.pdm.entity.CredentialingType;
import com.pdm.entity.ProcessingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class CredentialingRequest {
    @NotNull private CredentialingType credentialingType;
    @NotNull private CredentialingStatus credentialingStatus;
    private String credentialSource;
    private String sourceAssociateName;
    private String state;
    private LocalDate dateSentToEntity;
    private LocalDate effectiveDate;
    private LocalDate expiryDate;
    private String disciplinaryActionReason;
    private String processingActionNote;
    private ProcessingStatus processingStatus;
}
