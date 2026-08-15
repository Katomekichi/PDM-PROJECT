package com.pdm.service.impl;

import com.pdm.entity.AppUser;
import com.pdm.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Loaded by the JwtAuthFilter on every request to re-hydrate the user from the DB.
 * Deliberately kept thin — no business logic here.
 */
@Service
@RequiredArgsConstructor
public class PdmUserDetailsService implements UserDetailsService {

    private final AppUserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        var authorities = user.getRoles().stream()
                .map(r -> (org.springframework.security.core.GrantedAuthority) () -> "ROLE_" + r.name())
                .toList();

        return User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .disabled(!user.isEnabled())
                .build();
    }
}
