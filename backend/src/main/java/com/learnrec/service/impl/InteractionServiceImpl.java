package com.learnrec.service.impl;

import com.learnrec.dto.request.InteractionRequest;
import com.learnrec.dto.response.InteractionResponse;
import com.learnrec.entity.Content;
import com.learnrec.entity.User;
import com.learnrec.entity.UserInteraction;
import com.learnrec.enums.InteractionType;
import com.learnrec.exception.ResourceNotFoundException;
import com.learnrec.repository.ContentRepository;
import com.learnrec.repository.UserInteractionRepository;
import com.learnrec.repository.UserRepository;
import com.learnrec.service.InteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InteractionServiceImpl implements InteractionService {

    private final UserInteractionRepository interactionRepository;
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;

    @Override
    @Transactional
    public InteractionResponse recordInteraction(Long userId, InteractionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Content content = contentRepository.findById(request.getContentId())
                .orElseThrow(() -> new ResourceNotFoundException("Content not found with id: " + request.getContentId()));

        // Check if an existing interaction of this type exists to update, or create a new one
        UserInteraction interaction = interactionRepository
                .findByUserIdAndContentIdAndInteractionType(userId, request.getContentId(), request.getInteractionType())
                .orElseGet(() -> UserInteraction.builder()
                        .user(user)
                        .content(content)
                        .interactionType(request.getInteractionType())
                        .build());

        if (request.getRatingValue() != null) {
            interaction.setRatingValue(request.getRatingValue());
        }

        UserInteraction saved = interactionRepository.save(interaction);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InteractionResponse> getUserInteractions(Long userId) {
        return interactionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InteractionResponse> getUserBookmarks(Long userId) {
        return interactionRepository.findByUserIdAndInteractionTypeOrderByCreatedAtDesc(userId, InteractionType.BOOKMARK).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeInteraction(Long userId, Long interactionId) {
        UserInteraction interaction = interactionRepository.findById(interactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interaction not found with id: " + interactionId));

        if (!interaction.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Interaction not found for this user");
        }

        interactionRepository.delete(interaction);
    }

    private InteractionResponse mapToResponse(UserInteraction interaction) {
        return InteractionResponse.builder()
                .id(interaction.getId())
                .contentId(interaction.getContent().getId())
                .contentTitle(interaction.getContent().getTitle())
                .contentType(interaction.getContent().getContentType().name())
                .categoryName(interaction.getContent().getCategory().getName())
                .interactionType(interaction.getInteractionType().name())
                .ratingValue(interaction.getRatingValue())
                .createdAt(interaction.getCreatedAt())
                .build();
    }
}
