package com.pdm.repository;

import com.pdm.entity.PractitionerAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PractitionerAddressRepository extends JpaRepository<PractitionerAddress, UUID> {
    List<PractitionerAddress> findByPractitionerId(UUID practitionerId);
}
