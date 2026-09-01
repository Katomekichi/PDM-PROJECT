package com.pdm.service;

import com.pdm.dto.request.DqRuleRequest;
import com.pdm.dto.response.DqRuleResponse;
import com.pdm.entity.DqEntityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface DqRuleService {
    DqRuleResponse create(DqRuleRequest request);
    Page<DqRuleResponse> getAll(DqEntityType entityType, Pageable pageable);
    DqRuleResponse getById(UUID id);
    DqRuleResponse update(UUID id, DqRuleRequest request);
    void delete(UUID id);
}
