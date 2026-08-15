package com.pdm.mapper;

import com.pdm.dto.request.PractitionerRequest;
import com.pdm.dto.response.PractitionerResponse;
import com.pdm.entity.Practitioner;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.BeanMapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PractitionerMapper {

    PractitionerResponse toResponse(Practitioner entity);

    Practitioner toEntity(PractitionerRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(PractitionerRequest request, @MappingTarget Practitioner entity);
}
