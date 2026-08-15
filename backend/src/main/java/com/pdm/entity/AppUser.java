package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

/**
 * PDM system user. Completely separate from Practitioner — a Practitioner is a healthcare
 * provider whose data PDM manages; an AppUser is a Veersa/payer employee who OPERATES PDM.
 * They are different people, different tables, different purposes.
 */
@Getter @Setter
@Entity
@Table(name = "app_user",
       uniqueConstraints = @UniqueConstraint(name = "uq_app_user_username", columnNames = "username"))
public class AppUser extends BaseEntity {

    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "app_user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Set<UserRole> roles = new HashSet<>();
}
