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
        Object oldValue,
        Object newValue
    );

    List<AuditTransactionResponse> getTransactions(UUID practitionerId);
}