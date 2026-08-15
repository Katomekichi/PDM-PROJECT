CREATE TABLE audit_transaction (
    id UUID PRIMARY KEY,

    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,

    parent_type VARCHAR(100),
    parent_id UUID,

    operation VARCHAR(20) NOT NULL,

    section VARCHAR(100),

    data TEXT,

    changed_by VARCHAR(100),

    changed_at TIMESTAMP NOT NULL,

    source VARCHAR(50),

    remarks TEXT
);