package com.learnrec.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentResponse {
    private Long id;
    private String title;
    private String description;
    private String contentType;
    private String difficultyLevel;
    private String url;
    private String authorOrInstructor;
    private BigDecimal ratingAvg;
    private Integer ratingCount;
    private Long categoryId;
    private String categoryName;
    private Set<String> tags;
    private Boolean isPublished;
    private Instant createdAt;
}
