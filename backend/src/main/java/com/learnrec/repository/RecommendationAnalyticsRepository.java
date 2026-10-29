package com.learnrec.repository;

import com.learnrec.entity.RecommendationAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendationAnalyticsRepository extends JpaRepository<RecommendationAnalytics, Long> {
    Optional<RecommendationAnalytics> findByMetricDate(LocalDate metricDate);
    List<RecommendationAnalytics> findTop30ByOrderByMetricDateDesc();
}
