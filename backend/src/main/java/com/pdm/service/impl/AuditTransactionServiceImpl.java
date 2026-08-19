package com.pdm.service.impl;
import java.time.Instant;
import java.util.UUID;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pdm.dto.response.AuditTransactionResponse;
import com.pdm.entity.AuditTransaction;
import com.pdm.repository.AuditRepository;
import com.pdm.service.AuditTransactionService;
import lombok.*;

@Service
@RequiredArgsConstructor
public class AuditTransactionServiceImpl implements AuditTransactionService {

    private final AuditRepository repository;
    private final ObjectMapper objectMapper;

    @Override
    public void createAudit(
            String entityType,
            UUID entityId,
            UUID parentId,
            String operation,
            Object oldValue,
            Object newValue) {

        AuditTransaction audit = new AuditTransaction();

        audit.setId(UUID.randomUUID());
        audit.setEntityType(entityType);
        audit.setEntityId(entityId);
        audit.setParentId(parentId);
        audit.setOperation(operation);

        try {
            audit.setOldData(oldValue != null ? objectMapper.writeValueAsString(oldValue) : null);
            audit.setNewData(newValue != null ? objectMapper.writeValueAsString(newValue) : null);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Unable to serialize audit data", e);
        }

        audit.setChangedAt(Instant.now());
        audit.setChangedBy("ANKIT");

        repository.save(audit);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditTransactionResponse> getTransactions(UUID practitionerId) {

        return repository.findByParentIdOrderByChangedAtDesc(practitionerId)
                .stream()
                .map(this::toAuditResponse)
                .toList();
    }

    // helper function
    private AuditTransactionResponse toAuditResponse(AuditTransaction audit) {

        return AuditTransactionResponse.builder()
        .id(audit.getId()).
        entityType(audit.getEntityType()).
        entityId(audit.getEntityId()).
        operation(audit.getOperation()).
        changedBy(audit.getChangedBy()).
        changedAt(audit.getChangedAt()).
        data(audit.getData()).
        oldData(audit.getOldData()).
        newData(audit.getNewData()).build();
    }
}
