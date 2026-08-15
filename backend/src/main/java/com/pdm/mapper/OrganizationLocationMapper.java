package com.pdm.mapper;

import com.pdm.dto.response.OrganizationLocationResponse;
import com.pdm.entity.OrganizationLocation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrganizationLocationMapper {

    @Mapping(target = "organizationId", source = "organization.id")
    @Mapping(target = "organizationName", source = "organization.legalName")
    OrganizationLocationResponse toResponse(OrganizationLocation entity);
}
