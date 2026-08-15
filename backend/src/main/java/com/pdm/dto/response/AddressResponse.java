package com.pdm.dto.response;

import lombok.Builder;
import java.time.Instant;
import lombok.Getter;
import java.util.UUID;

@Getter @Builder
public class AddressResponse {
    private UUID id;
    private UUID practitionerId;
    private String addressLine1;
    private String phone;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private boolean primary;
    private Instant createdAt;
}
