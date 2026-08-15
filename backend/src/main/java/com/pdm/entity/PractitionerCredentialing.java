package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * From the transcript Sections 6.16: "Credentialing — the process of verifying provider
 * information to ensure they can deliver quality healthcare. In the US it is done every 3 years.
 * Credentialing Type: third-party vs initial vs delegated.
 * Credentialing Status: approved, in-progress, etc.
 * Credential Source: which system performed it — CAQH, DEA, American Special Health.
 * Source Associate Name: which person handled it.
 * Processing Action Status: controls claim holds, payment suspensions, directory holds."
 */
@Getter @Setter
@Entity
@Table(name = "practitioner_credentialing")
public class PractitionerCredentialing extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "practitioner_id", nullable = false)
    private Practitioner practitioner;

    @Enumerated(EnumType.STRING)
    @Column(name = "credentialing_type", nullable = false)
    private CredentialingType credentialingType;

    @Enumerated(EnumType.STRING)
    @Column(name = "credentialing_status", nullable = false)
    private CredentialingStatus credentialingStatus;

    /** e.g. "CAQH", "DEA", "AMERICAN_SPECIAL_HEALTH", "MANUAL" */
    @Column(name = "credential_source", length = 100)
    private String credentialSource;

    @Column(name = "source_associate_name", length = 200)
    private String sourceAssociateName;

    @Column(name = "state", length = 50)
    private String state;

    /** Date the credentialing was originally requested / first sent to the credentialing entity */
    @Column(name = "date_sent_to_entity")
    private LocalDate dateSentToEntity;

    /** When this credentialing is valid FROM */
    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    /**
     * Business rule from transcript: "In the US, credentialing is held every 3 years.
     * This date marks when the next re-credentialing must happen."
     */
    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    /** Disciplinary action reason if any — e.g. CMS preclusion, court order, sanctions */
    @Column(name = "disciplinary_action_reason", length = 300)
    private String disciplinaryActionReason;

    /** Payment held? "stop-payment", "account never active", etc. */
    @Column(name = "processing_action_note", length = 300)
    private String processingActionNote;

    @Enumerated(EnumType.STRING)
    @Column(name = "processing_status")
    private ProcessingStatus processingStatus;
}
