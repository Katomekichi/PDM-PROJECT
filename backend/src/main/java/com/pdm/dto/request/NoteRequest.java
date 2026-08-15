package com.pdm.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class NoteRequest {
    @NotBlank private String content;
}
