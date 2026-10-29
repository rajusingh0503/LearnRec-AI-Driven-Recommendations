package com.learnrec.service.impl;

import com.learnrec.dto.response.AnalyticsSummaryResponse;
import com.learnrec.dto.response.SystemSettingResponse;
import com.learnrec.dto.response.UserPreferenceResponse;
import com.learnrec.dto.response.UserProfileResponse;
import com.learnrec.entity.RecommendationAnalytics;
import com.learnrec.entity.Role;
import com.learnrec.entity.SystemSetting;
import com.learnrec.entity.User;
import com.learnrec.exception.ResourceNotFoundException;
import com.learnrec.repository.*;
import com.learnrec.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ContentRepository contentRepository;
    private final UserInteractionRepository interactionRepository;
    private final SystemSettingRepository settingRepository;
    private final RecommendationAnalyticsRepository analyticsRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToProfile)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemSettingResponse> getAllSettings() {
        return settingRepository.findAll().stream()
                .map(s -> SystemSettingResponse.builder()
                        .settingKey(s.getSettingKey())
                        .settingValue(s.getSettingValue())
                        .description(s.getDescription())
                        .updatedAt(s.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SystemSettingResponse updateSetting(String settingKey, String settingValue) {
        SystemSetting setting = settingRepository.findBySettingKey(settingKey)
                .orElseThrow(() -> new ResourceNotFoundException("System setting not found with key: " + settingKey));

        setting.setSettingValue(settingValue);
        SystemSetting saved = settingRepository.save(setting);

        return SystemSettingResponse.builder()
                .settingKey(saved.getSettingKey())
                .settingValue(saved.getSettingValue())
                .description(saved.getDescription())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse getAnalyticsSummary() {
        long totalUsers = userRepository.count();
        long totalContent = contentRepository.count();
        long totalInteractions = interactionRepository.count();

        RecommendationAnalytics todayMetric = analyticsRepository.findByMetricDate(LocalDate.now())
                .orElse(null);

        int todayRecs = todayMetric != null ? todayMetric.getTotalRecommendationsServed() : 0;
        BigDecimal todayCtr = todayMetric != null ? todayMetric.getCtrPercentage() : BigDecimal.ZERO;

        List<AnalyticsSummaryResponse.DailyMetricDto> metricsList = analyticsRepository.findTop30ByOrderByMetricDateDesc().stream()
                .map(m -> AnalyticsSummaryResponse.DailyMetricDto.builder()
                        .date(m.getMetricDate().toString())
                        .recommendationsServed(m.getTotalRecommendationsServed())
                        .clicks(m.getTotalClicks())
                        .likes(m.getTotalLikes())
                        .dislikes(m.getTotalDislikes())
                        .ctrPercentage(m.getCtrPercentage())
                        .activeUsers(m.getActiveUsersCount())
                        .build())
                .collect(Collectors.toList());

        return AnalyticsSummaryResponse.builder()
                .totalUsers(totalUsers)
                .totalContent(totalContent)
                .totalInteractions(totalInteractions)
                .todayRecommendations(todayRecs)
                .todayCtrPercentage(todayCtr)
                .recentMetrics(metricsList)
                .build();
    }

    private UserProfileResponse mapToProfile(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        UserPreferenceResponse prefDto = null;
        if (user.getPreference() != null) {
            prefDto = UserPreferenceResponse.builder()
                    .id(user.getPreference().getId())
                    .preferredCategories(user.getPreference().getPreferredCategories() != null ? user.getPreference().getPreferredCategories() : new ArrayList<>())
                    .preferredContentTypes(user.getPreference().getPreferredContentTypes() != null ? user.getPreference().getPreferredContentTypes() : new ArrayList<>())
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
