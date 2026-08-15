package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * The relationship/join entity that answers "in which org location is this practitioner
 * attached, and as what?" Transcript: "Practitioner Role describes what role a practitioner
 * plays at a specific location for a given health plan's networks... Dr. Sara joins Max
 * Hospital and works there as a cardiologist - that relationship IS a Practitioner Role
 * record." (Session 1, Section 5.4)
 *
 * Business rule: "Practitioner Role requires Practitioner + Organization Location" - both
 * FKs below are non-nullable, enforced at the DB level, not just in application code.
 */
@Getter
@Setter
@Entity
@Table(name = "practitioner_role")
public class PractitionerRole extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "practitioner_id", nullable = false)
    private Practitioner practitioner;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "organization_location_id", nullable = false)
    private OrganizationLocation organizationLocation;

    /** e.g. "Cardiologist" - the taxonomy/specialty this practitioner practices as, at THIS location. */
    @Column(name = "role_specialty", nullable = false, length = 150)
    private String roleSpecialty;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EntityStatus status = EntityStatus.ACTIVE;
}
