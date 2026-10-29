package com.learnrec.repository;

import com.learnrec.entity.RecommendationHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationHistoryRepository extends JpaRepository<RecommendationHistory, Long> {

    List<RecommendationHistory> findByUserIdOrderByServedAtDesc(Long userId, Pageable pageable);

    List<RecommendationHistory> findTop20ByUserIdOrderByServedAtDesc(Long userId);
}
