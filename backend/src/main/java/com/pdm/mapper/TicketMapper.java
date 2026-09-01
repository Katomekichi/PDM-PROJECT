package com.pdm.mapper;

import com.pdm.dto.request.TicketRequest;
import com.pdm.dto.response.TicketResponse;
import com.pdm.entity.Ticket;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketMapper {
    TicketResponse toResponse(Ticket entity);
    Ticket toEntity(TicketRequest request);
}
