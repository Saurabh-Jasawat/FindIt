package com.findit.controller;

import com.findit.dto.*;
import com.findit.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller exposing AI-assisted helper APIs under /api/ai.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    /**
     * POST /api/ai/generate-description
     * Generates a professional Lost & Found description based on title, category, and location.
     */
    @PostMapping("/generate-description")
    public ResponseEntity<ApiResponse<AiResponseDTO>> generateDescription(
            @Valid @RequestBody AiRequestDTO request) {

        AiResponseDTO response = aiService.generateDescription(request);
        return ResponseEntity.ok(ApiResponse.success("Description generated successfully", response));
    }

    /**
     * POST /api/ai/suggest-category
     * Suggests the best category enum based on item title.
     */
    @PostMapping("/suggest-category")
    public ResponseEntity<ApiResponse<AiCategoryResponseDTO>> suggestCategory(
            @Valid @RequestBody AiCategoryRequestDTO request) {

        AiCategoryResponseDTO response = aiService.suggestCategory(request);
        return ResponseEntity.ok(ApiResponse.success("Category suggested successfully", response));
    }

    /**
     * POST /api/ai/validate
     * Evaluates description quality and realism to return helper alerts/warnings.
     */
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<AiValidationResponseDTO>> validateContent(
            @Valid @RequestBody AiValidationRequestDTO request) {

        AiValidationResponseDTO response = aiService.validateContent(request);
        return ResponseEntity.ok(ApiResponse.success("Content validated successfully", response));
    }
}
