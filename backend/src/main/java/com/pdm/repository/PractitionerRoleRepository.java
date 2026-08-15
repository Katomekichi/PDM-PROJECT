package com.pdm.repository;

import com.pdm.entity.PractitionerRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PractitionerRoleRepository extends JpaRepository<PractitionerRole, UUID> {

    List<PractitionerRole> findByPractitionerId(UUID practitionerId);

    List<PractitionerRole> findByOrganizationLocationId(UUID organizationLocationId);
}
