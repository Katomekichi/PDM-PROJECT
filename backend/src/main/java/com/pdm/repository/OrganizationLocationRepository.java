package com.pdm.repository;

import com.pdm.entity.OrganizationLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrganizationLocationRepository extends JpaRepository<OrganizationLocation, UUID> {

    List<OrganizationLocation> findByOrganizationId(UUID organizationId);
}
