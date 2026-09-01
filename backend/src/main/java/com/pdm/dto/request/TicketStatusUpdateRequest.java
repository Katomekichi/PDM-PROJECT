package com.pdm.dto.request;

import com.pdm.entity.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketStatusUpdateRequest {

    @NotNull
    private TicketStatus status;

    private String providerName;
}
