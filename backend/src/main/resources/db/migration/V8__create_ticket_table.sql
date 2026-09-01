CREATE TABLE ticket (
    id             UUID PRIMARY KEY,
    entity_type    VARCHAR(30)  NOT NULL,
    status         VARCHAR(20)  NOT NULL,
    provider_name  VARCHAR(200),
    created_at     TIMESTAMPTZ  NOT NULL,
    updated_at     TIMESTAMPTZ  NOT NULL,
    version        BIGINT       NOT NULL DEFAULT 0
);
CREATE INDEX idx_ticket_status ON ticket(status);
