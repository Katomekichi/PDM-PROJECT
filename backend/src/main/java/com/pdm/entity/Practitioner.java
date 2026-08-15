package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Core individual provider entity. Milestone 2 expands this with proper child collections
 * for Specialty, License, Credentialing, Attestation, and Notes — each modelled as a
 * child table, not columns bolted onto this one, matching how the real PDM system treats
 * these as separate tabs/sections with their own lifecycle.
 */
@Getter @Setter
@Entity
@Table(name = "practitioner", uniqueConstraints = {
        @UniqueConstraint(name = "uq_practitioner_npi", columnNames = "npi"),
        @UniqueConstraint(name = "uq_practitioner_health_plan_id", columnNames = "health_plan_id")
})
public class Practitioner extends BaseEntity {

    @Column(name = "health_plan_id", nullable = false, length = 50)
    private String healthPlanId;

    @Column(name = "npi", nullable = false, length = 20)
    private String npi;

    @Enumerated(EnumType.STRING)
    @Column(name = "npi_type", nullable = false)
    private NpiType npiType = NpiType.TYPE_1_INDIVIDUAL;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "middle_name", length = 100)
    private String middleName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "suffix", length = 20)
    private String suffix;

    @Enumerated(EnumType.STRING)
    @Column(name = "practitioner_type", nullable = false)
    private PractitionerType practitionerType;

    @Column(name = "auto_assign_pcp", nullable = false)
    private boolean autoAssignPcp = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EntityStatus status = EntityStatus.ACTIVE;

    @Column(name = "first_active_date")
    private LocalDate firstActiveDate;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    // ── Milestone 1 children ──
    @OneToMany(mappedBy = "practitioner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PractitionerRole> practitionerRoles = new ArrayList<>();

    // ── Milestone 2 children ──
    @OneToMany(mappedBy = "practitioner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PractitionerSpecialty> specialties = new ArrayList<>();

    @OneToMany(mappedBy = "practitioner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PractitionerLicense> licenses = new ArrayList<>();

    @OneToMany(mappedBy = "practitioner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PractitionerCredentialing> credentialings = new ArrayList<>();

    @OneToMany(mappedBy = "practitioner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PractitionerAttestation> attestations = new ArrayList<>();

    @OneToMany(mappedBy = "practitioner", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<PractitionerNote> notes = new ArrayList<>();

    @OneToMany(mappedBy = "practitioner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PractitionerAddress> addresses = new ArrayList<>();
}
