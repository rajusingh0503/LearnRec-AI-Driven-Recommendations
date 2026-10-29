package com.learnrec.service;

import com.learnrec.dto.common.PagedResponse;
import com.learnrec.dto.request.ContentRequest;
import com.learnrec.dto.response.CategoryResponse;
import com.learnrec.dto.response.ContentResponse;
import com.learnrec.dto.response.TagResponse;
import com.learnrec.enums.ContentType;
import com.learnrec.enums.DifficultyLevel;

import java.util.List;

public interface ContentService {
    PagedResponse<ContentResponse> getAllContent(int page, int size, Long categoryId, ContentType contentType, DifficultyLevel difficultyLevel, String keyword);
    ContentResponse getContentById(Long id);
    List<CategoryResponse> getAllCategories();
    List<TagResponse> getAllTags();
    ContentResponse createContent(ContentRequest request);
    ContentResponse updateContent(Long id, ContentRequest request);
    void deleteContent(Long id);
}
