package com.findit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for AI Content Validation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiValidationRequestDTO {

    @NotBlank(message = "Title is required for validation")
    private String title;

    @NotBlank(message = "Description is required for validation")
    private String description;
}
