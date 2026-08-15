package com.pdm.repository;

import com.pdm.entity.Practitioner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface PractitionerRepository extends JpaRepository<Practitioner, UUID>,
        JpaSpecificationExecutor<Practitioner> {

    Optional<Practitioner> findByNpi(String npi);

    boolean existsByNpi(String npi);
}
