package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "practitioner_address")
public class PractitionerAddress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "practitioner_id", nullable = false)
    private Practitioner practitioner;

    @Column(name = "address_line_1", nullable = false)
    private String addressLine1;

    @Column(name = "phone", nullable = false, length = 100)
    private String phone;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "state", length = 50)
    private String state;

    @Column(name = "country", length = 50)
    private String country;

    @Column(name = "pincode", length = 50)
    private String pincode;

    @Column(name = "is_primary")
    private boolean primary = false;
}
