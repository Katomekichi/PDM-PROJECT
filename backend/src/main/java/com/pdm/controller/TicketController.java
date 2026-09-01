package com.pdm.controller;

import com.pdm.dto.request.TicketRequest;
import com.pdm.dto.request.TicketStatusUpdateRequest;
import com.pdm.dto.response.TicketResponse;
import com.pdm.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponse> create(@Valid @RequestBody TicketRequest request) {
        TicketResponse created = ticketService.create(request);
        return ResponseEntity.created(URI.create("/api/v1/tickets/" + created.getId())).body(created);
    }

    @GetMapping
    public Page<TicketResponse> getAll(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ticketService.getAll(pageable);
    }

    @PatchMapping("/{id}/status")
    public TicketResponse updateStatus(@PathVariable UUID id, @Valid @RequestBody TicketStatusUpdateRequest request) {
        return ticketService.updateStatus(id, request);
    }
}
