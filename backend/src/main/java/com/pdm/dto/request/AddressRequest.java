package com.pdm.dto.request;
import java.time.Instant;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AddressRequest {
    @NotBlank private String addressLine1;
    private String phone;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private boolean primary;
}
