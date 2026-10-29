package com.learnrec.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryResponse {
    private long totalUsers;
    private long totalContent;
    private long totalInteractions;
    private int todayRecommendations;
    private BigDecimal todayCtrPercentage;
    private List<DailyMetricDto> recentMetrics;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyMetricDto {
        private String date;
        private int recommendationsServed;
        private int clicks;
        private int likes;
        private int dislikes;
        private BigDecimal ctrPercentage;
        private int activeUsers;
    }
}
