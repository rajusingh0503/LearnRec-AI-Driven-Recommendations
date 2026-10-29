package com.learnrec.service.impl;

import com.learnrec.dto.request.UpdatePreferencesRequest;
import com.learnrec.dto.response.UserPreferenceResponse;
import com.learnrec.dto.response.UserProfileResponse;
import com.learnrec.entity.Role;
import com.learnrec.entity.User;
import com.learnrec.entity.UserPreference;
import com.learnrec.exception.ResourceNotFoundException;
import com.learnrec.repository.UserPreferenceRepository;
import com.learnrec.repository.UserRepository;
import com.learnrec.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserPreferenceRepository preferenceRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return mapToProfile(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(Long userId, String fullName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setFullName(fullName);
        User updated = userRepository.save(user);

        return mapToProfile(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public UserPreferenceResponse getPreferences(Long userId) {
        UserPreference preference = preferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Preferences not found for user id: " + userId));

        return mapToPreference(preference);
    }

    @Override
    @Transactional
    public UserPreferenceResponse updatePreferences(Long userId, UpdatePreferencesRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserPreference preference = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> UserPreference.builder().user(user).build());

        if (request.getPreferredCategories() != null) {
            preference.setPreferredCategories(request.getPreferredCategories());
        }
        if (request.getPreferredContentTypes() != null) {
            preference.setPreferredContentTypes(request.getPreferredContentTypes());
        }
        if (request.getPreferredDifficulty() != null) {
            preference.setPreferredDifficulty(request.getPreferredDifficulty());
        }

        UserPreference saved = preferenceRepository.save(preference);
        return mapToPreference(saved);
    }

    private UserProfileResponse mapToProfile(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        UserPreferenceResponse prefDto = null;
        if (user.getPreference() != null) {
            prefDto = mapToPreference(user.getPreference());
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

    private UserPreferenceResponse mapToPreference(UserPreference preference) {
        return UserPreferenceResponse.builder()
                .id(preference.getId())
                .preferredCategories(preference.getPreferredCategories() != null ? preference.getPreferredCategories() : new ArrayList<>())
                .preferredContentTypes(preference.getPreferredContentTypes() != null ? preference.getPreferredContentTypes() : new ArrayList<>())
                .preferredDifficulty(preference.getPreferredDifficulty())
                .build();
    }
}
