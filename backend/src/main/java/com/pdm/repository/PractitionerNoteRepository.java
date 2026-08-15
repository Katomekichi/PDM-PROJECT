package com.pdm.repository;

import com.pdm.entity.PractitionerNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PractitionerNoteRepository extends JpaRepository<PractitionerNote, UUID> {
    List<PractitionerNote> findByPractitionerIdOrderByCreatedAtAsc(UUID practitionerId);
}
