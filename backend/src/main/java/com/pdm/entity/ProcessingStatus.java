package com.pdm.entity;

/** Controls operational holds on a provider. Transcript: "controls claim holds, payment
 *  suspensions, and directory holds." */
public enum ProcessingStatus {
    NONE,
    PAYMENT_HOLD,
    CLAIM_HOLD,
    DIRECTORY_HOLD,
    ALL_HOLDS
}
