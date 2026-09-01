package com.pdm.service.impl;

import com.pdm.dto.request.DqRuleRequest;
import com.pdm.dto.response.DqRuleResponse;
import com.pdm.entity.DqEntityType;
import com.pdm.entity.DqRule;
import com.pdm.exception.ResourceNotFoundException;
import com.pdm.mapper.DqRuleMapper;
import com.pdm.repository.DqRuleRepository;
import com.pdm.service.DqRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DqRuleServiceImpl implements DqRuleService {

    private final DqRuleRepository dqRuleRepository;
    private final DqRuleMapper dqRuleMapper;

    @Override
    public DqRuleResponse create(DqRuleRequest request) {
        DqRule entity = dqRuleMapper.toEntity(request);
        entity.setActive(request.getActive() == null || request.getActive());
        return dqRuleMapper.toResponse(dqRuleRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DqRuleResponse> getAll(DqEntityType entityType, Pageable pageable) {
        Page<DqRule> page = entityType != null
                ? dqRuleRepository.findByEntityType(entityType, pageable)
                : dqRuleRepository.findAll(pageable);
        return page.map(dqRuleMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public DqRuleResponse getById(UUID id) {
        return dqRuleMapper.toResponse(findOrThrow(id));
    }

    @Override
    public DqRuleResponse update(UUID id, DqRuleRequest request) {
        DqRule entity = findOrThrow(id);
        dqRuleMapper.updateEntity(request, entity);
        if (request.getActive() != null) {
            entity.setActive(request.getActive());
        }
        return dqRuleMapper.toResponse(dqRuleRepository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        dqRuleRepository.delete(findOrThrow(id));
    }

    private DqRule findOrThrow(UUID id) {
        return dqRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DQ Rule not found: " + id));
    }
}
