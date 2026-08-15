package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * From the transcript Section 6.14: "State license number — the government authorization to
 * practice. DEA number — required when a provider prescribes controlled substances. Not every
 * practitioner can prescribe every drug — some classified/scheduled drugs require this."
 * Also: "Do Not Display in Directory — that record will not be shown in the provider directory."
 */
@Getter @Setter
@Entity
@Table(name = "practitioner_license")
public class PractitionerLicense extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "practitioner_id", nullable = false)
    private Practitioner practitioner;

    @Enumerated(EnumType.STRING)
    @Column(name = "license_type", nullable = false)
    private LicenseType licenseType;

    @Column(name = "license_number", nullable = false, length = 100)
    private String licenseNumber;

    @Column(name = "state", length = 50)
    private String state;

    @Column(name = "country", length = 50)
    private String country;

    @Column(name = "issued_date")
    private LocalDate issuedDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    /**
     * Transcript: "Data marked 'Do Not Display in Directory' will not appear when members
     * search the public-facing Provider Directory. It suppresses from that view specifically —
     * it doesn't delete the underlying record."
     */
    @Column(name = "do_not_display_in_directory", nullable = false)
    private boolean doNotDisplayInDirectory = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EntityStatus status = EntityStatus.ACTIVE;
}
