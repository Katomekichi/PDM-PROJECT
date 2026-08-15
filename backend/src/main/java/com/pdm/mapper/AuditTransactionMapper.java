package com.pdm.mapper;

import com.pdm.dto.response.AuditTransactionResponse;
import com.pdm.entity.AuditTransaction;
import org.mapstruct.Mapper;

// @Mapper(componentModel = "spring")
public interface AuditTransactionMapper {
    // default AuditTransactionResponse toAuditResponse(AuditTransaction audit) {

    //     AuditTransactionResponse response = new AuditTransactionResponse();

    //     response.setId(audit.getId());
    //     response.setEntityType(audit.getEntityType());
    //     response.setEntityId(audit.getEntityId());
    //     response.setOperation(audit.getOperation());
    //     response.setChangedBy(audit.getChangedBy());
    //     response.setChangedAt(audit.getChangedAt());
    //     response.setData(audit.getData());

    //     return response;
    // }
}
