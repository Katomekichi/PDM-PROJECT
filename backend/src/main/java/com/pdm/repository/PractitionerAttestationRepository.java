package com.pdm.repository;

import com.pdm.entity.PractitionerAttestation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface PractitionerAttestationRepository extends JpaRepository<PractitionerAttestation, UUID> {
    List<PractitionerAttestation> findByPractitionerId(UUID practitionerId);

    /**
     * CMS rule: every 90 days. This query finds overdue attestations — used by the
     * reporting dashboard and scheduler jobs.
     */
    @Query("SELECT a FROM PractitionerAttestation a WHERE a.nextAttestationDue < :today")
    List<PractitionerAttestation> findOverdue(LocalDate today);
}
