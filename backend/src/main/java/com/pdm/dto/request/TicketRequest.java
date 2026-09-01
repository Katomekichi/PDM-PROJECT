package com.pdm.dto.request;

import com.pdm.entity.TicketEntityType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketRequest {

    @NotNull
    private TicketEntityType entityType;
}
