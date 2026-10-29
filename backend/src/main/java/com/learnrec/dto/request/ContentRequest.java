package com.learnrec.dto.request;

import com.learnrec.enums.ContentType;
import com.learnrec.enums.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Content type is required")
    private ContentType contentType;

    @NotNull(message = "Difficulty level is required")
    private DifficultyLevel difficultyLevel;

    @NotBlank(message = "URL is required")
    private String url;

    @NotBlank(message = "Author or instructor is required")
    private String authorOrInstructor;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Set<String> tags;
}
