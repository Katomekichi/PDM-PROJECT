package com.pdm.repository;

import com.pdm.entity.DqEntityType;
import com.pdm.entity.DqRule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DqRuleRepository extends JpaRepository<DqRule, UUID> {
    Page<DqRule> findByEntityType(DqEntityType entityType, Pageable pageable);

    Optional<DqRule> findByEntityTypeAndFieldNameIgnoreCaseAndActiveTrue(DqEntityType entityType, String fieldName);
}
