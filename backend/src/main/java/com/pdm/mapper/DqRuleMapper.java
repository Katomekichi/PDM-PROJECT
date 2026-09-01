package com.pdm.mapper;

import com.pdm.dto.request.DqRuleRequest;
import com.pdm.dto.response.DqRuleResponse;
import com.pdm.entity.DqRule;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DqRuleMapper {
    DqRuleResponse toResponse(DqRule entity);

    DqRule toEntity(DqRuleRequest request);

    void updateEntity(DqRuleRequest request, @MappingTarget DqRule entity);
}
