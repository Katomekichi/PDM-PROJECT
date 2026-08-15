package com.pdm.mapper;

import com.pdm.dto.response.PractitionerRoleResponse;
import com.pdm.entity.PractitionerRole;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PractitionerRoleMapper {

    @Mapping(target = "practitionerId", source = "practitioner.id")
    @Mapping(target = "practitionerName",
            expression = "java(entity.getPractitioner().getFirstName() + \" \" + entity.getPractitioner().getLastName())")
    @Mapping(target = "organizationLocationId", source = "organizationLocation.id")
    @Mapping(target = "organizationLocationName", source = "organizationLocation.locationName")
    PractitionerRoleResponse toResponse(PractitionerRole entity);
}
