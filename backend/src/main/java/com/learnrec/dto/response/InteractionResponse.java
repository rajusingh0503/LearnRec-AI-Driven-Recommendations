package com.learnrec.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InteractionResponse {
    private Long id;
    private Long contentId;
    private String contentTitle;
    private String contentType;
    private String categoryName;
    private String interactionType;
    private Integer ratingValue;
    private Instant createdAt;
}
