package com.learnrec.service.impl;

import com.learnrec.dto.common.PagedResponse;
import com.learnrec.dto.request.ContentRequest;
import com.learnrec.dto.response.CategoryResponse;
import com.learnrec.dto.response.ContentResponse;
import com.learnrec.dto.response.TagResponse;
import com.learnrec.entity.Category;
import com.learnrec.entity.Content;
import com.learnrec.entity.Tag;
import com.learnrec.enums.ContentType;
import com.learnrec.enums.DifficultyLevel;
import com.learnrec.exception.ResourceNotFoundException;
import com.learnrec.repository.CategoryRepository;
import com.learnrec.repository.ContentRepository;
import com.learnrec.repository.TagRepository;
import com.learnrec.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentServiceImpl implements ContentService {

    private final ContentRepository contentRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ContentResponse> getAllContent(int page, int size, Long categoryId, ContentType contentType, DifficultyLevel difficultyLevel, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "ratingAvg"));
        Page<Content> contentPage;

        if (StringUtils.hasText(keyword)) {
            contentPage = contentRepository.searchByKeyword(keyword.trim(), pageable);
        } else if (categoryId != null || contentType != null || difficultyLevel != null) {
            contentPage = contentRepository.filterContents(categoryId, contentType, difficultyLevel, pageable);
        } else {
            contentPage = contentRepository.findByIsPublishedTrue(pageable);
        }

        Page<ContentResponse> responsePage = contentPage.map(this::mapToContentResponse);
        return PagedResponse.of(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public ContentResponse getContentById(Long id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found with id: " + id));

        return mapToContentResponse(content);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(cat -> CategoryResponse.builder()
                        .id(cat.getId())
                        .name(cat.getName())
                        .slug(cat.getSlug())
                        .description(cat.getDescription())
                        .contentCount(cat.getContents() != null ? cat.getContents().size() : 0)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(t -> TagResponse.builder()
                        .id(t.getId())
                        .name(t.getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ContentResponse createContent(ContentRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Set<Tag> tags = resolveOrCreateTags(request.getTags());

        Content content = Content.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .contentType(request.getContentType())
                .difficultyLevel(request.getDifficultyLevel())
                .url(request.getUrl())
                .authorOrInstructor(request.getAuthorOrInstructor())
                .category(category)
                .tags(tags)
                .isPublished(true)
                .ratingAvg(BigDecimal.ZERO)
                .ratingCount(0)
                .build();

        Content saved = contentRepository.save(content);
        return mapToContentResponse(saved);
    }

    @Override
    @Transactional
    public ContentResponse updateContent(Long id, ContentRequest request) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Set<Tag> tags = resolveOrCreateTags(request.getTags());

        content.setTitle(request.getTitle());
        content.setDescription(request.getDescription());
        content.setContentType(request.getContentType());
        content.setDifficultyLevel(request.getDifficultyLevel());
        content.setUrl(request.getUrl());
        content.setAuthorOrInstructor(request.getAuthorOrInstructor());
        content.setCategory(category);
        content.setTags(tags);

        Content updated = contentRepository.save(content);
        return mapToContentResponse(updated);
    }

    @Override
    @Transactional
    public void deleteContent(Long id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found with id: " + id));
        contentRepository.delete(content);
    }

    private Set<Tag> resolveOrCreateTags(Set<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return new HashSet<>();
        }
        return tagNames.stream()
                .map(name -> tagRepository.findByName(name.trim())
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(name.trim()).build())))
                .collect(Collectors.toSet());
    }

    private ContentResponse mapToContentResponse(Content content) {
        Set<String> tagNames = content.getTags() != null ?
                content.getTags().stream().map(Tag::getName).collect(Collectors.toSet()) :
                new HashSet<>();

        return ContentResponse.builder()
                .id(content.getId())
                .title(content.getTitle())
                .description(content.getDescription())
                .contentType(content.getContentType().name())
                .difficultyLevel(content.getDifficultyLevel().name())
                .url(content.getUrl())
                .authorOrInstructor(content.getAuthorOrInstructor())
                .ratingAvg(content.getRatingAvg())
                .ratingCount(content.getRatingCount())
                .categoryId(content.getCategory().getId())
                .categoryName(content.getCategory().getName())
                .tags(tagNames)
                .isPublished(content.getIsPublished())
                .createdAt(content.getCreatedAt())
                .build();
    }
}
