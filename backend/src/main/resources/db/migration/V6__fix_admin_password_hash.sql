-- ===================================================================
-- Milestone 2 fix: the bcrypt hash seeded for the default 'admin' user
-- in V2__auth_and_practitioner_sub_entities.sql (line 32) does not
-- actually correspond to the documented default password
-- (frontend/AUTH.md), causing every login attempt to fail with
-- "bad credential" even with the correct password. Re-encode it here
-- with a hash that matches the documented default password.
-- CHANGE IMMEDIATELY in production.
-- ===================================================================
UPDATE app_user
SET password_hash = '$2a$10$H6W.xRoHyBM060FoIzy8cOBnKxrmuuuV6iyjgjID.1907Hq7nrz0m',
    updated_at = NOW()
WHERE username = 'admin';
