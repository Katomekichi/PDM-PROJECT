package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

/**
 * Every provider entity (Practitioner, Organization, OrganizationLocation, PractitionerRole...)
 * shares these fields. This mirrors the transcript's "Profile" concept that every entity has:
 * a system-generated unique ID, a created/updated audit trail, and a status.
 *
 * We use UUID primary keys (not auto-increment ints) because PDM is multi-tenant and entities
 * get created by many independent processes (imports, manual entry, API calls) - UUIDs avoid
 * collision without needing a central counter, and they don't leak sequential business volume
 * the way an auto-increment ID would.
 */
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /**
     * Optimistic locking: prevents two associates editing the same provider record from
     * silently overwriting each other's changes - the second save fails with a conflict
     * instead of clobbering the first save. This matters a lot for PDM since multiple
     * PD associates can be working the same record (see: Notes section in the transcript).
     */
    @Version
    @Column(name = "version")
    private Long version;
}
