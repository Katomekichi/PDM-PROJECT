-- Practitioner Address 
CREATE TABLE practitioner_address (
    id              UUID PRIMARY KEY,
    practitioner_id UUID NOT NULL REFERENCES practitioner(id),
    author_username VARCHAR(100) NOT NULL,
    address_line_1         TEXT NOT NULL,
    phone                 VARCHAR(15) NOT NULL,
    city         VARCHAR(30) NOT NULL,
    state        VARCHAR(30) NOT NULL,
    country        VARCHAR(30) NOT NULL,
    pincode        VARCHAR(30) NOT NULL,
    is_primary               BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_address_practitioner ON practitioner_address(practitioner_id);