package com.learnrec.repository;

import com.learnrec.entity.UserInteraction;
import com.learnrec.enums.InteractionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {

    List<UserInteraction> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<UserInteraction> findByUserIdAndInteractionTypeOrderByCreatedAtDesc(Long userId, InteractionType interactionType);

    Optional<UserInteraction> findByUserIdAndContentIdAndInteractionType(Long userId, Long contentId, InteractionType interactionType);

    Long countByContentIdAndInteractionType(Long contentId, InteractionType interactionType);

    List<UserInteraction> findByUserId(Long userId);
}
