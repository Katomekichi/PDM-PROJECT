package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * "A physical address where healthcare services are actually rendered... a child of a
 * parent organization." Example from the transcript: AIIMS is the Organization, AIIMS Delhi
 * is the Organization Location. (Session 1, Section 5.3)
 */
@Getter
@Setter
@Entity
@Table(name = "organization_location")
public class OrganizationLocation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(name = "location_name", nullable = false, length = 200)
    private String locationName;

    @Column(name = "address_line1", nullable = false, length = 200)
    private String addressLine1;

    @Column(name = "address_line2", length = 200)
    private String addressLine2;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "state", nullable = false, length = 50)
    private String state;

    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;

    @Column(name = "country", nullable = false, length = 50)
    private String country = "USA";

    @Column(name = "phone", length = 30)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EntityStatus status = EntityStatus.ACTIVE;

    @OneToMany(mappedBy = "organizationLocation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PractitionerRole> practitionerRoles = new ArrayList<>();
}
