package com.pdm.repository;

import com.pdm.entity.PractitionerLicense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PractitionerLicenseRepository extends JpaRepository<PractitionerLicense, UUID> {
    List<PractitionerLicense> findByPractitionerId(UUID practitionerId);
}
