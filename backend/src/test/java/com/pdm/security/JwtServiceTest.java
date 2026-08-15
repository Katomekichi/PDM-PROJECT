package com.pdm.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        JwtProperties props = new JwtProperties();
        props.setSecret("test-secret-must-be-at-least-32-chars-long-here");
        props.setExpirationMs(60_000L); // 1 minute for tests
        jwtService = new JwtService(props);
    }

    @Test
    void generatedToken_isValidForSameUser() {
        UserDetails user = User.builder().username("jane").password("pw")
                .authorities(Collections.emptyList()).build();

        String token = jwtService.generateToken(user, Map.of());

        assertTrue(jwtService.isTokenValid(token, user));
        assertEquals("jane", jwtService.extractUsername(token));
    }

    @Test
    void tokenIsInvalidForDifferentUser() {
        UserDetails alice = User.builder().username("alice").password("pw").authorities(Collections.emptyList()).build();
        UserDetails bob   = User.builder().username("bob").password("pw").authorities(Collections.emptyList()).build();

        String aliceToken = jwtService.generateToken(alice, Map.of());

        assertFalse(jwtService.isTokenValid(aliceToken, bob));
    }
}
