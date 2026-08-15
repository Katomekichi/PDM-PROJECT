package com.pdm.dto.request;

import com.pdm.entity.AttestationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class AttestationRequest {
    @NotNull private AttestationStatus attestationStatus;
    private String attestationSource;
    private LocalDate requestedDate;
    private LocalDate lastAttestationDate;
}
