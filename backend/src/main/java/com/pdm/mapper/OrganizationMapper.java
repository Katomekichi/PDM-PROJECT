package com.pdm.mapper;

import com.pdm.dto.request.OrganizationRequest;
import com.pdm.dto.response.OrganizationResponse;
import com.pdm.entity.Organization;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface OrganizationMapper {

    OrganizationResponse toResponse(Organization entity);

    Organization toEntity(OrganizationRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(OrganizationRequest request, @MappingTarget Organization entity);
}
