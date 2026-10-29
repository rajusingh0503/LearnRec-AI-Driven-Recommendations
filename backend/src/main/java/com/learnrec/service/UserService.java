package com.learnrec.service;

import com.learnrec.dto.request.UpdatePreferencesRequest;
import com.learnrec.dto.response.UserPreferenceResponse;
import com.learnrec.dto.response.UserProfileResponse;

public interface UserService {
    UserProfileResponse getProfile(Long userId);
    UserProfileResponse updateProfile(Long userId, String fullName);
    UserPreferenceResponse getPreferences(Long userId);
    UserPreferenceResponse updatePreferences(Long userId, UpdatePreferencesRequest request);
}
