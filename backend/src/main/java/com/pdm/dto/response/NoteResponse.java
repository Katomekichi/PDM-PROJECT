package com.pdm.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.time.Instant;
import java.util.UUID;

@Getter @Builder
public class NoteResponse {
    private UUID id;
    private UUID practitionerId;
    private String authorUsername;
    private String content;
    private Instant createdAt;
}
