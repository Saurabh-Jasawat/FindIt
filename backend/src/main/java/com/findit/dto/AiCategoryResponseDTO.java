package com.findit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for AI Category Suggestion.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiCategoryResponseDTO {

    private String suggestedCategory;
}
