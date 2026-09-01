package com.pdm.service.impl;

import com.pdm.dto.request.TicketRequest;
import com.pdm.dto.request.TicketStatusUpdateRequest;
import com.pdm.dto.response.TicketResponse;
import com.pdm.entity.Ticket;
import com.pdm.entity.TicketStatus;
import com.pdm.exception.ResourceNotFoundException;
import com.pdm.mapper.TicketMapper;
import com.pdm.repository.TicketRepository;
import com.pdm.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    @Override
    public TicketResponse create(TicketRequest request) {
        Ticket entity = ticketMapper.toEntity(request);
        entity.setStatus(TicketStatus.ACTIVE);
        return ticketMapper.toResponse(ticketRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponse> getAll(Pageable pageable) {
        return ticketRepository.findAll(pageable).map(ticketMapper::toResponse);
    }

    @Override
    public TicketResponse updateStatus(UUID id, TicketStatusUpdateRequest request) {
        Ticket entity = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id));
        entity.setStatus(request.getStatus());
        if (request.getProviderName() != null) {
            entity.setProviderName(request.getProviderName());
        }
        return ticketMapper.toResponse(ticketRepository.save(entity));
    }
}
