package com.pdm.service;
import java.util.UUID;
import java.util.List;

import com.pdm.dto.response.AuditTransactionResponse;

public interface AuditTransactionService {

    void createAudit(
        String entityType,
        UUID entityId,
        UUID parentId,
        String operation,
        Object data
    );

    List<AuditTransactionResponse> getTransactions(UUID practitionerId);

    // void updateAudit(
    //     String entityType,
    //     UUID entityId,
    //     String operation,
    //     String field,
    //     String oldValue,
    //     String newValue
    // );
}