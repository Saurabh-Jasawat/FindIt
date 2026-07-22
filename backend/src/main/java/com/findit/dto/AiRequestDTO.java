package com.findit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for the AI Description Generation Request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiRequestDTO {

    @NotBlank(message = "Title is required to generate description")
    private String title;

    @NotBlank(message = "Category is required to generate description")
    private String category;

    @NotBlank(message = "Location is required to generate description")
    private String location;
}
