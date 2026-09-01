package com.pdm.dto.response;

import com.pdm.entity.DqEntityType;
import com.pdm.entity.DqRuleSeverity;
import com.pdm.entity.DqRuleType;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class DqRuleResponse {
    private UUID id;
    private String ruleName;
    private DqEntityType entityType;
    private String fieldName;
    private DqRuleType ruleType;
    private String ruleExpression;
    private DqRuleSeverity severity;
    private String errorMessage;
    private String successMessage;
    private boolean active;
    private Instant createdAt;
    private Instant updatedAt;
}
