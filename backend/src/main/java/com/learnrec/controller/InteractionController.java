package com.learnrec.controller;

import com.learnrec.dto.common.ApiResponse;
import com.learnrec.dto.request.InteractionRequest;
import com.learnrec.dto.response.InteractionResponse;
import com.learnrec.security.UserDetailsImpl;
import com.learnrec.service.InteractionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interactions")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class InteractionController {

    private final InteractionService interactionService;

    @PostMapping
    public ResponseEntity<ApiResponse<InteractionResponse>> recordInteraction(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal,
            @Valid @RequestBody InteractionRequest request
    ) {
        InteractionResponse response = interactionService.recordInteraction(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Interaction recorded", response), HttpStatus.CREATED);
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<InteractionResponse>>> getUserInteractions(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal
    ) {
        List<InteractionResponse> history = interactionService.getUserInteractions(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<ApiResponse<List<InteractionResponse>>> getUserBookmarks(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal
    ) {
        List<InteractionResponse> bookmarks = interactionService.getUserBookmarks(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(bookmarks));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeInteraction(
            @AuthenticationPrincipal UserDetailsImpl userPrincipal,
            @PathVariable Long id
    ) {
        interactionService.removeInteraction(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Interaction removed", null));
    }
}
