package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * "Any non-individual provider" - hospitals, clinics, pharmacies. (Session 1, Section 5.2)
 * NOTE: an insurance company is explicitly NOT an Organization in this model - insurance
 * companies are payers/consumers of PDM data, not a provider entity type. We enforce that
 * distinction simply by not having an "INSURER" value in OrganizationType.
 */
@Getter
@Setter
@Entity
@Table(name = "organization", uniqueConstraints = {
        @UniqueConstraint(name = "uq_organization_tax_id", columnNames = "tax_id"),
        @UniqueConstraint(name = "uq_organization_npi", columnNames = "npi")
})
public class Organization extends BaseEntity {

    @Column(name = "legal_name", nullable = false, length = 200)
    private String legalName;

    @Enumerated(EnumType.STRING)
    @Column(name = "organization_type", nullable = false)
    private OrganizationType organizationType;

    /** Organization NPI - Type 2. */
    @Column(name = "npi", nullable = false, length = 10)
    private String npi;

    @Enumerated(EnumType.STRING)
    @Column(name = "npi_type", nullable = false)
    private NpiType npiType = NpiType.TYPE_2_ORGANIZATION;

    /**
     * Business rule from the transcript: "every organization, tax ID will be unique."
     * Modeled here as a plain unique column for Milestone 1. A dedicated TaxEntity table
     * (the "legal entity affiliated with IRS reporting" from the transcript) is a Milestone 2
     * addition once Organization<->TaxEntity's own lifecycle needs to be tracked separately.
     */
    @Column(name = "tax_id", nullable = false, length = 20)
    private String taxId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EntityStatus status = EntityStatus.ACTIVE;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrganizationLocation> locations = new ArrayList<>();
}
