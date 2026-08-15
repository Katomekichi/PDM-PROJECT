package com.pdm.controller;

import com.pdm.dto.request.LoginRequest;
import com.pdm.dto.request.RegisterUserRequest;
import com.pdm.dto.response.AuthResponse;
import com.pdm.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** Open to everyone — this is how you get a token in the first place. */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Only PD_ADMIN can create new PDM users — a PD_ASSOCIATE cannot self-register
     * their own admin account (that would defeat RBAC entirely).
     */
    @PostMapping("/register")
    @PreAuthorize("hasRole('PD_ADMIN')")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterUserRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
}
