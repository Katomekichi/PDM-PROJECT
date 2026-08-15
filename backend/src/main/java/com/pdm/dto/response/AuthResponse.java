package com.pdm.dto.response;

import com.pdm.entity.UserRole;
import lombok.Builder;
import lombok.Getter;
import java.util.Set;

@Getter @Builder
public class AuthResponse {
    private String token;
    private String username;
    private String fullName;
    private Set<UserRole> roles;
}
