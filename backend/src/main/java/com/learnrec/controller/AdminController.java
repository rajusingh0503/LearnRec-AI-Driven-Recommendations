package com.learnrec.controller;

import com.learnrec.dto.common.ApiResponse;
import com.learnrec.dto.request.ContentRequest;
import com.learnrec.dto.request.UpdateSettingRequest;
import com.learnrec.dto.response.AnalyticsSummaryResponse;
import com.learnrec.dto.response.ContentResponse;
import com.learnrec.dto.response.SystemSettingResponse;
import com.learnrec.dto.response.UserProfileResponse;
import com.learnrec.service.AdminService;
import com.learnrec.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ContentService contentService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PostMapping("/content")
    public ResponseEntity<ApiResponse<ContentResponse>> createContent(@Valid @RequestBody ContentRequest request) {
        ContentResponse created = contentService.createContent(request);
        return new ResponseEntity<>(ApiResponse.success("Learning content created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/content/{id}")
    public ResponseEntity<ApiResponse<ContentResponse>> updateContent(
            @PathVariable Long id,
            @Valid @RequestBody ContentRequest request
    ) {
        ContentResponse updated = contentService.updateContent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Learning content updated successfully", updated));
    }

    @DeleteMapping("/content/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContent(@PathVariable Long id) {
        contentService.deleteContent(id);
        return ResponseEntity.ok(ApiResponse.success("Learning content deleted successfully", null));
    }

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<List<SystemSettingResponse>>> getAllSettings() {
        List<SystemSettingResponse> settings = adminService.getAllSettings();
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    @PutMapping("/settings/{key}")
    public ResponseEntity<ApiResponse<SystemSettingResponse>> updateSetting(
            @PathVariable String key,
            @Valid @RequestBody UpdateSettingRequest request
    ) {
        SystemSettingResponse updated = adminService.updateSetting(key, request.getSettingValue());
        return ResponseEntity.ok(ApiResponse.success("System setting updated successfully", updated));
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<ApiResponse<AnalyticsSummaryResponse>> getAnalyticsSummary() {
        AnalyticsSummaryResponse summary = adminService.getAnalyticsSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
