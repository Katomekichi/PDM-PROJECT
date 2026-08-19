ALTER TABLE audit_transaction
    ADD COLUMN old_data TEXT,
    ADD COLUMN new_data TEXT;
