package com.findit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for the AI Description Generation Response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiResponseDTO {

    private String description;
}
