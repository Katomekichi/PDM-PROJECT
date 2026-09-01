package com.pdm.dto.request;

import com.pdm.entity.DqEntityType;
import com.pdm.entity.DqRuleSeverity;
import com.pdm.entity.DqRuleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DqRuleRequest {

    @NotBlank
    private String ruleName;

    @NotNull
    private DqEntityType entityType;

    @NotBlank
    private String fieldName;

    @NotNull
    private DqRuleType ruleType;

    private String ruleExpression;

    @NotNull
    private DqRuleSeverity severity;

    @NotBlank
    private String errorMessage;

    private String successMessage;

    private Boolean active;
}
