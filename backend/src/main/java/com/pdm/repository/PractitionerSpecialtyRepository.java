package com.pdm.repository;

import com.pdm.entity.PractitionerSpecialty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PractitionerSpecialtyRepository extends JpaRepository<PractitionerSpecialty, UUID> {
    List<PractitionerSpecialty> findByPractitionerId(UUID practitionerId);
    // List<PractitionerSpecialty> findByPractitionerId(UUID practitionerId, UUID specialtyId);
}
