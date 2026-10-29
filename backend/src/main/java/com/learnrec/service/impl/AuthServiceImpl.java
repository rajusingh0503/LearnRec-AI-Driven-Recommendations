package com.learnrec.service.impl;

import com.learnrec.dto.request.LoginRequest;
import com.learnrec.dto.request.RefreshTokenRequest;
import com.learnrec.dto.request.RegisterRequest;
import com.learnrec.dto.response.JwtResponse;
import com.learnrec.dto.response.UserPreferenceResponse;
import com.learnrec.dto.response.UserProfileResponse;
import com.learnrec.entity.Role;
import com.learnrec.entity.User;
import com.learnrec.entity.UserPreference;
import com.learnrec.exception.BadRequestException;
import com.learnrec.exception.DuplicateResourceException;
import com.learnrec.exception.ResourceNotFoundException;
import com.learnrec.exception.UnauthorizedException;
import com.learnrec.repository.RoleRepository;
import com.learnrec.repository.UserRepository;
import com.learnrec.security.JwtTokenProvider;
import com.learnrec.security.UserDetailsImpl;
import com.learnrec.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional(readOnly = true)
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return JwtResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .id(userPrincipal.getId())
                .email(userPrincipal.getUsername())
                .fullName(userPrincipal.getFullName())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public UserProfileResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account is already registered with email: " + request.getEmail());
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new ResourceNotFoundException("Default role ROLE_USER not found"));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .isActive(true)
                .roles(Set.of(userRole))
                .build();

        UserPreference preference = UserPreference.builder()
                .user(user)
                .preferredCategories(request.getPreferredCategories() != null ? request.getPreferredCategories() : new ArrayList<>())
                .preferredContentTypes(request.getPreferredContentTypes() != null ? request.getPreferredContentTypes() : new ArrayList<>())
                .preferredDifficulty(request.getPreferredDifficulty() != null ? request.getPreferredDifficulty() : "BEGINNER")
                .build();

        user.setPreference(preference);
        User savedUser = userRepository.save(user);

        return mapToProfileResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public JwtResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!tokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        String tokenType = tokenProvider.getTokenType(refreshToken);
        if (!"REFRESH".equalsIgnoreCase(tokenType)) {
            throw new BadRequestException("Token is not a valid refresh token");
        }

        String email = tokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for refresh token"));

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String newAccessToken = tokenProvider.generateAccessTokenFromEmail(user.getEmail(), user.getId(), roles);

        return JwtResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // Retain existing valid refresh token
                .tokenType("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return mapToProfileResponse(user);
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        UserPreferenceResponse prefDto = null;
        if (user.getPreference() != null) {
            prefDto = UserPreferenceResponse.builder()
                    .id(user.getPreference().getId())
                    .preferredCategories(user.getPreference().getPreferredCategories())
                    .preferredContentTypes(user.getPreference().getPreferredContentTypes())
                    .preferredDifficulty(user.getPreference().getPreferredDifficulty())
                    .build();
        }

        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .isActive(user.getIsActive())
                .roles(roles)
                .preference(prefDto)
                .build();
    }
}
