package com.pdm.dto.response;

import com.pdm.entity.TicketEntityType;
import com.pdm.entity.TicketStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class TicketResponse {
    private UUID id;
    private TicketEntityType entityType;
    private TicketStatus status;
    private String providerName;
    private Instant createdAt;
    private Instant updatedAt;
}
