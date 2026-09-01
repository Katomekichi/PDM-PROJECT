CREATE TABLE dq_rule (
    id               UUID PRIMARY KEY,
    rule_name        VARCHAR(200) NOT NULL,
    entity_type      VARCHAR(30)  NOT NULL,
    field_name       VARCHAR(100) NOT NULL,
    rule_type        VARCHAR(20)  NOT NULL,
    rule_expression  TEXT,
    severity         VARCHAR(20)  NOT NULL DEFAULT 'ERROR',
    error_message    VARCHAR(500) NOT NULL,
    success_message  VARCHAR(500),
    active           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ  NOT NULL,
    updated_at       TIMESTAMPTZ  NOT NULL,
    version          BIGINT       NOT NULL DEFAULT 0
);
CREATE INDEX idx_dq_rule_entity_type ON dq_rule(entity_type);
CREATE INDEX idx_dq_rule_active ON dq_rule(active);
