package com.pdm.repository;

import com.pdm.entity.PractitionerCredentialing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface PractitionerCredentialingRepository extends JpaRepository<PractitionerCredentialing, UUID> {
    List<PractitionerCredentialing> findByPractitionerId(UUID practitionerId);

    /**
     * Business rule enforcement query: "US credentialing is held every 3 years."
     * This query supports a scheduler job (Milestone 3) that flags records expiring soon.
     */
    @Query("SELECT c FROM PractitionerCredentialing c WHERE c.expiryDate BETWEEN :today AND :threshold")
    List<PractitionerCredentialing> findExpiringBetween(LocalDate today, LocalDate threshold);
}
