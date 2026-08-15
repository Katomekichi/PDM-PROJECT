package com.pdm.entity;

/**
 * From the PDM transcript: multiple "PD associates" can work the same provider record.
 * In a real payer org the roles are roughly:
 *   PD_ASSOCIATE  — day-to-day data entry & updates
 *   PD_ADMIN      — can terminate, reinstate, approve providers; configure networks
 *   READ_ONLY     — auditors, downstream teams that query but never modify
 */
public enum UserRole {
    PD_ASSOCIATE,
    PD_ADMIN,
    READ_ONLY
}
