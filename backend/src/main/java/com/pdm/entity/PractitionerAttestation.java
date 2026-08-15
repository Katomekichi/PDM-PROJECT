package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * From the transcript Section 6.17: "Attestation — a CMS-mandated requirement that providers
 * must attest to the accuracy of their information every 90 days. Health plans integrate with
 * third-party vendors to manage this process."
 * Fields: status (attested/not attested), source, requested date, last attestation date (deadline).
 */
@Getter @Setter
@Entity
@Table(name = "practitioner_attestation")
public class PractitionerAttestation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "practitioner_id", nullable = false)
    private Practitioner practitioner;

    @Enumerated(EnumType.STRING)
    @Column(name = "attestation_status", nullable = false)
    private AttestationStatus attestationStatus;

    /** e.g. "CAQH", "MANUAL", "THIRD_PARTY_VENDOR" */
    @Column(name = "attestation_source", length = 100)
    private String attestationSource;

    @Column(name = "requested_date")
    private LocalDate requestedDate;

    /**
     * Business rule: attestation deadline. CMS requires every 90 days. 
     * If today > lastAttestationDate the record is overdue — the UI should flag this.
     */
    @Column(name = "last_attestation_date")
    private LocalDate lastAttestationDate;

    /** Calculated: lastAttestationDate + 90 days. Store it so we can query for
     *  "due within X days" without runtime arithmetic. */
    @Column(name = "next_attestation_due")
    private LocalDate nextAttestationDue;
}
