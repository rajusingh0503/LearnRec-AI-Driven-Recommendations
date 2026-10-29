package com.learnrec.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePreferencesRequest {
    private List<String> preferredCategories;
    private List<String> preferredContentTypes;
    @NotBlank(message = "Preferred difficulty is required")
    private String preferredDifficulty;
}
