package com.learnrec.service;

import com.learnrec.dto.request.InteractionRequest;
import com.learnrec.dto.response.InteractionResponse;

import java.util.List;

public interface InteractionService {
    InteractionResponse recordInteraction(Long userId, InteractionRequest request);
    List<InteractionResponse> getUserInteractions(Long userId);
    List<InteractionResponse> getUserBookmarks(Long userId);
    void removeInteraction(Long userId, Long interactionId);
}
