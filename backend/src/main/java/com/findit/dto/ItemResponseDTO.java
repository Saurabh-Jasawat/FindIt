package com.findit.dto;

import com.findit.entity.Category;
import com.findit.entity.ItemStatus;
import com.findit.entity.ItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO representing the output payload for an Item post.
 * Exposes entity fields safely without leaking JPA internal metadata.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponseDTO {

    private Long id;
    private ItemType type;
    private String title;
    private String description;
    private Category category;
    private String location;
    private String imageUrl;
    private LocalDate date;
    private ItemStatus status;
    private String contactName;
    private String contactPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
