-- ===================================================================
-- Milestone 2: Auth (AppUser) + Practitioner sub-entity tables
-- Never edit a previously-applied migration. This is the authoritative
-- schema change for Milestone 2.
-- ===================================================================

-- ── Auth ─────────────────────────────────────────────────────────────
CREATE TABLE app_user (
    id            UUID PRIMARY KEY,
    username      VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(200) NOT NULL,
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL,
    updated_at    TIMESTAMPTZ  NOT NULL,
    version       BIGINT       NOT NULL DEFAULT 0,
    CONSTRAINT uq_app_user_username UNIQUE (username)
);

CREATE TABLE app_user_roles (
    user_id UUID   NOT NULL REFERENCES app_user(id),
    role    VARCHAR(30) NOT NULL,
    PRIMARY KEY (user_id, role)
);

-- Seed a default admin so the system isn't locked out on first boot.
-- Password: 'Admin@PDM1' (bcrypt hash below).  CHANGE IMMEDIATELY in production.
INSERT INTO app_user (id, username, password_hash, full_name, enabled, created_at, updated_at, version)
VALUES (
    gen_random_uuid(),
    'admin',
    '$2a$10$eLqBl2B7w.RvBBo2p.Gnte3KJqTpFVJovkHGTD0x7MHD7GeyXtxR2',
    'PDM System Admin',
    TRUE,
    NOW(), NOW(), 0
);
INSERT INTO app_user_roles (user_id, role)
SELECT id, 'PD_ADMIN' FROM app_user WHERE username = 'admin';

-- ── Practitioner Specialty ────────────────────────────────────────────
CREATE TABLE practitioner_specialty (
    id                       UUID PRIMARY KEY,
    practitioner_id          UUID NOT NULL REFERENCES practitioner(id),
    taxonomy_code            VARCHAR(100) NOT NULL,
    taxonomy_description     VARCHAR(200),
    hsd_code                 VARCHAR(10),
    specialty_source         VARCHAR(100),
    is_primary               BOOLEAN NOT NULL DEFAULT FALSE,
    clinical_interest        VARCHAR(300),
    board_certification_body VARCHAR(200),
    certification_state      VARCHAR(50),
    certification_country    VARCHAR(50),
    created_at               TIMESTAMPTZ NOT NULL,
    updated_at               TIMESTAMPTZ NOT NULL,
    version                  BIGINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_specialty_practitioner ON practitioner_specialty(practitioner_id);

-- ── Practitioner License ──────────────────────────────────────────────
CREATE TABLE practitioner_license (
    id                         UUID PRIMARY KEY,
    practitioner_id            UUID NOT NULL REFERENCES practitioner(id),
    license_type               VARCHAR(30) NOT NULL,
    license_number             VARCHAR(100) NOT NULL,
    state                      VARCHAR(50),
    country                    VARCHAR(50),
    issued_date                DATE,
    expiry_date                DATE,
    do_not_display_in_directory BOOLEAN NOT NULL DEFAULT FALSE,
    status                     VARCHAR(20) NOT NULL,
    created_at                 TIMESTAMPTZ NOT NULL,
    updated_at                 TIMESTAMPTZ NOT NULL,
    version                    BIGINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_license_practitioner ON practitioner_license(practitioner_id);

-- ── Practitioner Credentialing ────────────────────────────────────────
CREATE TABLE practitioner_credentialing (
    id                       UUID PRIMARY KEY,
    practitioner_id          UUID NOT NULL REFERENCES practitioner(id),
    credentialing_type       VARCHAR(30) NOT NULL,
    credentialing_status     VARCHAR(30) NOT NULL,
    credential_source        VARCHAR(100),
    source_associate_name    VARCHAR(200),
    state                    VARCHAR(50),
    date_sent_to_entity      DATE,
    effective_date           DATE,
    expiry_date              DATE,
    disciplinary_action_reason VARCHAR(300),
    processing_action_note   VARCHAR(300),
    processing_status        VARCHAR(30),
    created_at               TIMESTAMPTZ NOT NULL,
    updated_at               TIMESTAMPTZ NOT NULL,
    version                  BIGINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_cred_practitioner   ON practitioner_credentialing(practitioner_id);
CREATE INDEX idx_cred_expiry         ON practitioner_credentialing(expiry_date);

-- ── Practitioner Attestation ──────────────────────────────────────────
CREATE TABLE practitioner_attestation (
    id                   UUID PRIMARY KEY,
    practitioner_id      UUID NOT NULL REFERENCES practitioner(id),
    attestation_status   VARCHAR(30) NOT NULL,
    attestation_source   VARCHAR(100),
    requested_date       DATE,
    last_attestation_date DATE,
    next_attestation_due  DATE,
    created_at           TIMESTAMPTZ NOT NULL,
    updated_at           TIMESTAMPTZ NOT NULL,
    version              BIGINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_attest_practitioner     ON practitioner_attestation(practitioner_id);
CREATE INDEX idx_attest_next_due         ON practitioner_attestation(next_attestation_due);

-- ── Practitioner Note ─────────────────────────────────────────────────
CREATE TABLE practitioner_note (
    id              UUID PRIMARY KEY,
    practitioner_id UUID NOT NULL REFERENCES practitioner(id),
    author_username VARCHAR(100) NOT NULL,
    content         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL,
    version         BIGINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_note_practitioner ON practitioner_note(practitioner_id);
