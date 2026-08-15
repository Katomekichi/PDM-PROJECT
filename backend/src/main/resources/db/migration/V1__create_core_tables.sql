-- Milestone 1 schema: Practitioner, Organization, Organization Location, Practitioner Role
-- Flyway owns this file's history; never edit an already-applied migration - add a new V2__...

CREATE TABLE organization (
    id             UUID PRIMARY KEY,
    legal_name     VARCHAR(200) NOT NULL,
    organization_type VARCHAR(30) NOT NULL,
    npi            VARCHAR(10)  NOT NULL,
    npi_type       VARCHAR(30)  NOT NULL,
    tax_id         VARCHAR(20)  NOT NULL,
    status         VARCHAR(20)  NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL,
    updated_at     TIMESTAMPTZ  NOT NULL,
    version        BIGINT       NOT NULL DEFAULT 0,
    CONSTRAINT uq_organization_tax_id UNIQUE (tax_id),
    CONSTRAINT uq_organization_npi UNIQUE (npi)
);

CREATE TABLE organization_location (
    id               UUID PRIMARY KEY,
    organization_id  UUID NOT NULL REFERENCES organization(id),
    location_name    VARCHAR(200) NOT NULL,
    address_line1    VARCHAR(200) NOT NULL,
    address_line2    VARCHAR(200),
    city             VARCHAR(100) NOT NULL,
    state            VARCHAR(50)  NOT NULL,
    postal_code      VARCHAR(20)  NOT NULL,
    country          VARCHAR(50)  NOT NULL DEFAULT 'USA',
    phone            VARCHAR(30),
    status           VARCHAR(20)  NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL,
    updated_at       TIMESTAMPTZ  NOT NULL,
    version          BIGINT       NOT NULL DEFAULT 0
);
CREATE INDEX idx_org_location_organization_id ON organization_location(organization_id);

CREATE TABLE practitioner (
    id               UUID PRIMARY KEY,
    health_plan_id   VARCHAR(20)  NOT NULL,
    npi              VARCHAR(10)  NOT NULL,
    npi_type         VARCHAR(30)  NOT NULL,
    first_name       VARCHAR(100) NOT NULL,
    middle_name      VARCHAR(100),
    last_name        VARCHAR(100) NOT NULL,
    suffix           VARCHAR(20),
    practitioner_type VARCHAR(30) NOT NULL,
    auto_assign_pcp  BOOLEAN      NOT NULL DEFAULT FALSE,
    status           VARCHAR(20)  NOT NULL,
    first_active_date DATE,
    gender           VARCHAR(20),
    date_of_birth    DATE,
    created_at       TIMESTAMPTZ  NOT NULL,
    updated_at       TIMESTAMPTZ  NOT NULL,
    version          BIGINT       NOT NULL DEFAULT 0,
    CONSTRAINT uq_practitioner_npi UNIQUE (npi),
    CONSTRAINT uq_practitioner_health_plan_id UNIQUE (health_plan_id)
);
CREATE INDEX idx_practitioner_last_name ON practitioner(last_name);

CREATE TABLE practitioner_role (
    id                       UUID PRIMARY KEY,
    practitioner_id          UUID NOT NULL REFERENCES practitioner(id),
    organization_location_id UUID NOT NULL REFERENCES organization_location(id),
    role_specialty           VARCHAR(150) NOT NULL,
    start_date               DATE NOT NULL,
    end_date                 DATE,
    status                   VARCHAR(20) NOT NULL,
    created_at                TIMESTAMPTZ NOT NULL,
    updated_at                TIMESTAMPTZ NOT NULL,
    version                   BIGINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_prac_role_practitioner_id ON practitioner_role(practitioner_id);
CREATE INDEX idx_prac_role_org_location_id ON practitioner_role(organization_location_id);
