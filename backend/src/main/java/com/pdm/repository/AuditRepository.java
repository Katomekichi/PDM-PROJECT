package com.pdm.repository;

import com.pdm.entity.AuditTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AuditRepository
        extends JpaRepository<AuditTransaction, UUID> {

    List<AuditTransaction> findByParentIdOrderByChangedAtDesc(UUID parentId);

}
