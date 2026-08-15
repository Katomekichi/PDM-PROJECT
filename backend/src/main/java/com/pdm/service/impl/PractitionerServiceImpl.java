package com.pdm.service.impl;

import com.pdm.dto.request.PractitionerRequest;
import com.pdm.dto.response.PractitionerResponse;
import com.pdm.entity.EntityStatus;
import com.pdm.entity.Practitioner;
import com.pdm.exception.DuplicateResourceException;
import com.pdm.exception.ResourceNotFoundException;
import com.pdm.mapper.PractitionerMapper;
import com.pdm.repository.PractitionerRepository;
import com.pdm.service.PractitionerService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PractitionerServiceImpl implements PractitionerService {

    private final PractitionerRepository practitionerRepository;
    private final PractitionerMapper practitionerMapper;

    @Override
    public PractitionerResponse create(PractitionerRequest request) {
        // Business rule: NPI must be unique (Section 7 of the learning guide).
        if (practitionerRepository.existsByNpi(request.getNpi())) {
            throw new DuplicateResourceException("A practitioner with NPI " + request.getNpi() + " already exists");
        }
        Practitioner entity = practitionerMapper.toEntity(request);
        entity.setHealthPlanId(generateHealthPlanId());
        entity.setStatus(EntityStatus.ACTIVE);
        Practitioner saved = practitionerRepository.save(entity);
        return practitionerMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PractitionerResponse getById(UUID id) {
        return practitionerMapper.toResponse(findOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PractitionerResponse> search(String npi, String lastName, Pageable pageable) {
        Specification<Practitioner> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (npi != null && !npi.isBlank()) {
                predicates.add(cb.equal(root.get("npi"), npi));
            }
            if (lastName != null && !lastName.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("lastName")), "%" + lastName.toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return practitionerRepository.findAll(spec, pageable).map(practitionerMapper::toResponse);
    }

    @Override
    public PractitionerResponse update(UUID id, PractitionerRequest request) {
        Practitioner entity = findOrThrow(id);

        // If NPI is being changed, re-check uniqueness against everyone else.
        if (!entity.getNpi().equals(request.getNpi()) && practitionerRepository.existsByNpi(request.getNpi())) {
            throw new DuplicateResourceException("A practitioner with NPI " + request.getNpi() + " already exists");
        }

        practitionerMapper.updateEntityFromRequest(request, entity);
        return practitionerMapper.toResponse(practitionerRepository.save(entity));
    }

    @Override
    public void terminate(UUID id) {
        Practitioner entity = findOrThrow(id);
        entity.setStatus(EntityStatus.TERMINATED);
        practitionerRepository.save(entity);
        // Milestone 3 note: this is exactly where we'll publish a "PractitionerTerminated"
        // Kafka event so downstream consumers (claims, directory) get notified asynchronously
        // instead of PDM having to call each of them synchronously.
    }

    @Override
    public void reinstate(UUID id) {
        Practitioner entity = findOrThrow(id);
        entity.setStatus(EntityStatus.ACTIVE);
        practitionerRepository.save(entity);
    }

    private Practitioner findOrThrow(UUID id) {
        return practitionerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Practitioner not found: " + id));
    }

    /** Simple, readable, unique-enough ID generator for Milestone 1. Swap for a real
     *  sequence/strategy once multi-tenant ID rules are defined. */
    private String generateHealthPlanId() {
    return "PRC" + System.currentTimeMillis() % 1000000000;
}
}
