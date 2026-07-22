package com.findit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for AI Category Suggestion.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiCategoryRequestDTO {

    @NotBlank(message = "Title is required for category suggestion")
    private String title;
}
