package com.pdm.service;

import com.pdm.dto.request.TicketRequest;
import com.pdm.dto.request.TicketStatusUpdateRequest;
import com.pdm.dto.response.TicketResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TicketService {
    TicketResponse create(TicketRequest request);
    Page<TicketResponse> getAll(Pageable pageable);
    TicketResponse updateStatus(UUID id, TicketStatusUpdateRequest request);
}
