package com.learnrec.service;

import com.learnrec.dto.response.AnalyticsSummaryResponse;
import com.learnrec.dto.response.SystemSettingResponse;
import com.learnrec.dto.response.UserProfileResponse;

import java.util.List;

public interface AdminService {
    List<UserProfileResponse> getAllUsers();
    List<SystemSettingResponse> getAllSettings();
    SystemSettingResponse updateSetting(String settingKey, String settingValue);
    AnalyticsSummaryResponse getAnalyticsSummary();
}
