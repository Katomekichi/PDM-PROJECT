package com.pdm.dto.response;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import lombok.Builder;

@Getter
@Setter
@Builder
public class AuditTransactionResponse {

    private UUID id;

    private String entityType;

    private UUID entityId;

    private String operation;

    private String changedBy;

    private Instant changedAt;

    private String data;

    private String oldData;

    private String newData;
}