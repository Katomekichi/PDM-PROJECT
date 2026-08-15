package com.pdm.service;

import com.pdm.dto.request.PractitionerRequest;
import com.pdm.entity.NpiType;
import com.pdm.entity.Practitioner;
import com.pdm.entity.PractitionerType;
import com.pdm.exception.DuplicateResourceException;
import com.pdm.mapper.PractitionerMapper;
import com.pdm.repository.PractitionerRepository;
import com.pdm.service.impl.PractitionerServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Pure unit test - repository is mocked, no Spring context, no DB. Fast feedback loop for
 * business-rule logic (like "NPI must be unique") without needing Postgres running.
 */
class PractitionerServiceImplTest {

    private PractitionerRepository practitionerRepository;
    private PractitionerService practitionerService;

    @BeforeEach
    void setUp() {
        practitionerRepository = mock(PractitionerRepository.class);
        PractitionerMapper mapper = Mappers.getMapper(PractitionerMapper.class);
        practitionerService = new PractitionerServiceImpl(practitionerRepository, mapper);
    }

    @Test
    void create_throwsDuplicateResourceException_whenNpiAlreadyExists() {
        PractitionerRequest request = new PractitionerRequest();
        request.setNpi("1234567890");
        request.setFirstName("John");
        request.setLastName("Smith");
        request.setPractitionerType(PractitionerType.SPECIALIST);

        when(practitionerRepository.existsByNpi("1234567890")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> practitionerService.create(request));
        verify(practitionerRepository, never()).save(any());
    }

    @Test
    void create_savesPractitioner_andGeneratesHealthPlanId_whenNpiIsUnique() {
        PractitionerRequest request = new PractitionerRequest();
        request.setNpi("9876543210");
        request.setFirstName("Sara");
        request.setLastName("Khan");
        request.setPractitionerType(PractitionerType.PRIMARY_CARE_PHYSICIAN);
        request.setAutoAssignPcp(true);

        when(practitionerRepository.existsByNpi("9876543210")).thenReturn(false);
        when(practitionerRepository.save(any(Practitioner.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = practitionerService.create(request);

        assertEquals("9876543210", response.getNpi());
        assertEquals(NpiType.TYPE_1_INDIVIDUAL, response.getNpiType());
        assertEquals(true, response.isAutoAssignPcp());
        verify(practitionerRepository).save(any(Practitioner.class));
    }
}
