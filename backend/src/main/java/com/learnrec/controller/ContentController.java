package com.learnrec.controller;

import com.learnrec.dto.common.ApiResponse;
import com.learnrec.dto.common.PagedResponse;
import com.learnrec.dto.response.CategoryResponse;
import com.learnrec.dto.response.ContentResponse;
import com.learnrec.dto.response.TagResponse;
import com.learnrec.enums.ContentType;
import com.learnrec.enums.DifficultyLevel;
import com.learnrec.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @GetMapping({"", "/public"})
    public ResponseEntity<ApiResponse<PagedResponse<ContentResponse>>> getAllContent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) ContentType contentType,
            @RequestParam(required = false) DifficultyLevel difficultyLevel,
            @RequestParam(required = false) String keyword
    ) {
        PagedResponse<ContentResponse> response = contentService.getAllContent(
                page, size, categoryId, contentType, difficultyLevel, keyword
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping({"/public/{id}", "/{id}"})
    public ResponseEntity<ApiResponse<ContentResponse>> getContentById(@PathVariable Long id) {
        ContentResponse content = contentService.getContentById(id);
        return ResponseEntity.ok(ApiResponse.success(content));
    }

    @GetMapping({"/public/categories", "/categories"})
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> categories = contentService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping({"/public/tags", "/tags"})
    public ResponseEntity<ApiResponse<List<TagResponse>>> getAllTags() {
        List<TagResponse> tags = contentService.getAllTags();
        return ResponseEntity.ok(ApiResponse.success(tags));
    }
}
