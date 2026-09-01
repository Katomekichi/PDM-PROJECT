package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "dq_rule")
public class DqRule extends BaseEntity {

    @Column(name = "rule_name", nullable = false, length = 200)
    private String ruleName;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false)
    private DqEntityType entityType;

    @Column(name = "field_name", nullable = false, length = 100)
    private String fieldName;

    @Enumerated(EnumType.STRING)
    @Column(name = "rule_type", nullable = false)
    private DqRuleType ruleType;

    @Column(name = "rule_expression", columnDefinition = "TEXT")
    private String ruleExpression;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false)
    private DqRuleSeverity severity = DqRuleSeverity.ERROR;

    @Column(name = "error_message", nullable = false, length = 500)
    private String errorMessage;

    @Column(name = "success_message", length = 500)
    private String successMessage;

    @Column(name = "active", nullable = false)
    private boolean active = true;
}
