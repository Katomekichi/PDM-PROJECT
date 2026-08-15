package com.pdm.service.impl;

import com.pdm.dto.request.LoginRequest;
import com.pdm.dto.request.RegisterUserRequest;
import com.pdm.dto.response.AuthResponse;
import com.pdm.entity.AppUser;
import com.pdm.exception.DuplicateResourceException;
import com.pdm.repository.AppUserRepository;
import com.pdm.security.JwtService;
import com.pdm.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse login(LoginRequest request) {
        // authenticate() will throw if credentials are wrong — Spring Security handles it.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        AppUser user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        String token = jwtService.generateToken(
                buildUserDetails(user),
                Map.of("roles", user.getRoles()));

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .roles(user.getRoles())
                .build();
    }

    @Override
    public AuthResponse register(RegisterUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already taken: " + request.getUsername());
        }
        AppUser user = new AppUser();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRoles(request.getRoles());
        userRepository.save(user);

        String token = jwtService.generateToken(
                buildUserDetails(user),
                Map.of("roles", user.getRoles()));

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .roles(user.getRoles())
                .build();
    }

    /** Converts our AppUser into a Spring Security UserDetails inline — avoids a separate
     *  UserDetailsServiceImpl class for such a simple mapping. */
    private UserDetails buildUserDetails(AppUser user) {
        var authorities = user.getRoles().stream()
                .map(r -> (org.springframework.security.core.GrantedAuthority)
                        () -> "ROLE_" + r.name())
                .toList();
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .build();
    }
}
