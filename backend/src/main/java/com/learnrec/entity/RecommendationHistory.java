package com.learnrec.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "recommendation_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(name = "algorithm_used", length = 50, nullable = false)
    private String algorithmUsed;

    @Column(name = "score", precision = 6, scale = 4, nullable = false)
    private BigDecimal score;

    @CreationTimestamp
    @Column(name = "served_at", nullable = false, updatable = false)
    private Instant servedAt;
}
