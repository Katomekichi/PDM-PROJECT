package com.pdm.controller;

import com.pdm.dto.request.DqRuleRequest;
import com.pdm.dto.response.DqRuleResponse;
import com.pdm.entity.DqEntityType;
import com.pdm.service.DqRuleService;
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
@RequestMapping("/api/v1/dq-rules")
@RequiredArgsConstructor
public class DqRuleController {

    private final DqRuleService dqRuleService;

    @PostMapping
    public ResponseEntity<DqRuleResponse> create(@Valid @RequestBody DqRuleRequest request) {
        DqRuleResponse created = dqRuleService.create(request);
        return ResponseEntity.created(URI.create("/api/v1/dq-rules/" + created.getId())).body(created);
    }

    @GetMapping
    public Page<DqRuleResponse> getAll(
            @RequestParam(required = false) DqEntityType entityType,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return dqRuleService.getAll(entityType, pageable);
    }

    @GetMapping("/{id}")
    public DqRuleResponse getById(@PathVariable UUID id) {
        return dqRuleService.getById(id);
    }

    @PutMapping("/{id}")
    public DqRuleResponse update(@PathVariable UUID id, @Valid @RequestBody DqRuleRequest request) {
        return dqRuleService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        dqRuleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
