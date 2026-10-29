package com.learnrec.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "recommendation_analytics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "metric_date", nullable = false, unique = true)
    private LocalDate metricDate;

    @Column(name = "total_recommendations_served", nullable = false)
    @Builder.Default
    private Integer totalRecommendationsServed = 0;

    @Column(name = "total_clicks", nullable = false)
    @Builder.Default
    private Integer totalClicks = 0;

    @Column(name = "total_likes", nullable = false)
    @Builder.Default
    private Integer totalLikes = 0;

    @Column(name = "total_dislikes", nullable = false)
    @Builder.Default
    private Integer totalDislikes = 0;

    @Column(name = "ctr_percentage", precision = 5, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal ctrPercentage = BigDecimal.ZERO;

    @Column(name = "active_users_count", nullable = false)
    @Builder.Default
    private Integer activeUsersCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "top_category_id")
    private Category topCategory;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
