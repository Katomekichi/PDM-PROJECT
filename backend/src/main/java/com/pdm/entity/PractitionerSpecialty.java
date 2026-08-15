package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * From the transcript Section 6.6: "Taxonomy defines provider specialty — e.g. cardiologist's
 * taxonomy is cardiology. HSD code is a standard 3-digit CMS-defined code identifying the
 * specialty services. Specialty Source is where this information came from (CAQH, RP system,
 * legacy). Primary checkbox marks the practitioner's primary specialty."
 * Modelled as a child table (one practitioner can have multiple specialties).
 */
@Getter @Setter
@Entity
@Table(name = "practitioner_specialty")
public class PractitionerSpecialty extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "practitioner_id", nullable = false)
    private Practitioner practitioner;

    /** e.g. "Cardiology", "Clinical Neuropsychology" */
    @Column(name = "taxonomy_code", nullable = false, length = 100)
    private String taxonomyCode;

    @Column(name = "taxonomy_description", length = 200)
    private String taxonomyDescription;

    /** CMS-defined 3-digit Healthcare Service Delivery code */
    @Column(name = "hsd_code", length = 10)
    private String hsdCode;

    /** Where this specialty data was sourced from — e.g. "CAQH", "LEGACY_PDM", "MANUAL" */
    @Column(name = "specialty_source", length = 100)
    private String specialtySource;

    /** True if this is the practitioner's primary/main specialty */
    @Column(name = "is_primary", nullable = false)
    private boolean primary = false;

    /** e.g. "Anxiety Disorder", "Sleep Disorder" — the practitioner's clinical focus */
    @Column(name = "clinical_interest", length = 300)
    private String clinicalInterest;

    /** Board certification body, state, country */
    @Column(name = "board_certification_body", length = 200)
    private String boardCertificationBody;

    @Column(name = "certification_state", length = 50)
    private String certificationState;

    @Column(name = "certification_country", length = 50)
    private String certificationCountry;
}
