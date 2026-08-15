package com.pdm.service;

import com.pdm.dto.request.LoginRequest;
import com.pdm.dto.request.RegisterUserRequest;
import com.pdm.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterUserRequest request);
}
