package com.findit.dto;

import com.findit.entity.Category;
import com.findit.entity.ItemStatus;
import com.findit.entity.ItemType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Request DTO for creating or updating a Lost/Found item report.
 * Bean Validation annotations ensure all inputs meet strict application rules.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequestDTO {

    @NotNull(message = "Item type (LOST/FOUND) is required")
    private ItemType type;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Category is required")
    private Category category;

    @NotBlank(message = "Location is required")
    private String location;

    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    private String imageUrl;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private ItemStatus status; // Optional in request, defaults to ACTIVE

    @NotBlank(message = "Contact name is required")
    private String contactName;

    @NotBlank(message = "Contact phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be a valid 10-digit number")
    private String contactPhone;
}
