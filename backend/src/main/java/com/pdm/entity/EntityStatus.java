package com.pdm.entity;

/**
 * Shared status enum for provider entities. From the transcript: "whether the practitioner is
 * still active or not... or maybe later on the practitioner may have been terminated."
 * We reuse the same lifecycle for Organization, OrganizationLocation, and PractitionerRole too -
 * they all go through the same active -> terminated (-> reinstated) lifecycle described for
 * Provider Service Manager.
 */
public enum EntityStatus {
    ACTIVE,
    INACTIVE,
    TERMINATED
}
