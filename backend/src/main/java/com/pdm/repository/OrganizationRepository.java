package com.pdm.repository;

import com.pdm.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {

    Optional<Organization> findByTaxId(String taxId);

    boolean existsByTaxId(String taxId);

    boolean existsByNpi(String npi);
}
