package com.pdm.dto.request;

import com.pdm.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter @Setter
public class RegisterUserRequest {
    @NotBlank @Size(min = 3, max = 100) private String username;
    @NotBlank @Size(min = 8)            private String password;
    @NotBlank @Size(max = 200)          private String fullName;
    @NotEmpty                           private Set<UserRole> roles;
}
