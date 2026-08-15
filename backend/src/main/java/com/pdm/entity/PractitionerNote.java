package com.pdm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * From the transcript Section 6.18: "Free-text collaboration section where multiple PD
 * associates working on the same provider record can communicate and maintain a running log
 * of observations and decisions WITHOUT modifying actual data fields."
 * Key point: notes are NEVER a substitute for structured data — they're a side-channel
 * for associate communication only.
 */
@Getter @Setter
@Entity
@Table(name = "practitioner_note")
public class PractitionerNote extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "practitioner_id", nullable = false)
    private Practitioner practitioner;

    @Column(name = "author_username", nullable = true, length = 100)
    private String authorUsername;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;
}
