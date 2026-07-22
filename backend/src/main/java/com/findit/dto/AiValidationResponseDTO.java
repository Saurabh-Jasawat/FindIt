package com.findit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for AI Content Validation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiValidationResponseDTO {

    private String status; // "VALID" or "WARNING"
    private List<String> warnings;
}
