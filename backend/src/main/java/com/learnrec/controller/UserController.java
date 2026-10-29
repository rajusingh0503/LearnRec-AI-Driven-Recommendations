package com.learnrec.controller;

import com.learnrec.dto.common.ApiResponse;
import com.learnrec.dto.request.UpdatePreferencesRequest;
import com.learnrec.dto.response.UserPreferenceResponse;
import com.learnrec.dto.response.UserProfileResponse;
import com.learnrec.security.UserDetailsImpl;
import com.learnrec.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        UserProfileResponse profile = userService.getProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal,
            @RequestParam String fullName
    ) {
        UserProfileResponse profile = userService.updateProfile(userPrincipal.getId(), fullName);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<UserPreferenceResponse>> getPreferences(@AuthenticationPrincipal UserDetailsImpl userPrincipal) {
        UserPreferenceResponse preferences = userService.getPreferences(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(preferences));
    }

    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<UserPreferenceResponse>> updatePreferences(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal,
            @Valid @RequestBody UpdatePreferencesRequest request
    ) {
        UserPreferenceResponse preferences = userService.updatePreferences(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Preferences updated successfully", preferences));
    }
}
