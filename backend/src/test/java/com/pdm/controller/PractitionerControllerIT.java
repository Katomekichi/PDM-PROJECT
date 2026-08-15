package com.pdm.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pdm.dto.request.PractitionerRequest;
import com.pdm.entity.PractitionerType;
import com.pdm.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PractitionerControllerIT {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private JwtService jwtService;

    private String adminToken;

    @BeforeEach
    void generateToken() {
        // Build a PD_ADMIN user token for tests — we don't hit the DB, just sign a test token
        var user = User.builder()
                .username("test-admin")
                .password("pw")
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_PD_ADMIN")))
                .build();
        adminToken = jwtService.generateToken(user, Map.of("roles", List.of("PD_ADMIN")));
    }

    @Test
    void createPractitioner_thenFetchById_returnsSameRecord() throws Exception {
        PractitionerRequest request = new PractitionerRequest();
        request.setNpi("2233445566");
        request.setFirstName("John");
        request.setLastName("Smith");
        request.setPractitionerType(PractitionerType.SPECIALIST);

        String response = mockMvc.perform(post("/api/v1/practitioners")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.npi").value("2233445566"))
                .andExpect(jsonPath("$.healthPlanId").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        String id = objectMapper.readTree(response).get("id").asText();

        mockMvc.perform(get("/api/v1/practitioners/" + id)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Smith"));
    }

    @Test
    void createPractitioner_withDuplicateNpi_returns409() throws Exception {
        PractitionerRequest req = new PractitionerRequest();
        req.setNpi("9988776655");
        req.setFirstName("Dup"); req.setLastName("Licate");
        req.setPractitionerType(PractitionerType.SPECIALIST);

        mockMvc.perform(post("/api/v1/practitioners")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/v1/practitioners")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());
    }

    @Test
    void unauthenticatedRequest_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/practitioners"))
                .andExpect(status().isUnauthorized());
    }
}
