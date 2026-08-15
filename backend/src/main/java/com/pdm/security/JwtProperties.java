package com.pdm.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter @Setter
@Component
@ConfigurationProperties(prefix = "pdm.jwt")
public class JwtProperties {
    /** Base64-encoded 256-bit secret — injected from env var in real deployments, never hard-coded. */
    private String secret = "change-me-in-production-use-a-real-256-bit-secret-via-env";
    /** Token expiry in milliseconds (default: 8 hours) */
    private long expirationMs = 28_800_000L;
}
