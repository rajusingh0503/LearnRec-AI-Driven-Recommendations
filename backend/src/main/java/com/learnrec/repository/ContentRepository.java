package com.learnrec.repository;

import com.learnrec.entity.Content;
import com.learnrec.enums.ContentType;
import com.learnrec.enums.DifficultyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {

    Page<Content> findByIsPublishedTrue(Pageable pageable);

    Page<Content> findByCategoryIdAndIsPublishedTrue(Long categoryId, Pageable pageable);

    Page<Content> findByContentTypeAndIsPublishedTrue(ContentType contentType, Pageable pageable);

    Page<Content> findByDifficultyLevelAndIsPublishedTrue(DifficultyLevel difficultyLevel, Pageable pageable);

    @Query("SELECT c FROM Content c WHERE c.isPublished = true AND (" +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.authorOrInstructor) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Content> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT c FROM Content c WHERE c.isPublished = true " +
           "AND (:categoryId IS NULL OR c.category.id = :categoryId) " +
           "AND (:contentType IS NULL OR c.contentType = :contentType) " +
           "AND (:difficultyLevel IS NULL OR c.difficultyLevel = :difficultyLevel)")
    Page<Content> filterContents(
        @Param("categoryId") Long categoryId,
        @Param("contentType") ContentType contentType,
        @Param("difficultyLevel") DifficultyLevel difficultyLevel,
        Pageable pageable
    );

    List<Content> findTop10ByIsPublishedTrueOrderByRatingAvgDesc();

    List<Content> findByIsPublishedTrue();
}
